<script setup lang="ts">
import { computed, ref } from 'vue';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const store = usePrototypeStore();
const keyword = ref('');

const filteredItems = computed(() =>
  store.inventoryItems.filter((item) => {
    if (!keyword.value.trim()) return true;
    return item.name.includes(keyword.value.trim()) || item.category.includes(keyword.value.trim());
  }),
);
</script>

<template>
  <ScreenLayout title="库存管理" eyebrow="P2 商品与库存" icon="inventory_2">
    <section class="grid-two">
      <article class="overview total">
        <p class="metric-label">库存总件数</p>
        <p class="metric-value">{{ store.totalInventoryUnits }}</p>
        <span class="muted">含 {{ store.state.inventory.length }} 个商品</span>
      </article>
      <article class="overview low">
        <p class="metric-label">低库存 / 缺货</p>
        <p class="metric-value">{{ store.lowStockCount }}</p>
        <span class="muted">优先补货与临期处理</span>
      </article>
    </section>

    <section class="search card">
      <span class="icon">search</span>
      <input v-model="keyword" class="search-input" placeholder="搜索商品、分类或供应商" />
      <button class="filter-button" type="button">
        <span class="icon">tune</span>
      </button>
    </section>

    <section class="list-stack">
      <table class="inv-table">
        <thead>
          <tr>
            <th>商品</th>
            <th>分类</th>
            <th class="num">库存</th>
            <th>状态</th>
            <th class="num">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="item.id"
            :class="item.status"
          >
            <td class="name-cell">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-expiry">{{ item.expiryLabel }}</span>
            </td>
            <td>{{ item.category }}</td>
            <td class="num">
              <strong>{{ item.quantity }}</strong>
              <span class="unit">{{ item.unit }}</span>
            </td>
            <td>
              <span
                class="status-pill"
                :class="item.status === 'healthy' ? 'success' : item.status === 'low' ? 'warning' : 'primary'"
              >
                {{ item.status === 'healthy' ? '充足' : item.status === 'low' ? '低库存' : '缺货' }}
              </span>
            </td>
            <td class="num">
              <div class="stepper">
                <button type="button" @click="store.adjustInventory(item.id, -1)"><span class="icon">remove</span></button>
                <button type="button" @click="store.adjustInventory(item.id, 1)"><span class="icon">add</span></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </ScreenLayout>
</template>

<style scoped>
.overview {
  min-height: 148px;
  padding: 18px;
  border-radius: 28px;
  color: #fff;
}

.overview.total {
  background: linear-gradient(180deg, #2836a7 0%, #121d61 100%);
  box-shadow: 0 18px 32px rgba(17, 27, 95, 0.24);
}

.overview.low {
  color: var(--warning);
  background: linear-gradient(180deg, #ffffff 0%, #fff4f2 100%);
  border: 1px solid rgba(217, 72, 65, 0.08);
}

.overview .metric-label,
.overview .metric-value,
.overview .muted {
  color: inherit;
}

.overview .metric-value {
  margin-top: 18px;
  font-size: 40px;
}

.overview .muted {
  display: block;
  margin-top: 8px;
  opacity: 0.82;
}

.search {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) 42px;
  gap: 8px;
  align-items: center;
  margin: 18px 0;
  padding: 14px 16px;
}

.search .icon,
.filter-button {
  color: var(--text-soft);
}

.search-input {
  min-width: 0;
  background: transparent;
  color: var(--text);
  font-size: 15px;
  outline: none;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(26, 35, 126, 0.06);
}

.list-stack {
  overflow-x: auto;
  border-radius: 18px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 2px 12px rgba(26, 35, 126, 0.06);
}

.inv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.inv-table thead tr {
  border-bottom: 1.5px solid rgba(26,35,126,0.08);
}

.inv-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-soft);
  white-space: nowrap;
}

.inv-table td {
  padding: 12px 14px;
  border-bottom: 1px solid rgba(26,35,126,0.05);
  vertical-align: middle;
}

.inv-table tbody tr:last-child td {
  border-bottom: none;
}

.inv-table tbody tr.low td:first-child {
  border-left: 3px solid rgba(217, 72, 65, 0.8);
}

.inv-table tbody tr.healthy td:first-child {
  border-left: 3px solid rgba(31, 139, 77, 0.8);
}

.inv-table tbody tr.out td:first-child {
  border-left: 3px solid rgba(26, 35, 126, 0.4);
}

.num {
  text-align: right;
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-weight: 700;
  color: var(--primary-strong);
}

.item-expiry {
  font-size: 11px;
  color: var(--text-soft);
}

.unit {
  font-size: 11px;
  color: var(--text-soft);
  margin-left: 2px;
}

.stepper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.stepper button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  color: var(--primary);
  background: rgba(26, 35, 126, 0.07);
}
</style>
