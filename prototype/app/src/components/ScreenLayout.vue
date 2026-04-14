<script setup lang="ts">
import { useRouter } from 'vue-router';
import BottomTabs from './BottomTabs.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    eyebrow?: string;
    icon?: string;
    showTabs?: boolean;
    showBack?: boolean;
    showNavBtn?: boolean;
  }>(),
  {
    eyebrow: '',
    icon: 'account_balance_wallet',
    showTabs: true,
    showBack: false,
    showNavBtn: false,
  },
);

const router = useRouter();
</script>

<template>
  <div class="prototype-shell">
    <button
      v-if="props.showNavBtn"
      class="side-nav-btn"
      type="button"
      aria-label="原型导航"
      @click="router.push({ name: 'nav' })"
    >
      <span class="icon">grid_view</span>
    </button>
    <div class="phone-frame">
      <div class="page-scroll">
        <header class="screen-header">
          <div class="header-meta">
            <button
              v-if="props.showBack"
              class="header-icon"
              type="button"
              aria-label="返回"
              @click="router.back()"
            >
              <span class="icon">arrow_back</span>
            </button>
            <div v-else class="header-icon brand">
              <span class="icon fill">{{ props.icon }}</span>
            </div>
            <div>
              <p v-if="props.eyebrow" class="eyebrow">{{ props.eyebrow }}</p>
              <h1 class="title">{{ props.title }}</h1>
            </div>
          </div>
          <slot name="header-actions" />
        </header>

        <main class="screen-body" :class="{ withTabs: props.showTabs, withVoiceBar: !!$slots['bottom-bar'] }">
          <slot />
        </main>
      </div>

      <BottomTabs v-if="props.showTabs" />
      <slot name="bottom-bar" />
    </div>
  </div>
</template>

<style scoped>
.screen-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 14px;
  background: rgba(248, 249, 255, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 24px rgba(10, 20, 71, 0.09);
  color: var(--primary);
}

.header-icon.brand {
  background: linear-gradient(135deg, rgba(39, 51, 163, 0.12), rgba(39, 51, 163, 0.02));
}

.eyebrow {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-soft);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--primary-strong);
  letter-spacing: -0.02em;
}

.screen-body {
  padding: 8px 18px 24px;
}

.screen-body.withTabs {
  padding-bottom: 118px;
}

.screen-body.withVoiceBar {
  padding-bottom: 140px;
}

.prototype-shell {
  position: relative;
}

.side-nav-btn {
  position: fixed;
  top: 50vh;
  left: 20px;
  transform: translateY(-50%);
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(220, 20, 120, 0.25);
  color: #fff;
  font-size: 20px;
  box-shadow: 0 4px 14px rgba(200, 0, 100, 0.3);
  backdrop-filter: blur(6px);
  transition: background 0.15s, transform 0.12s;
}

.side-nav-btn:hover {
  background: rgba(220, 20, 120, 0.40);
}

.side-nav-btn:active {
  transform: scale(0.93);
}
</style>
