<script setup lang="ts">
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';
import { formatCurrency } from '../utils/format';

const router = useRouter();
const store = usePrototypeStore();
</script>

<template>
  <ScreenLayout
    title="待付明细"
    eyebrow="P3-1 账款追踪"
    icon="request_quote"
    :show-tabs="false"
    :show-back="true"
  >
    <section class="hero card">
      <p class="section-title">待付账款</p>
      <h2>{{ formatCurrency(store.totalPayable) }}</h2>
      <div class="hero-row">
        <div>
          <span>供应商笔数</span>
          <strong>{{ store.state.payables.length }} 笔</strong>
        </div>
        <div>
          <span>重点提醒</span>
          <strong>优先结清逾期款</strong>
        </div>
      </div>
    </section>

    <section class="subtabs">
      <button class="tab" type="button" @click="router.push({ name: 'receivables' })">待收</button>
      <button class="tab active" type="button">待付</button>
      <button class="tab" type="button" @click="router.push({ name: 'settings' })">设置</button>
    </section>

    <section class="list-stack">
      <article v-for="item in store.state.payables" :key="item.id" class="record card">
        <div class="record-head">
          <div>
            <p class="section-title">{{ item.createdAt }}</p>
            <h3>{{ item.supplier }}</h3>
          </div>
          <span class="amount">{{ formatCurrency(item.amount) }}</span>
        </div>
        <p class="muted">{{ item.note }}</p>
        <div class="meta-row">
          <span class="status-pill" :class="item.overdue ? 'warning' : 'primary'">{{ item.dueLabel }}</span>
        </div>
        <div class="actions">
          <button class="button-secondary" type="button">安排付款</button>
          <button class="button-primary" type="button" @click="store.settlePayable(item.id)">标记已付</button>
        </div>
      </article>
    </section>
  </ScreenLayout>
</template>

<style scoped>
.hero {
  padding: 22px;
}

.hero h2 {
  margin: 10px 0 0;
  font-size: 42px;
  color: var(--warning);
}

.hero-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.hero-row div {
  padding: 16px;
  border-radius: 20px;
  background: rgba(217, 72, 65, 0.06);
}

.hero-row span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-soft);
  font-size: 13px;
  font-weight: 700;
}

.hero-row strong {
  font-size: 22px;
}

.subtabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0;
}

.tab {
  min-height: 48px;
  border-radius: 18px;
  background: rgba(26, 35, 126, 0.06);
  color: var(--text-soft);
  font-weight: 800;
}

.tab.active {
  color: #fff;
  background: linear-gradient(135deg, #d94841 0%, #b42318 100%);
}

.record {
  padding: 18px;
}

.record-head {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: flex-start;
}

.record-head h3 {
  margin: 8px 0 0;
  font-size: 24px;
  color: var(--primary-strong);
}

.amount {
  font-size: 28px;
  font-weight: 800;
  color: var(--warning);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}
</style>
