import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { mockState } from '../mocks/data';
import type { AppState, ChatAction, InventoryItem, TransactionRecord } from '../types';

const STORAGE_KEY = 'fluid-ledger-prototype-state';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(amount);

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

const deriveInventoryStatus = (item: InventoryItem) => {
  if (item.quantity <= 0) return 'out';
  if (item.quantity <= item.threshold) return 'low';
  return 'healthy';
};

const loadState = (): AppState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return mockState();

  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return mockState();
  }
};

const buildActionFromPrompt = (prompt: string): ChatAction => {
  const normalized = prompt.replace(/\s+/g, '');
  const hasApple = normalized.includes('苹果');
  const hasRice = normalized.includes('大米');
  const hasFertilizer = normalized.includes('化肥');
  const hasCollect = normalized.includes('收到');
  const hasPay = normalized.includes('付');
  const hasCredit = normalized.includes('赊') || normalized.includes('先记着');
  const amountMatch = normalized.match(/(\d+)(?:块|元)/);
  const quantityMatch = normalized.match(/(\d+)(?:箱|袋|板|个)/);
  const amount = amountMatch ? Number(amountMatch[1]) : 120;
  const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;

  if (hasCollect) {
    return {
      id: createId('action'),
      type: 'collection',
      title: '收款确认',
      contactName: normalized.includes('李姐') ? '李姐' : '客户',
      total: amount,
      detail: `识别为一笔待收回款，金额 ${formatCurrency(amount)}。`,
      hint: '确认后会冲减待收账款，并在账本中新增一笔收款记录。',
      status: 'pending',
    };
  }

  if (hasApple && hasPay) {
    return {
      id: createId('action'),
      type: 'purchase_paid',
      title: '进货确认',
      productName: '苹果',
      productId: 'apple-box',
      quantity,
      unit: '箱',
      unitPrice: Math.round(amount / quantity),
      total: amount,
      detail: `买了 ${quantity} 箱苹果，现付 ${formatCurrency(amount)}。`,
      hint: '确认后会自动增加苹果库存，并记录一笔支出。',
      status: 'pending',
    };
  }

  if (hasRice && normalized.includes('卖')) {
    return {
      id: createId('action'),
      type: hasCredit ? 'sale_credit' : 'sale_paid',
      title: hasCredit ? '赊销确认' : '销售确认',
      productName: '大米',
      productId: 'rice-bag',
      quantity,
      unit: '袋',
      unitPrice: Math.round(amount / quantity),
      total: amount,
      contactName: hasCredit ? '老客户' : undefined,
      detail: `卖了 ${quantity} 袋大米，总计 ${formatCurrency(amount)}。`,
      hint: hasCredit
        ? '确认后会减少库存，并新增一笔待收账款。'
        : '确认后会减少库存，并记录一笔今日收入。',
      status: 'pending',
    };
  }

  if (hasFertilizer) {
    return {
      id: createId('action'),
      type: hasCredit ? 'sale_credit' : 'purchase_credit',
      title: hasCredit ? '赊销确认' : '进货待付确认',
      productName: '化肥',
      productId: 'fertilizer-pack',
      quantity,
      unit: '袋',
      total: amount,
      contactName: normalized.includes('老张') ? '老张' : normalized.includes('老李') ? '老李' : undefined,
      detail: hasCredit
        ? `${normalized.includes('老张') ? '老张' : '客户'}赊了 ${formatCurrency(amount)} 的化肥。`
        : `从供应商处进了 ${quantity} 袋化肥，暂未付款。`,
      hint: hasCredit
        ? '确认后会减少库存，并新增待收账款。'
        : '确认后会增加库存，并新增待付账款。',
      status: 'pending',
    };
  }

  return {
    id: createId('action'),
    type: 'adjustment',
    title: '待确认事项',
    total: amount,
    detail: '这句话里可能包含库存调整或杂项收支，建议您确认后再入账。',
    hint: '当前原型只做基础演示，复杂表达会先落到人工确认卡片。',
    status: 'pending',
  };
};

export const usePrototypeStore = defineStore('prototype', () => {
  const state = ref<AppState>(loadState());

  watch(
    state,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    },
    { deep: true },
  );

  const inventoryItems = computed(() =>
    state.value.inventory.map((item) => ({
      ...item,
      status: deriveInventoryStatus(item),
    })),
  );

  const totalInventoryUnits = computed(() =>
    state.value.inventory.reduce((sum, item) => sum + item.quantity, 0),
  );

  const lowStockCount = computed(
    () => inventoryItems.value.filter((item) => item.status !== 'healthy').length,
  );

  const totalReceivable = computed(() =>
    state.value.receivables.reduce((sum, item) => sum + item.amount, 0),
  );

  const totalPayable = computed(() =>
    state.value.payables.reduce((sum, item) => sum + item.amount, 0),
  );

  const monthlyProfit = computed(() => {
    let income = 0;
    let expense = 0;

    state.value.transactions.forEach((txn) => {
      if (txn.type === 'sale_paid' || txn.type === 'collection') income += txn.amount;
      if (txn.type === 'purchase_paid' || txn.type === 'payment') expense += txn.amount;
    });

    return income - expense;
  });

  const overdueReceivables = computed(() =>
    state.value.receivables.filter((item) => item.overdue).reduce((sum, item) => sum + item.amount, 0),
  );

  const suggestions = computed(() => {
    const entries: string[] = [];

    if (lowStockCount.value > 0) {
      entries.push(`今天有 ${lowStockCount.value} 个商品处于低库存或缺货状态，建议优先补货。`);
    }

    if (overdueReceivables.value > 0) {
      entries.push(`当前逾期待收 ${formatCurrency(overdueReceivables.value)}，建议先催收老客户。`);
    }

    if (entries.length === 0) {
      entries.push('库存和回款状态都比较平稳，可以继续使用语音记账提升效率。');
    }

    return entries;
  });

  const latestPendingAction = computed(() =>
    [...state.value.chatActions].reverse().find((action) => action.status === 'pending'),
  );

  const markVisited = () => {
    state.value.hasVisited = true;
  };

  const login = () => {
    state.value.isLoggedIn = true;
    state.value.hasVisited = true;
  };

  const logout = () => {
    state.value.isLoggedIn = false;
  };

  const setupShop = (payload: Partial<AppState['profile']>) => {
    state.value.profile = { ...state.value.profile, ...payload };
    state.value.shopInitialized = true;
  };

  const togglePreference = (key: keyof AppState['preferences']) => {
    const current = state.value.preferences[key];
    if (typeof current === 'boolean') {
      state.value.preferences[key] = !current as never;
    }
  };

  const setUnlockMethod = (method: AppState['preferences']['unlockMethod']) => {
    state.value.preferences.unlockMethod = method;
  };

  const adjustInventory = (itemId: string, delta: number) => {
    const item = state.value.inventory.find((entry) => entry.id === itemId);
    if (!item) return;
    item.quantity = Math.max(0, item.quantity + delta);
  };

  const addBackup = () => {
    state.value.backups.unshift({
      id: createId('backup'),
      label: '手动备份',
      createdAt: '刚刚',
      type: 'manual',
      summary: `账目 ${state.value.transactions.length} 条，库存 ${state.value.inventory.length} 个商品`,
    });
  };

  const restoreDemo = () => {
    state.value = mockState();
  };

  const pushTransaction = (record: TransactionRecord) => {
    state.value.transactions.unshift(record);
  };

  const applyAction = (action: ChatAction) => {
    const item = action.productId
      ? state.value.inventory.find((entry) => entry.id === action.productId)
      : undefined;

    if (action.type === 'purchase_paid' && item && action.quantity) {
      item.quantity += action.quantity;
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: `进货${action.productName ?? ''}`,
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        productId: action.productId,
        quantity: action.quantity,
        settled: true,
      });
    }

    if (action.type === 'sale_paid' && item && action.quantity) {
      item.quantity = Math.max(0, item.quantity - action.quantity);
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: `卖出${action.productName ?? ''}`,
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        productId: action.productId,
        quantity: action.quantity,
        settled: true,
      });
    }

    if (action.type === 'sale_credit' && item) {
      if (action.quantity) item.quantity = Math.max(0, item.quantity - action.quantity);
      state.value.receivables.unshift({
        id: createId('ar'),
        customer: action.contactName ?? '老客户',
        amount: action.total,
        createdAt: '刚刚',
        dueLabel: '7 天后到期',
        note: action.detail,
        overdue: false,
      });
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: `赊销${action.productName ?? ''}`,
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        productId: action.productId,
        quantity: action.quantity,
        counterparty: action.contactName,
        settled: false,
      });
    }

    if (action.type === 'purchase_credit' && item) {
      if (action.quantity) item.quantity += action.quantity;
      state.value.payables.unshift({
        id: createId('ap'),
        supplier: action.contactName ?? '供货商',
        amount: action.total,
        createdAt: '刚刚',
        dueLabel: '3 天后到期',
        note: action.detail,
        overdue: false,
      });
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: `进货${action.productName ?? ''}`,
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        productId: action.productId,
        quantity: action.quantity,
        counterparty: action.contactName,
        settled: false,
      });
    }

    if (action.type === 'collection') {
      const receivable = state.value.receivables[0];
      if (receivable) {
        receivable.amount = Math.max(0, receivable.amount - action.total);
        if (receivable.amount === 0) {
          state.value.receivables = state.value.receivables.filter((item) => item.id !== receivable.id);
        }
      }
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: '回款入账',
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        counterparty: action.contactName,
        settled: true,
      });
    }

    if (action.type === 'payment') {
      const payable = state.value.payables[0];
      if (payable) {
        payable.amount = Math.max(0, payable.amount - action.total);
        if (payable.amount === 0) {
          state.value.payables = state.value.payables.filter((item) => item.id !== payable.id);
        }
      }
      pushTransaction({
        id: createId('txn'),
        type: action.type,
        title: '付款入账',
        amount: action.total,
        summary: action.detail,
        happenedAt: '刚刚',
        counterparty: action.contactName,
        settled: true,
      });
    }
  };

  const confirmAction = (actionId: string) => {
    const action = state.value.chatActions.find((entry) => entry.id === actionId);
    if (!action || action.status !== 'pending') return;

    action.status = 'confirmed';
    applyAction(action);

    state.value.chatMessages.push({
      id: createId('msg'),
      role: 'assistant',
      text:
        action.type === 'collection'
          ? `这笔回款已经记好了，待收余额也同步更新为 ${formatCurrency(totalReceivable.value)}。`
          : `${action.title}已确认，我已经帮您同步到库存和账本里。`,
      createdAt: '刚刚',
    });
  };

  const rejectAction = (actionId: string) => {
    const action = state.value.chatActions.find((entry) => entry.id === actionId);
    if (!action || action.status !== 'pending') return;
    action.status = 'rejected';
    state.value.chatMessages.push({
      id: createId('msg'),
      role: 'assistant',
      text: '这张确认卡片我先撤回了，您可以重新说一遍，或者改成手动输入。',
      createdAt: '刚刚',
    });
  };

  const submitPrompt = (prompt: string) => {
    const text = prompt.trim();
    if (!text) return;

    state.value.chatMessages.push({
      id: createId('msg'),
      role: 'user',
      text,
      createdAt: '刚刚',
    });

    const action = buildActionFromPrompt(text);
    state.value.chatActions.push(action);

    state.value.chatMessages.push({
      id: createId('msg'),
      role: 'assistant',
      text: action.detail,
      createdAt: '刚刚',
      actionId: action.id,
    });
  };

  const collectReceivable = (itemId: string) => {
    const item = state.value.receivables.find((entry) => entry.id === itemId);
    if (!item) return;
    pushTransaction({
      id: createId('txn'),
      type: 'collection',
      title: `收到${item.customer}回款`,
      amount: item.amount,
      summary: `已标记 ${item.customer} 的待收款为已收`,
      happenedAt: '刚刚',
      counterparty: item.customer,
      settled: true,
    });
    state.value.receivables = state.value.receivables.filter((entry) => entry.id !== itemId);
  };

  const settlePayable = (itemId: string) => {
    const item = state.value.payables.find((entry) => entry.id === itemId);
    if (!item) return;
    pushTransaction({
      id: createId('txn'),
      type: 'payment',
      title: `支付${item.supplier}货款`,
      amount: item.amount,
      summary: `已标记 ${item.supplier} 的待付款为已付`,
      happenedAt: '刚刚',
      counterparty: item.supplier,
      settled: true,
    });
    state.value.payables = state.value.payables.filter((entry) => entry.id !== itemId);
  };

  return {
    state,
    inventoryItems,
    totalInventoryUnits,
    lowStockCount,
    totalReceivable,
    totalPayable,
    monthlyProfit,
    overdueReceivables,
    suggestions,
    latestPendingAction,
    markVisited,
    login,
    logout,
    setupShop,
    togglePreference,
    setUnlockMethod,
    adjustInventory,
    addBackup,
    restoreDemo,
    confirmAction,
    rejectAction,
    submitPrompt,
    collectReceivable,
    settlePayable,
  };
});
