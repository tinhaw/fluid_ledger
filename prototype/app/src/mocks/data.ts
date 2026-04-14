import type {
  AppState,
  BackupRecord,
  ChatAction,
  ChatMessage,
  InventoryItem,
  PayableItem,
  ReceivableItem,
  TransactionRecord,
} from '../types';

const now = '今天 09:36';

const inventory: InventoryItem[] = [
  {
    id: 'apple-box',
    name: '苹果',
    unit: '箱',
    quantity: 12,
    threshold: 5,
    expiryLabel: '常温 7 天',
    category: '水果',
    supplier: '城西果蔬行',
  },
  {
    id: 'rice-bag',
    name: '大米',
    unit: '袋',
    quantity: 3,
    threshold: 6,
    expiryLabel: '保质期至 2026-08',
    category: '粮油',
    supplier: '丰年粮贸',
  },
  {
    id: 'fertilizer-pack',
    name: '化肥',
    unit: '袋',
    quantity: 26,
    threshold: 8,
    expiryLabel: '本批次可售 90 天',
    category: '农资',
    supplier: '青禾农资',
  },
  {
    id: 'egg-tray',
    name: '鸡蛋',
    unit: '板',
    quantity: 0,
    threshold: 4,
    expiryLabel: '近 2 日需尽快售卖',
    category: '生鲜',
    supplier: '晨光禽蛋',
  },
];

const receivables: ReceivableItem[] = [
  {
    id: 'ar-1',
    customer: '老张',
    amount: 200,
    createdAt: '今天 09:12',
    dueLabel: '3 天后到期',
    note: '赊销化肥 4 袋',
    overdue: false,
  },
  {
    id: 'ar-2',
    customer: '李姐',
    amount: 880,
    createdAt: '昨天 16:40',
    dueLabel: '已逾期 2 天',
    note: '赊销杂货补单',
    overdue: true,
  },
];

const payables: PayableItem[] = [
  {
    id: 'ap-1',
    supplier: '丰年粮贸',
    amount: 960,
    createdAt: '今天 08:25',
    dueLabel: '明天到期',
    note: '进货大米 16 袋',
    overdue: false,
  },
  {
    id: 'ap-2',
    supplier: '城西果蔬行',
    amount: 420,
    createdAt: '前天 13:20',
    dueLabel: '已逾期 1 天',
    note: '苹果补货尾款',
    overdue: true,
  },
];

const transactions: TransactionRecord[] = [
  {
    id: 'txn-1',
    type: 'sale_paid',
    title: '卖出大米',
    amount: 300,
    summary: '卖了 5 袋大米，现金收款',
    happenedAt: '今天 09:20',
    productId: 'rice-bag',
    quantity: 5,
    settled: true,
  },
  {
    id: 'txn-2',
    type: 'sale_credit',
    title: '赊销化肥',
    amount: 200,
    summary: '老张赊了 200 元化肥',
    happenedAt: '今天 09:12',
    productId: 'fertilizer-pack',
    quantity: 4,
    counterparty: '老张',
    settled: false,
  },
  {
    id: 'txn-3',
    type: 'purchase_credit',
    title: '进货大米',
    amount: 960,
    summary: '从丰年粮贸进货，暂未付款',
    happenedAt: '今天 08:25',
    productId: 'rice-bag',
    quantity: 16,
    counterparty: '丰年粮贸',
    settled: false,
  },
];

const backups: BackupRecord[] = [
  {
    id: 'backup-1',
    label: '自动备份',
    createdAt: '今天 06:00',
    type: 'auto',
    summary: '账目 128 条，库存 24 个商品',
  },
  {
    id: 'backup-2',
    label: '手动备份',
    createdAt: '昨天 21:18',
    type: 'manual',
    summary: '用于结账前存档',
  },
];

const action: ChatAction = {
  id: 'action-1',
  type: 'purchase_paid',
  title: '进货确认',
  productName: '苹果',
  productId: 'apple-box',
  quantity: 3,
  unit: '箱',
  unitPrice: 88,
  total: 264,
  detail: '买了 3 箱苹果，每箱 88 元，现付 264 元。',
  hint: '确认后会自动增加库存，并记入一笔今日支出。',
  status: 'pending',
};

const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    text: '早上好，今天也可以继续用语音或拍照记账。您说一句话，我来帮您整理成结构化账目。',
    createdAt: now,
  },
  {
    id: 'msg-2',
    role: 'user',
    text: '买了 3 箱苹果，每箱 88 块钱。',
    createdAt: now,
  },
  {
    id: 'msg-3',
    role: 'assistant',
    text: '已识别到一笔进货现付，我先帮您整理成确认卡片。',
    createdAt: now,
    actionId: action.id,
  },
];

export const mockState = (): AppState => ({
  hasVisited: false,
  isLoggedIn: false,
  shopInitialized: false,
  profile: {
    shopName: '老王便民店',
    ownerName: '王叔',
    city: '山东临沂',
    category: '社区零售',
    enableLowStockAlert: true,
    defaultThreshold: 5,
  },
  preferences: {
    voiceBroadcast: true,
    popupAlert: false,
    smsNotification: true,
    reportPush: true,
    unlockMethod: 'face',
  },
  inventory,
  transactions,
  receivables,
  payables,
  backups,
  chatMessages,
  chatActions: [action],
});
