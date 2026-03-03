// Order and Cart schema

export interface CartItem {
    productId: string;
    title: string;
    price: number;
    salePrice?: number;
    quantity: number;
    image: string;
    selectedLanguage?: string;
}

export interface Cart {
    items: CartItem[];
    couponCode?: string;
    couponDiscount: number;
    subtotal: number;
    total: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    items: OrderItem[];
    customer: CustomerInfo;
    payment: PaymentInfo;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    total: number;
    couponCode?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    selectedLanguage?: string;
}

export interface CustomerInfo {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    company?: string;
    nip?: string;
    address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
}

export interface PaymentInfo {
    method: 'card' | 'transfer' | 'blik' | 'paypal';
    status: 'pending' | 'paid' | 'failed' | 'refunded';
    transactionId?: string;
    paidAt?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Oczekujące',
    processing: 'W realizacji',
    completed: 'Zrealizowane',
    cancelled: 'Anulowane',
    refunded: 'Zwrócone',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentInfo['method'], string> = {
    card: 'Karta płatnicza',
    transfer: 'Przelew bankowy',
    blik: 'BLIK',
    paypal: 'PayPal',
};

// Coupon schema
export interface Coupon {
    code: string;
    discountType: 'percent' | 'fixed';
    discountValue: number;
    minOrderValue?: number;
    usageLimit: number;
    usageCount: number;
    expiresAt?: string;
    productIds?: string[]; // null = all products
    isActive: boolean;
    createdAt: string;
}

// Helper functions
export function generateOrderId(): string {
    return `order_${Date.now()}`;
}

export function generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${year}${month}-${random}`;
}

export function generateCouponCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

export function calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
        return 0;
    }

    if (coupon.discountType === 'percent') {
        return Math.round(subtotal * (coupon.discountValue / 100));
    }

    return Math.min(coupon.discountValue, subtotal);
}

// Sample orders for demo
export const SAMPLE_ORDERS: Order[] = [
    {
        id: "order_1",
        orderNumber: "202602-ABC123",
        items: [
            { productId: "prod_1", title: "Lesson Plans: A1-A2 Bundle", price: 149, quantity: 1 },
        ],
        customer: {
            email: "jan.kowalski@kamila.shor.dev",
            firstName: "Jan",
            lastName: "Kowalski",
        },
        payment: {
            method: "card",
            status: "paid",
            transactionId: "pi_123456",
            paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        status: "completed",
        subtotal: 149,
        discount: 0,
        total: 149,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "order_2",
        orderNumber: "202602-DEF456",
        items: [
            { productId: "prod_2", title: "Grammar Masterclass for Teachers", price: 129, quantity: 1 },
            { productId: "prod_3", title: "Business English Resources Pack", price: 199, quantity: 1 },
        ],
        customer: {
            email: "anna.nowak@kamila.shor.dev",
            firstName: "Anna",
            lastName: "Nowak",
            company: "Szkoła Językowa ABC",
            nip: "1234567890",
        },
        payment: {
            method: "transfer",
            status: "pending",
        },
        status: "pending",
        subtotal: 328,
        discount: 32,
        total: 296,
        couponCode: "WELCOME10",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "order_3",
        orderNumber: "202602-GHI789",
        items: [
            { productId: "prod_1", title: "Lesson Plans: A1-A2 Bundle", price: 149, quantity: 2 },
        ],
        customer: {
            email: "maria.wisniewski@kamila.shor.dev",
            firstName: "Maria",
            lastName: "Wiśniewski",
        },
        payment: {
            method: "blik",
            status: "paid",
            transactionId: "blik_789",
            paidAt: new Date().toISOString(),
        },
        status: "processing",
        subtotal: 298,
        discount: 0,
        total: 298,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export const SAMPLE_COUPONS: Coupon[] = [
    {
        code: "WELCOME10",
        discountType: "percent",
        discountValue: 10,
        usageLimit: 100,
        usageCount: 23,
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        code: "SUMMER50",
        discountType: "fixed",
        discountValue: 50,
        minOrderValue: 200,
        usageLimit: 50,
        usageCount: 12,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
];
