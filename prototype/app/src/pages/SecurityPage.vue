<script setup lang="ts">
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const store = usePrototypeStore();

const methods = [
  { key: 'face', title: '面容解锁', desc: 'iOS 首选，单手进入速度更快' },
  { key: 'fingerprint', title: '指纹解锁', desc: 'Android 兼容性更稳' },
  { key: 'pattern', title: '图案解锁', desc: '适合不方便录入密码的场景' },
  { key: 'password', title: '密码兜底', desc: '始终保留一条可靠的后备路径' },
] as const;
</script>

<template>
  <ScreenLayout
    title="安全设置"
    eyebrow="P4-2 解锁方式"
    icon="shield_lock"
    :show-tabs="false"
    :show-back="true"
  >
    <section class="intro card">
      <p class="section-title">当前主方式</p>
      <h2>
        {{
          methods.find((item) => item.key === store.state.preferences.unlockMethod)?.title
        }}
      </h2>
      <p>正式项目里这里会按端能力调用 Face ID / 指纹 / 手势模块，这版原型先演示配置与切换。</p>
    </section>

    <section class="list-stack">
      <article
        v-for="method in methods"
        :key="method.key"
        class="method card"
        :class="{ active: store.state.preferences.unlockMethod === method.key }"
      >
        <div>
          <strong>{{ method.title }}</strong>
          <p>{{ method.desc }}</p>
        </div>
        <button
          class="button-secondary choose"
          type="button"
          @click="store.setUnlockMethod(method.key)"
        >
          {{ store.state.preferences.unlockMethod === method.key ? '已启用' : '设为默认' }}
        </button>
      </article>
    </section>
  </ScreenLayout>
</template>

<style scoped>
.intro,
.method {
  padding: 22px;
}

.intro h2 {
  margin: 10px 0 8px;
  font-size: 30px;
  color: var(--primary-strong);
}

.intro p:last-child {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.method {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
}

.method.active {
  border-color: rgba(31, 139, 77, 0.18);
  box-shadow: 0 16px 28px rgba(31, 139, 77, 0.08);
}

.method strong {
  display: block;
  margin-bottom: 4px;
  font-size: 18px;
}

.method p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
  line-height: 1.7;
}

.choose {
  min-width: 108px;
}
</style>
