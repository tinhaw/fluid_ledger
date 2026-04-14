<script setup lang="ts">
import { useRouter } from 'vue-router';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';

const router = useRouter();
const store = usePrototypeStore();

const toggleRows = [
  { key: 'voiceBroadcast', title: '语音播报', desc: '收款和识别确认时语音提醒' },
  { key: 'popupAlert', title: '弹窗提醒', desc: '重要库存预警和账款提醒' },
  { key: 'smsNotification', title: '系统短信通知', desc: '验证码、异常登录与催款结果' },
  { key: 'reportPush', title: '历史账单推送', desc: '每天收盘后同步经营摘要' },
] as const;

const logout = () => {
  store.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <ScreenLayout title="我的设置" eyebrow="P4 个人中心" icon="person">
    <section class="profile card">
      <div class="avatar">
        {{ store.state.profile.ownerName.slice(0, 1) }}
      </div>
      <div class="profile-copy">
        <p class="section-title">{{ store.state.profile.city }}</p>
        <h2>{{ store.state.profile.shopName }}</h2>
        <p>{{ store.state.profile.ownerName }} · {{ store.state.profile.category }}</p>
      </div>
    </section>

    <section class="list-stack">
      <article class="setting-card card">
        <button class="link-row" type="button" @click="router.push({ name: 'security' })">
          <div>
            <strong>安全设置</strong>
            <p>管理面容 / 指纹 / 图案 / 密码兜底</p>
          </div>
          <span class="icon">chevron_right</span>
        </button>
        <button class="link-row" type="button" @click="router.push({ name: 'backups' })">
          <div>
            <strong>数据备份与恢复</strong>
            <p>查看备份记录，恢复到 Demo 初始状态</p>
          </div>
          <span class="icon">chevron_right</span>
        </button>
      </article>

      <article class="setting-card card">
        <div v-for="row in toggleRows" :key="row.key" class="toggle-row">
          <div>
            <strong>{{ row.title }}</strong>
            <p>{{ row.desc }}</p>
          </div>
          <button
            class="switch"
            :class="{ on: store.state.preferences[row.key] }"
            type="button"
            @click="store.togglePreference(row.key)"
          >
            <span></span>
          </button>
        </div>
      </article>
    </section>

    <button class="button-secondary logout" type="button" @click="logout">退出当前演示账号</button>
  </ScreenLayout>
</template>

<style scoped>
.profile {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 22px;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  border-radius: 24px;
  color: #fff;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #2733a3 0%, #111b5f 100%);
}

.profile-copy h2 {
  margin: 8px 0 4px;
  font-size: 28px;
  color: var(--primary-strong);
}

.profile-copy p:last-child {
  margin: 0;
  color: var(--text-soft);
}

.setting-card {
  padding: 10px 16px;
}

.link-row,
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-height: 84px;
}

.link-row + .link-row,
.toggle-row + .toggle-row {
  border-top: 1px solid rgba(26, 35, 126, 0.08);
}

.link-row {
  width: 100%;
  padding: 0;
  text-align: left;
  background: transparent;
}

.link-row strong,
.toggle-row strong {
  display: block;
  margin-bottom: 4px;
  font-size: 16px;
}

.link-row p,
.toggle-row p {
  margin: 0;
  color: var(--text-soft);
  font-size: 14px;
}

.switch {
  position: relative;
  width: 54px;
  height: 32px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(26, 35, 126, 0.14);
}

.switch span {
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(10, 20, 71, 0.14);
  transition: transform 0.2s ease;
}

.switch.on {
  background: rgba(31, 139, 77, 0.28);
}

.switch.on span {
  transform: translateX(22px);
}

.logout {
  width: 100%;
  margin-top: 18px;
}
</style>
