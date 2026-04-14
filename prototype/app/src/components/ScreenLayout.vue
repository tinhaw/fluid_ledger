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
  }>(),
  {
    eyebrow: '',
    icon: 'account_balance_wallet',
    showTabs: true,
    showBack: false,
  },
);

const router = useRouter();
</script>

<template>
  <div class="prototype-shell">
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

        <main class="screen-body" :class="{ withTabs: props.showTabs }">
          <slot />
        </main>
      </div>

      <BottomTabs v-if="props.showTabs" />
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
  background: linear-gradient(180deg, rgba(248, 249, 255, 0.98) 0%, rgba(248, 249, 255, 0.9) 80%, transparent 100%);
  backdrop-filter: blur(16px);
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
</style>
