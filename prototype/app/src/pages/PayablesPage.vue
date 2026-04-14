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
      <table class="pay-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>供应商</th>
            <th class="status-th">状态</th>
            <th class="num">金额</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.state.payables" :key="item.id" :class="{ overdue: item.overdue }">
            <td class="time-cell">
              <span class="time-date">{{ item.createdAt.split(' ')[0] }}</span>
              <span class="time-hour">{{ item.createdAt.split(' ').slice(1).join(' ') }}</span>
            </td>
            <td><strong style="font-size:11px">{{ item.supplier }}</strong></td>
            <td class="status-cell">
              <span class="status-pill" :class="item.overdue ? 'warning' : 'primary'">{{ item.dueLabel }}</span>
            </td>
            <td class="num amount">{{ formatCurrency(item.amount) }}</td>
            <td class="note-cell">{{ item.note }}</td>
          </tr>
        </tbody>
      </table>
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

.list-stack {
  border-radius: 18px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 2px 12px rgba(26, 35, 126, 0.06);
  overflow: hidden;
}

.pay-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.pay-table thead tr {
  border-bottom: 1.5px solid rgba(217,72,65,0.1);
}

.pay-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  white-space: nowrap;
}

.pay-table td {
  padding: 11px 12px;
  border-bottom: 1px solid rgba(217,72,65,0.05);
  vertical-align: middle;
}

.pay-table tbody tr:last-child td {
  border-bottom: none;
}

.pay-table tbody tr.overdue td:first-child {
  border-left: 3px solid rgba(217, 72, 65, 0.8);
}

.time-cell {
  color: var(--text-soft);
  font-size: 12px;
}

.time-date {
  display: block;
  white-space: nowrap;
}

.time-hour {
  display: block;
  white-space: nowrap;
  opacity: 0.7;
}

.status-th {
  min-width: 90px;
}

.status-cell {
  min-width: 90px;
}

.status-cell .status-pill {
  font-size: 9px;
}

.note-cell {
  color: var(--text-soft);
  font-size: 10px;
}

.num {
  text-align: right;
  white-space: nowrap;
}

.amount {
  font-size: 14px;
  font-weight: 800;
  color: var(--warning);
}

.btn-group {
  display: flex;
  gap: 6px;
  white-space: nowrap;
}

.sm {
  min-height: 32px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 10px;
}
</style>
