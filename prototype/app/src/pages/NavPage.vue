<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const tabs = [
  { icon: 'chat_bubble', label: '首页', sub: 'AI 对话记账', route: 'home', color: '#1A237E', bg: 'rgba(26,35,126,0.08)' },
  { icon: 'inventory_2', label: '库存', sub: '商品库存管理', route: 'inventory', color: '#2E7D32', bg: 'rgba(46,125,50,0.08)' },
  { icon: 'receipt_long', label: '账本', sub: '待收 / 待付明细', route: 'ledger', color: '#1565C0', bg: 'rgba(21,101,192,0.08)' },
  { icon: 'person', label: '我的', sub: '设置与安全', route: 'settings', color: '#6A1B9A', bg: 'rgba(106,27,154,0.08)' },
];
</script>

<template>
  <div class="prototype-shell">
    <div class="phone-frame nav-page">
      <header class="nav-header">
        <span class="icon fill brand-icon">account_balance_wallet</span>
        <div>
          <p class="nav-eyebrow">原型导航</p>
          <h1 class="nav-title">云端账本</h1>
        </div>
      </header>

      <main class="nav-body">
        <button
          v-for="tab in tabs"
          :key="tab.route"
          class="nav-card"
          type="button"
          :style="{ '--accent': tab.color, '--bg': tab.bg }"
          @click="router.push({ name: tab.route })"
        >
          <span class="nav-card-icon icon fill">{{ tab.icon }}</span>
          <div class="nav-card-text">
            <span class="nav-card-label">{{ tab.label }}</span>
            <span class="nav-card-sub">{{ tab.sub }}</span>
          </div>
          <span class="icon nav-card-arrow">chevron_right</span>
        </button>
      </main>
    </div>
  </div>
</template>

<style scoped>
.nav-page {
  display: flex;
  flex-direction: column;
  background: #f8f9ff;
  overflow: hidden;
}

.nav-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 28px 22px 16px;
  background: rgba(248, 249, 255, 0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(26, 35, 126, 0.07);
  flex-shrink: 0;
}

.brand-icon {
  font-size: 32px;
  color: #1a237e;
}

.nav-eyebrow {
  margin: 0 0 3px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #667085;
}

.nav-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #000666;
  letter-spacing: -0.02em;
}

.nav-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 20px 32px;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.nav-body::-webkit-scrollbar {
  display: none;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px 22px;
  border-radius: 22px;
  background: var(--bg);
  border: 1.5px solid color-mix(in srgb, var(--accent) 14%, transparent);
  text-align: left;
  transition: transform 0.12s, box-shadow 0.12s;
}

.nav-card:active {
  transform: scale(0.97);
}

.nav-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
  font-size: 28px;
  flex-shrink: 0;
}

.nav-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.nav-card-label {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: -0.01em;
}

.nav-card-sub {
  font-size: 12px;
  font-weight: 600;
  color: #667085;
}

.nav-card-arrow {
  font-size: 22px;
  color: color-mix(in srgb, var(--accent) 40%, transparent);
}
</style>
