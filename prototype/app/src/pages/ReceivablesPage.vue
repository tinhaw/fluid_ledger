<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';
import { formatCurrency } from '../utils/format';

const router = useRouter();
const store = usePrototypeStore();
const remindedId = ref<string | null>(null);

const remind = (id: string) => {
  remindedId.value = id;
};
</script>

<template>
  <ScreenLayout
    title="待收明细"
    eyebrow="P3-2 账款追踪"
    icon="payments"
    :show-tabs="false"
    :show-back="true"
  >
    <section class="hero card">
      <p class="section-title">待收账款</p>
      <h2>{{ formatCurrency(store.totalReceivable) }}</h2>
      <div class="hero-row">
        <div>
          <span>逾期金额</span>
          <strong>{{ formatCurrency(store.overdueReceivables) }}</strong>
        </div>
        <div>
          <span>本月新增</span>
          <strong>{{ store.state.receivables.length }} 笔</strong>
        </div>
      </div>
    </section>

    <section class="subtabs">
      <button class="tab active" type="button">待收</button>
      <button class="tab" type="button" @click="router.push({ name: 'payables' })">待付</button>
      <button class="tab" type="button" @click="router.push({ name: 'settings' })">设置</button>
    </section>

    <section class="list-stack">
      <table class="rec-table">
        <thead>
          <tr>
            <th>日期</th>
            <th>客户</th>
            <th>备注</th>
            <th>状态</th>
            <th class="num">金额</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in store.state.receivables" :key="item.id" :class="{ overdue: item.overdue }">
            <td class="time-cell">{{ item.createdAt }}</td>
            <td><strong>{{ item.customer }}</strong></td>
            <td class="note-cell">{{ item.note }}</td>
            <td>
              <span class="status-pill" :class="item.overdue ? 'warning' : 'primary'">{{ item.dueLabel }}</span>
              <span v-if="remindedId === item.id" class="status-pill success nudge">已生成催款文案</span>
            </td>
            <td class="num amount">{{ formatCurrency(item.amount) }}</td>
            <td>
              <div class="btn-group">
                <button class="button-secondary sm" type="button" @click="remind(item.id)">催一下</button>
                <button class="button-primary sm" type="button" @click="store.collectReceivable(item.id)">已收</button>
              </div>
            </td>
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
  color: var(--primary-strong);
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
  background: rgba(26, 35, 126, 0.05);
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
  background: linear-gradient(135deg, #2733a3 0%, #121c66 100%);
}

.list-stack {
  border-radius: 18px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 2px 12px rgba(26, 35, 126, 0.06);
  overflow: hidden;
}

.rec-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.rec-table thead tr {
  border-bottom: 1.5px solid rgba(26,35,126,0.08);
}

.rec-table th {
  padding: 10px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  white-space: nowrap;
}

.rec-table td {
  padding: 11px 12px;
  border-bottom: 1px solid rgba(26,35,126,0.05);
  vertical-align: middle;
}

.rec-table tbody tr:last-child td {
  border-bottom: none;
}

.rec-table tbody tr.overdue td:first-child {
  border-left: 3px solid rgba(217, 72, 65, 0.8);
}

.time-cell {
  white-space: nowrap;
  color: var(--text-soft);
  font-size: 12px;
}

.note-cell {
  color: var(--text-soft);
  font-size: 12px;
}

.num {
  text-align: right;
  white-space: nowrap;
}

.amount {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary-strong);
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

.nudge {
  display: block;
  margin-top: 4px;
}
</style>
