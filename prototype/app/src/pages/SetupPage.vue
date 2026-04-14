<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const router = useRouter();
const store = usePrototypeStore();

const form = reactive({
  shopName: store.state.profile.shopName,
  ownerName: store.state.profile.ownerName,
  city: store.state.profile.city,
  category: store.state.profile.category,
});

const submit = () => {
  store.setupShop(form);
  router.push({ name: 'home' });
};
</script>

<template>
  <ScreenLayout title="店铺初始化" eyebrow="P-L3 首次配置" icon="storefront" :show-tabs="false">
    <section class="hero card">
      <p class="section-title">只填关键字段</p>
      <h2>先把账本开起来，复杂配置后面再补</h2>
      <p>首发原型先收集店铺名、老板称呼和城市，用来生成后续页面的默认上下文。</p>
    </section>

    <section class="form-block">
      <label class="field">
        <span>店铺名称</span>
        <input v-model="form.shopName" class="input" placeholder="例如：老王便民店" />
      </label>
      <label class="field">
        <span>老板称呼</span>
        <input v-model="form.ownerName" class="input" placeholder="例如：王叔" />
      </label>
      <label class="field">
        <span>所在城市</span>
        <input v-model="form.city" class="input" placeholder="例如：山东临沂" />
      </label>
      <label class="field">
        <span>经营类型</span>
        <input v-model="form.category" class="input" placeholder="例如：社区零售 / 农资店" />
      </label>
    </section>

    <section class="notice card">
      <div class="notice-row">
        <span class="icon">notifications_active</span>
        <div>
          <strong>低库存提醒默认开启</strong>
          <p>新商品默认阈值 5 件，后续可以在设置页再调整。</p>
        </div>
      </div>
      <div class="notice-row">
        <span class="icon">cloud_done</span>
        <div>
          <strong>原型使用本地缓存</strong>
          <p>关闭浏览器后仍会保留当前演示数据，随时可在备份页恢复 Demo。</p>
        </div>
      </div>
    </section>

    <button class="button-primary submit" type="button" @click="submit">进入首页开始记账</button>
  </ScreenLayout>
</template>

<style scoped>
.hero,
.notice {
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

.notice {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notice-row {
  display: flex;
  gap: 14px;
}

.notice-row .icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(26, 35, 126, 0.08);
  color: var(--primary);
}

.notice-row strong {
  display: block;
  margin-bottom: 4px;
}

.notice-row p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
}

.submit {
  width: 100%;
  margin-top: 18px;
}
</style>
