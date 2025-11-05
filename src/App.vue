<template>
  <v-app>
    <v-app-bar density="comfortable" color="primary" title="Vuetify Number Field" />
    <v-main>
      <v-container class="py-8" max-width="480">
        <v-card elevation="2">
          <v-card-text class="d-flex flex-column gap-6">
            <numeric-input-field
              v-model="amount"
              label="金額"
              :hint="'整数のみ／負数対応'"
              prepend-icon="mdi-currency-jpy"
              clearable
            />
            <v-list density="compact" bg-color="surface-variant">
              <v-list-subheader>現在の値</v-list-subheader>
              <v-list-item title="モデル値" :subtitle="modelValueLabel" />
              <v-list-item title="カンマ付き" :subtitle="formattedValue" />
            </v-list>
            <v-alert type="info" variant="tonal" class="mb-0">
              フォーカス時はカンマ無しで編集、フォーカスを外すとカンマ区切りで表示します。
            </v-alert>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import NumericInputField from './components/NumericInputField.vue'

const amount = ref<number | null>(123456789)

const formattedValue = computed(() => {
  if (amount.value === null) return '未入力'
  return amount.value.toLocaleString('ja-JP')
})

const modelValueLabel = computed(() => {
  if (amount.value === null) return 'null'
  return amount.value.toString()
})
</script>

<style scoped>
.gap-6 {
  gap: 24px;
}
</style>
