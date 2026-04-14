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
      <article
        v-for="item in filteredItems"
        :key="item.id"
        class="inventory-item card"
        :class="item.status"
      >
        <div class="item-main">
          <div class="item-copy">
            <p class="section-title">{{ item.category }}</p>
            <h3>{{ item.name }}</h3>
            <p class="muted">{{ item.expiryLabel }}</p>
            <div class="status-row">
              <span
                class="status-pill"
                :class="
                  item.status === 'healthy'
                    ? 'success'
                    : item.status === 'low'
                      ? 'warning'
                      : 'primary'
                "
              >
                {{
                  item.status === 'healthy'
                    ? '库存充足'
                    : item.status === 'low'
                      ? '低库存'
                      : '已缺货'
                }}
              </span>
              <span class="muted">预警值 {{ item.threshold }}{{ item.unit }}</span>
            </div>
          </div>

          <div class="stepper">
            <button type="button" @click="store.adjustInventory(item.id, -1)">
              <span class="icon">remove</span>
            </button>
            <strong>{{ item.quantity }}</strong>
            <button type="button" @click="store.adjustInventory(item.id, 1)">
              <span class="icon">add</span>
            </button>
          </div>
        </div>
      </article>
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

.inventory-item {
  padding: 18px;
}

.inventory-item.low {
  border-left: 6px solid rgba(217, 72, 65, 0.8);
}

.inventory-item.healthy {
  border-left: 6px solid rgba(31, 139, 77, 0.8);
}

.inventory-item.out {
  border-left: 6px solid rgba(26, 35, 126, 0.4);
}

.item-main {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.item-copy h3 {
  margin: 8px 0 6px;
  font-size: 24px;
  color: var(--primary-strong);
}

.item-copy p {
  margin: 0;
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 14px;
}

.stepper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 22px;
  background: rgba(26, 35, 126, 0.05);
}

.stepper button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  color: var(--primary);
  background: rgba(255, 255, 255, 0.94);
}

.stepper strong {
  min-width: 30px;
  text-align: center;
  font-size: 24px;
  color: var(--primary-strong);
}
</style>
