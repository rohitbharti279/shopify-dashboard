// Currency and date formatters
export function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(date) {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
}
