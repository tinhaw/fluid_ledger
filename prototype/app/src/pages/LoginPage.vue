<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const router = useRouter();
const store = usePrototypeStore();
const phone = ref('13800138000');
const code = ref('2468');

const enterPrototype = () => {
  store.login();
  router.push({ name: store.state.shopInitialized ? 'home' : 'setup' });
};
</script>

<template>
  <ScreenLayout title="欢迎回来" eyebrow="P-L1 登录 / 注册" icon="smartphone" :show-tabs="false">
    <section class="hero card">
      <p class="section-title">首发原型</p>
      <h2>对话记账、库存联动、账本总览一条线跑通</h2>
      <p>
        这版先用 Mock 数据演示主流程，不接真实验证码服务。输入手机号后可以直接进入原型。
      </p>
    </section>

    <section class="form-block">
      <label class="field">
        <span>手机号</span>
        <input v-model="phone" class="input" placeholder="请输入手机号" />
      </label>
      <label class="field">
        <span>验证码</span>
        <div class="inline-row">
          <input v-model="code" class="input" placeholder="4 位验证码" />
          <button class="button-ghost send-code" type="button">获取验证码</button>
        </div>
      </label>
    </section>

    <section class="tips card">
      <div class="tip-item">
        <span class="icon">mic</span>
        <div>
          <strong>语音优先</strong>
          <p>一句话就能生成待确认账目。</p>
        </div>
      </div>
      <div class="tip-item">
        <span class="icon">inventory_2</span>
        <div>
          <strong>库存同步</strong>
          <p>确认后自动联动库存和收支。</p>
        </div>
      </div>
      <div class="tip-item">
        <span class="icon">cloud_upload</span>
        <div>
          <strong>备份演示</strong>
          <p>在设置页可体验手动备份和恢复。</p>
        </div>
      </div>
    </section>

    <div class="actions">
      <button class="button-primary" type="button" @click="enterPrototype">进入原型</button>
      <button class="button-secondary" type="button" @click="enterPrototype">直接体验 Demo</button>
    </div>
  </ScreenLayout>
</template>

<style scoped>
.hero,
.tips {
  padding: 22px;
}

.hero h2 {
  margin: 10px 0 8px;
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  line-height: 1.35;
  color: var(--primary-strong);
}

.hero p:last-child {
  margin: 0;
  color: var(--text-soft);
}

.form-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 18px 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-soft);
  font-size: 14px;
  font-weight: 700;
}

.inline-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px;
  gap: 10px;
}

.send-code {
  min-height: 56px;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.tip-item .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(26, 35, 126, 0.08);
  color: var(--primary);
}

.tip-item strong {
  display: block;
  margin-bottom: 3px;
}

.tip-item p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
}

.actions {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}
</style>
