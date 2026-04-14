export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatCompactCurrency = (amount: number) => {
  if (amount >= 10000) return `¥${(amount / 10000).toFixed(1)}w`;
  return formatCurrency(amount);
};
