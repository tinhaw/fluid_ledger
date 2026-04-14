<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const tabs = [
  { label: '首页', icon: 'chat_bubble', routeName: 'home' },
  { label: '库存', icon: 'inventory_2', routeName: 'inventory' },
  { label: '账本', icon: 'receipt_long', routeName: 'ledger' },
  { label: '我的', icon: 'person', routeName: 'settings' },
];

const currentRoot = computed(() => {
  if (route.path.startsWith('/inventory')) return 'inventory';
  if (route.path.startsWith('/ledger')) return 'ledger';
  if (route.path.startsWith('/settings')) return 'settings';
  return 'home';
});
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.routeName"
      class="tab-button"
      :class="{ active: currentRoot === tab.routeName }"
      type="button"
      @click="router.push({ name: tab.routeName })"
    >
      <span class="icon" :class="{ fill: currentRoot === tab.routeName }">{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tab-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 14px 16px 18px;
  border-top: 1px solid rgba(26, 35, 126, 0.08);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
}

.tab-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 56px;
  border-radius: 18px;
  color: #667085;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
}

.tab-button.active {
  color: var(--primary);
  background: rgba(26, 35, 126, 0.07);
}
</style>
