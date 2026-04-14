<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePrototypeStore } from '../stores/prototype';

const router = useRouter();
const route = useRoute();
const store = usePrototypeStore();

onMounted(() => {
  if (route.query.manual) return;

  window.setTimeout(() => {
    if (!store.state.isLoggedIn) {
      router.replace({ name: 'login' });
      return;
    }

    if (!store.state.shopInitialized) {
      router.replace({ name: 'setup' });
      return;
    }

    router.replace({ name: 'home' });
  }, 1200);
});
</script>

<template>
  <div class="prototype-shell">
    <div class="phone-frame splash-page">
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>
      <div class="splash-content">
        <div class="brand-mark">
          <span class="icon fill">account_balance_wallet</span>
        </div>
        <p class="section-title">AI 记账原型</p>
        <h1 class="display-title">云端账本</h1>
        <p class="subtitle">
          面向个体生意人的智能记账助手，支持语音录入、库存联动、待收待付和备份演示。
        </p>
        <div class="loading-line">
          <span></span>
        </div>
        <button class="nav-shortcut" type="button" @click="router.push({ name: 'nav' })">
          <span class="icon">grid_view</span>
          原型导航
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash-page {
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top, rgba(53, 74, 210, 0.22), transparent 28%),
    linear-gradient(180deg, #f6f8ff 0%, #edf1fb 100%);
}

.glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(12px);
}

.glow-a {
  top: 92px;
  left: 36px;
  width: 120px;
  height: 120px;
  background: rgba(65, 96, 255, 0.14);
}

.glow-b {
  right: 24px;
  bottom: 160px;
  width: 148px;
  height: 148px;
  background: rgba(55, 175, 112, 0.12);
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(100%, 300px);
  text-align: center;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 88px;
  border-radius: 28px;
  color: #fff;
  background: linear-gradient(135deg, #2733a3 0%, #0f184f 100%);
  box-shadow: 0 20px 44px rgba(20, 31, 110, 0.28);
}

.brand-mark .icon {
  font-size: 42px;
}

.subtitle {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
  line-height: 1.7;
}

.loading-line {
  width: 180px;
  height: 8px;
  padding: 1px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(26, 35, 126, 0.08);
}

.loading-line span {
  display: block;
  width: 44%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #2230a7 0%, #61a8ff 100%);
  animation: loading 1.2s ease-in-out infinite;
}

@keyframes loading {
  0% {
    transform: translateX(-20%);
  }

  100% {
    transform: translateX(175%);
  }
}

.nav-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(26, 35, 126, 0.08);
  color: #1a237e;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}

.nav-shortcut:hover {
  background: rgba(26, 35, 126, 0.14);
}
</style>
