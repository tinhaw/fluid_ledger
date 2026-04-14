<script setup lang="ts">
import { computed, ref } from 'vue';
import ScreenLayout from '../components/ScreenLayout.vue';
import { usePrototypeStore } from '../stores/prototype';
import { formatCurrency } from '../utils/format';

const store = usePrototypeStore();
const prompt = ref('');

const quickPrompts = [
  '买了3箱苹果，每箱88块钱',
  '卖了5袋大米，一袋60',
  '老张赊了200块钱的化肥',
  '收到李姐还的500块',
];

const actionMap = computed(() => new Map(store.state.chatActions.map((item) => [item.id, item])));

const submit = () => {
  store.submitPrompt(prompt.value);
  prompt.value = '';
};
</script>

<template>
  <ScreenLayout :title="store.state.profile.shopName" eyebrow="P1 AI 对话记账" icon="chat_bubble">
    <section class="hero card">
      <div>
        <p class="section-title">今天的生意</p>
        <h2>{{ store.state.profile.ownerName }}，继续说一句就能记一笔</h2>
      </div>
      <div class="hero-metrics">
        <div>
          <span>待收</span>
          <strong>{{ formatCurrency(store.totalReceivable) }}</strong>
        </div>
        <div>
          <span>库存预警</span>
          <strong>{{ store.lowStockCount }} 个</strong>
        </div>
      </div>
    </section>

    <section class="quick-list">
      <button
        v-for="item in quickPrompts"
        :key="item"
        class="quick-chip"
        type="button"
        @click="prompt = item"
      >
        {{ item }}
      </button>
    </section>

    <section class="chat-list">
      <article
        v-for="message in store.state.chatMessages"
        :key="message.id"
        class="message-row"
        :class="message.role"
      >
        <div class="bubble" :class="message.role">
          <p>{{ message.text }}</p>
          <small>{{ message.createdAt }}</small>
        </div>

        <div
          v-if="message.actionId && actionMap.get(message.actionId)"
          class="action-card card"
        >
          <div class="action-head">
            <div>
              <p class="section-title">{{ actionMap.get(message.actionId)?.title }}</p>
              <h3>{{ actionMap.get(message.actionId)?.productName || actionMap.get(message.actionId)?.contactName || '待确认账目' }}</h3>
            </div>
            <span
              class="status-pill"
              :class="
                actionMap.get(message.actionId)?.status === 'confirmed'
                  ? 'success'
                  : actionMap.get(message.actionId)?.status === 'rejected'
                    ? 'warning'
                    : 'primary'
              "
            >
              {{
                actionMap.get(message.actionId)?.status === 'confirmed'
                  ? '已确认'
                  : actionMap.get(message.actionId)?.status === 'rejected'
                    ? '已撤回'
                    : '待确认'
              }}
            </span>
          </div>

          <div class="detail-grid">
            <div class="metric-card">
              <p class="metric-label">数量</p>
              <p class="metric-value">
                {{
                  actionMap.get(message.actionId)?.quantity
                    ? `${actionMap.get(message.actionId)?.quantity}${actionMap.get(message.actionId)?.unit || ''}`
                    : '—'
                }}
              </p>
            </div>
            <div class="metric-card">
              <p class="metric-label">金额</p>
              <p class="metric-value">{{ formatCurrency(actionMap.get(message.actionId)?.total || 0) }}</p>
            </div>
          </div>

          <p class="hint">{{ actionMap.get(message.actionId)?.hint }}</p>

          <div
            v-if="actionMap.get(message.actionId)?.status === 'pending'"
            class="actions"
          >
            <button
              class="button-secondary"
              type="button"
              @click="store.rejectAction(message.actionId)"
            >
              撤回
            </button>
            <button
              class="button-primary"
              type="button"
              @click="store.confirmAction(message.actionId)"
            >
              确认入账
            </button>
          </div>
        </div>
      </article>
    </section>

    <section class="composer card">
      <textarea
        v-model="prompt"
        class="composer-input"
        rows="3"
        placeholder="例如：买了3箱苹果，每箱88块钱"
      />
      <div class="composer-actions">
        <button class="circle-button" type="button" @click="prompt = '收到李姐还的500块'">
          <span class="icon">mic</span>
        </button>
        <button class="circle-button" type="button" @click="prompt = '卖了5袋大米，一袋60'">
          <span class="icon">add_a_photo</span>
        </button>
        <button class="button-primary send" type="button" @click="submit">发送给 AI</button>
      </div>
    </section>
  </ScreenLayout>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
}

.hero h2 {
  margin: 10px 0 0;
  font-family: 'Noto Serif SC', serif;
  font-size: 30px;
  line-height: 1.35;
  color: var(--primary-strong);
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.hero-metrics div {
  padding: 16px;
  border-radius: 20px;
  background: rgba(26, 35, 126, 0.06);
}

.hero-metrics span {
  display: block;
  margin-bottom: 8px;
  color: var(--text-soft);
  font-size: 13px;
  font-weight: 700;
}

.hero-metrics strong {
  font-size: 22px;
  color: var(--primary-strong);
}

.quick-list {
  display: flex;
  gap: 10px;
  padding: 14px 2px 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.quick-list::-webkit-scrollbar {
  display: none;
}

.quick-chip {
  flex: 0 0 auto;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(26, 35, 126, 0.08);
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 14px;
}

.message-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-row.user {
  align-items: flex-end;
}

.bubble {
  max-width: 88%;
  padding: 16px 18px;
  border-radius: 24px;
  box-shadow: 0 10px 24px rgba(11, 21, 71, 0.05);
}

.bubble.assistant {
  background: rgba(255, 255, 255, 0.94);
  border-top-left-radius: 12px;
}

.bubble.user {
  color: #fff;
  background: linear-gradient(135deg, #2733a3 0%, #111b5f 100%);
  border-top-right-radius: 12px;
}

.bubble p,
.bubble small {
  margin: 0;
}

.bubble p {
  line-height: 1.7;
}

.bubble small {
  display: block;
  margin-top: 8px;
  opacity: 0.72;
}

.action-card {
  padding: 20px;
}

.action-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.action-head h3 {
  margin: 8px 0 0;
  font-size: 28px;
  font-family: 'Noto Serif SC', serif;
  color: var(--primary-strong);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.hint {
  margin: 14px 0 0;
  color: var(--text-soft);
  line-height: 1.7;
}

.actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.composer {
  margin-top: 18px;
  padding: 18px;
}

.composer-input {
  width: 100%;
  resize: none;
  padding: 0;
  background: transparent;
  color: var(--text);
  font-size: 15px;
  line-height: 1.8;
  outline: none;
}

.composer-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 12px;
}

.circle-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: rgba(26, 35, 126, 0.08);
  color: var(--primary);
}

.send {
  flex: 1;
}
</style>
