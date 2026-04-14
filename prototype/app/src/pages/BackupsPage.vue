<script setup lang="ts">
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const store = usePrototypeStore();
</script>

<template>
  <ScreenLayout
    title="备份与恢复"
    eyebrow="P4-6 数据安全"
    icon="cloud_upload"
    :show-tabs="false"
    :show-back="true"
  >
    <section class="hero card">
      <p class="section-title">原型说明</p>
      <h2>当前页面模拟云端备份能力</h2>
      <p>点击“立即备份”会生成一条新的本地备份记录；点击“恢复 Demo”会把原型重置到初始 Mock 状态。</p>
      <div class="actions">
        <button class="button-primary" type="button" @click="store.addBackup">立即备份</button>
        <button class="button-secondary" type="button" @click="store.restoreDemo">恢复 Demo</button>
      </div>
    </section>

    <section class="list-stack">
      <article v-for="item in store.state.backups" :key="item.id" class="backup card">
        <div class="backup-head">
          <div>
            <strong>{{ item.label }}</strong>
            <p>{{ item.createdAt }}</p>
          </div>
          <span class="status-pill" :class="item.type === 'auto' ? 'primary' : 'success'">
            {{ item.type === 'auto' ? '自动' : '手动' }}
          </span>
        </div>
        <p class="muted">{{ item.summary }}</p>
      </article>
    </section>
  </ScreenLayout>
</template>

<style scoped>
.hero,
.backup {
  padding: 22px;
}

.hero h2 {
  margin: 10px 0 8px;
  font-size: 30px;
  color: var(--primary-strong);
}

.hero p:last-child {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 18px;
}

.backup-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.backup strong {
  display: block;
  margin-bottom: 6px;
  font-size: 18px;
}

.backup p {
  margin: 0;
}
</style>
