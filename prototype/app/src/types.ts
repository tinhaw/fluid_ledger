export type InventoryStatus = 'healthy' | 'low' | 'out';

export type ChatRole = 'assistant' | 'user';

export type ChatActionType =
  | 'purchase_paid'
  | 'purchase_credit'
  | 'sale_paid'
  | 'sale_credit'
  | 'collection'
  | 'payment'
  | 'adjustment';

export type ChatActionStatus = 'pending' | 'confirmed' | 'rejected';

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  expiryLabel: string;
  category: string;
  supplier?: string;
}

export interface TransactionRecord {
  id: string;
  type: ChatActionType;
  title: string;
  amount: number;
  summary: string;
  happenedAt: string;
  productId?: string;
  quantity?: number;
  counterparty?: string;
  settled?: boolean;
}

export interface ReceivableItem {
  id: string;
  customer: string;
  amount: number;
  createdAt: string;
  dueLabel: string;
  note: string;
  overdue: boolean;
}

export interface PayableItem {
  id: string;
  supplier: string;
  amount: number;
  createdAt: string;
  dueLabel: string;
  note: string;
  overdue: boolean;
}

export interface BackupRecord {
  id: string;
  label: string;
  createdAt: string;
  type: 'auto' | 'manual';
  summary: string;
}

export interface StoreProfile {
  shopName: string;
  ownerName: string;
  city: string;
  category: string;
  enableLowStockAlert: boolean;
  defaultThreshold: number;
}

export interface AppPreferences {
  voiceBroadcast: boolean;
  popupAlert: boolean;
  smsNotification: boolean;
  reportPush: boolean;
  unlockMethod: 'face' | 'fingerprint' | 'pattern' | 'password';
}

export interface ChatAction {
  id: string;
  type: ChatActionType;
  title: string;
  productName?: string;
  productId?: string;
  contactName?: string;
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  total: number;
  detail: string;
  hint: string;
  status: ChatActionStatus;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  actionId?: string;
}

export interface AppState {
  hasVisited: boolean;
  isLoggedIn: boolean;
  shopInitialized: boolean;
  profile: StoreProfile;
  preferences: AppPreferences;
  inventory: InventoryItem[];
  transactions: TransactionRecord[];
  receivables: ReceivableItem[];
  payables: PayableItem[];
  backups: BackupRecord[];
  chatMessages: ChatMessage[];
  chatActions: ChatAction[];
}
