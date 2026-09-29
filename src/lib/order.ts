import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export type OrderCustomer = {
  full_name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  notes: string;
};

export type LocalOrder = {
  number: string;
  createdAt: string;
  customer: OrderCustomer;
  lines: CartLine[];
  total: number;
};

const STORAGE_KEY = "districap.orders.v1";
const MAX_STORED = 10;

/** Local order number, e.g. DC-2026-048213. */
export function generateOrderNumber(date = new Date()) {
  const random = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `DC-${date.getFullYear()}-${random}`;
}

function readOrders(): LocalOrder[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalOrder[]) : [];
  } catch {
    return [];
  }
}

/** Keeps the last orders in this browser so the confirmation page can show them. */
export function saveOrder(order: LocalOrder) {
  try {
    const orders = [order, ...readOrders().filter((o) => o.number !== order.number)];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders.slice(0, MAX_STORED)));
  } catch {
    /* storage unavailable: the confirmation page falls back to the number only */
  }
}

export function findOrder(number: string) {
  return readOrders().find((o) => o.number === number);
}

function lineLabel(line: CartLine) {
  const price = line.price === null ? "Sur devis" : formatPrice(line.price * line.quantity);
  return `• ${line.quantity} × ${line.name} (réf. ${line.sku}) – ${price}`;
}

export function orderWhatsappMessage(order: LocalOrder) {
  const { customer } = order;
  return [
    `Bonjour DISTRICAP, je souhaite confirmer ma commande ${order.number}.`,
    "",
    "Articles :",
    ...order.lines.map(lineLabel),
    "",
    `Total : ${formatPrice(order.total)} TTC`,
    "Paiement à la livraison",
    "",
    `Nom : ${customer.full_name}`,
    ...(customer.company ? [`Société : ${customer.company}`] : []),
    `Téléphone : ${customer.phone}`,
    `Ville : ${customer.city}`,
    `Adresse : ${customer.address}`,
    ...(customer.notes ? [`Remarques : ${customer.notes}`] : []),
  ].join("\n");
}

/** Builds a "label : value" WhatsApp summary, skipping empty values. */
export function summaryMessage(intro: string, entries: [string, string | undefined][]) {
  return [
    intro,
    "",
    ...entries.filter(([, value]) => value && value.trim()).map(([k, v]) => `${k} : ${v}`),
  ].join("\n");
}
