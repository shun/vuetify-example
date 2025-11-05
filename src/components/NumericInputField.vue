<template>
  <v-text-field
    v-bind="attrs"
    v-model="displayValue"
    type="text"
    inputmode="decimal"
    pattern="-?[0-9]*"
    class="numeric-input text-right"
    :variant="variant"
    :hint="hint"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown="handleKeydown"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, watch } from 'vue'

const props = defineProps<{
  modelValue: number | null | undefined
  variant?: 'filled' | 'outlined' | 'plain' | 'solo' | 'solo-filled' | 'solo-inverted' | 'underlined'
  hint?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const attrs = useAttrs()

const isFocused = ref(false)
const displayValue = ref('')

const plainValue = computed(() => {
  const value = props.modelValue
  if (value === null || value === undefined) return ''
  if (Number.isNaN(value)) return ''
  return Math.trunc(value).toString()
})

watch(
  () => props.modelValue,
  () => {
    if (isFocused.value) {
      displayValue.value = plainValue.value
    } else {
      displayValue.value = formatWithGrouping(plainValue.value)
    }
  },
  { immediate: true }
)

watch(
  () => displayValue.value,
  newValue => {
    if (!isFocused.value) return
    const sanitized = sanitizeInput(newValue)
    if (sanitized !== newValue) {
      // Defer update to avoid cursor jump issues.
      nextTick(() => {
        displayValue.value = sanitized
      })
      return
    }
    emit('update:modelValue', toNumericValue(sanitized))
  }
)

function sanitizeInput(value: string): string {
  if (!value) return ''
  let sanitized = value.replace(/,/g, '').replace(/[^0-9\-]/g, '')
  const isNegative = sanitized.startsWith('-')
  sanitized = sanitized.replace(/-/g, '')
  if (isNegative) sanitized = `-${sanitized}`
  // Keep a standalone minus for intermediate state.
  if (sanitized === '-') return sanitized
  const digits = sanitized.startsWith('-') ? sanitized.slice(1) : sanitized
  if (!digits) return ''
  const normalizedDigits = digits.replace(/^0+(?=\d)/, '')
  return sanitized.startsWith('-') ? `-${normalizedDigits}` : normalizedDigits
}

function formatWithGrouping(raw: string): string {
  if (!raw) return ''
  if (raw === '-') return raw
  const isNegative = raw.startsWith('-')
  const digits = isNegative ? raw.slice(1) : raw
  if (!digits) return isNegative ? '-' : ''
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return isNegative ? `-${grouped}` : grouped
}

function toNumericValue(sanitized: string): number | null {
  if (!sanitized || sanitized === '-') return null
  const numeric = Number.parseInt(sanitized, 10)
  return Number.isNaN(numeric) ? null : numeric
}

function handleFocus() {
  isFocused.value = true
  displayValue.value = plainValue.value
}

function handleBlur() {
  isFocused.value = false
  const sanitized = sanitizeInput(displayValue.value)
  const numericValue = toNumericValue(sanitized)
  emit('update:modelValue', numericValue)
  displayValue.value = formatWithGrouping(sanitized)
}

function handleKeydown(event: KeyboardEvent) {
  const allowedControlKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter']
  if (event.ctrlKey || event.metaKey) return
  if (allowedControlKeys.includes(event.key)) return

  if (event.key === '-') {
    const input = event.target as HTMLInputElement
    const { selectionStart, selectionEnd, value } = input
    const entireSelection = selectionStart === 0 && selectionEnd === value.length
    const hasMinus = value.startsWith('-')
    if (selectionStart === 0 && (!hasMinus || entireSelection)) {
      return
    }
    event.preventDefault()
    return
  }

  if (!/^[0-9]$/.test(event.key)) {
    event.preventDefault()
  }
}

const variant = computed(() => props.variant ?? 'outlined')
const hint = computed(() => props.hint ?? '整数のみ、マイナス記号可')
</script>

<style scoped>
.numeric-input :deep(input) {
  text-align: right;
}
</style>
