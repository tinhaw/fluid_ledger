<script setup lang="ts">
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';
import { formatCompactCurrency, formatCurrency } from '../utils/format';

const router = useRouter();
const store = usePrototypeStore();
</script>

<template>
  <ScreenLayout title="账本总览" eyebrow="P3 应收应付与利润" icon="receipt_long">
    <section class="hero card">
      <div class="hero-top">
        <div>
          <p class="section-title">今日经营概览</p>
          <h2>资金、利润、往来一屏看清</h2>
        </div>
        <button class="button-ghost mini" type="button">AI 建议</button>
      </div>

      <div class="hero-grid">
        <button class="hero-tile receivable" type="button" @click="router.push({ name: 'receivables' })">
          <span>待收账款</span>
          <strong>{{ formatCompactCurrency(store.totalReceivable) }}</strong>
          <small>点击查看明细</small>
        </button>
        <button class="hero-tile payable" type="button" @click="router.push({ name: 'payables' })">
          <span>待付账款</span>
          <strong>{{ formatCompactCurrency(store.totalPayable) }}</strong>
          <small>点击查看明细</small>
        </button>
      </div>

      <div class="profit-card">
        <div>
          <p class="metric-label">本月已实现利润</p>
          <p class="metric-value">{{ formatCurrency(store.monthlyProfit) }}</p>
        </div>
        <span class="status-pill success">经营状态稳定</span>
      </div>
    </section>

    <section class="list-stack suggestions">
      <article v-for="tip in store.suggestions" :key="tip" class="suggestion card">
        <span class="icon">auto_awesome</span>
        <p>{{ tip }}</p>
      </article>
    </section>

    <section class="transactions">
      <div class="section-header">
        <div>
          <p class="section-title">最近流水</p>
          <h3>今天发生了什么</h3>
        </div>
      </div>

      <table class="txn-table">
        <thead>
          <tr>
            <th>时间</th>
            <th>标题</th>
            <th>摘要</th>
            <th class="num">金额</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="txn in store.state.transactions.slice(0, 6)" :key="txn.id">
            <td class="time-cell">{{ txn.happenedAt }}</td>
            <td><strong>{{ txn.title }}</strong></td>
            <td class="summary-cell">{{ txn.summary }}</td>
            <td
              class="num amount"
              :class="txn.type === 'sale_paid' || txn.type === 'collection' ? 'income' : 'expense'"
            >
              {{ txn.type === 'sale_paid' || txn.type === 'collection' ? '+' : '-' }}{{ formatCurrency(txn.amount) }}
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

.hero-top {
  display: flex;
  gap: 14px;
  justify-content: space-between;
  align-items: flex-start;
}

.hero h2 {
  margin: 10px 0 0;
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  line-height: 1.35;
  color: var(--primary-strong);
}

.mini {
  min-height: 42px;
  padding-inline: 14px;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.hero-tile {
  min-height: 154px;
  padding: 18px;
  border-radius: 26px;
  text-align: left;
}

.hero-tile.receivable {
  color: #fff;
  background: linear-gradient(180deg, #2836a7 0%, #121d61 100%);
}

.hero-tile.payable {
  color: var(--warning);
  background: linear-gradient(180deg, #ffffff 0%, #fff4f2 100%);
  border: 1px solid rgba(217, 72, 65, 0.1);
}

.hero-tile span,
.hero-tile small {
  display: block;
}

.hero-tile span {
  font-size: 13px;
  font-weight: 700;
}

.hero-tile strong {
  display: block;
  margin: 18px 0 8px;
  font-size: 34px;
}

.hero-tile small {
  opacity: 0.78;
}

.profit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(26, 35, 126, 0.05);
}

.suggestions {
  margin-top: 18px;
}

.suggestion {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px;
}

.suggestion .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: var(--primary);
  background: rgba(26, 35, 126, 0.08);
}

.suggestion p {
  margin: 0;
  line-height: 1.7;
}

.transactions {
  margin-top: 20px;
  border-radius: 18px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 2px 12px rgba(26, 35, 126, 0.06);
  overflow: hidden;
}

.section-header {
  padding: 16px 16px 0;
  margin-bottom: 0;
}

.txn-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.txn-table thead tr {
  border-bottom: 1.5px solid rgba(26,35,126,0.08);
}

.txn-table th {
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  white-space: nowrap;
}

.txn-table td {
  padding: 11px 14px;
  border-bottom: 1px solid rgba(26,35,126,0.05);
  vertical-align: middle;
}

.txn-table tbody tr:last-child td {
  border-bottom: none;
}

.time-cell {
  white-space: nowrap;
  color: var(--text-soft);
  font-size: 12px;
}

.summary-cell {
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
}

.amount.income {
  color: var(--success);
}

.amount.expense {
  color: var(--warning);
}
</style>
