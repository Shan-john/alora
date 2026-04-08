const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generate order message text for DM/WhatsApp.
 */
export function generateOrderMessage(items, total, orderId) {
  const itemLines = items.map(item => {
    const variant = item.variant ? ` (${item.variant})` : '';
    return `• ${item.name}${variant} × ${item.quantity} — ₹${(item.price * item.quantity).toLocaleString('en-IN')}`;
  }).join('\n');

  return `Hi Alora by Trio! 👋 I'd like to place an order:\n\n${itemLines}\n\nTotal: ₹${total.toLocaleString('en-IN')}\nOrder Ref: ${orderId}\n\nPlease confirm! 🛍`;
}

/**
 * Create a pending order on the server.
 */
export async function createPendingOrder(items, customer, total, orderMethod, messageText) {
  const response = await fetch(`${API_URL}/api/orders/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
      })),
      customer,
      total,
      orderMethod,
      igMessageText: messageText,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create order');
  }

  return response.json();
}

/**
 * Open Instagram DM with clipboard copy.
 */
export async function openInstagramDM(messageText, igHandle = 'alora.trio') {
  try {
    await navigator.clipboard.writeText(messageText);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = messageText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  window.open(`https://ig.me/m/${igHandle}`, '_blank');
}

/**
 * Open WhatsApp with pre-filled message.
 */
export function openWhatsApp(messageText, phoneNumber = '919876543210') {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
  window.open(url, '_blank');
}
