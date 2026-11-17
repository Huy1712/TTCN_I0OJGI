import { apiClient } from "../../lib/apiClient";

export interface CheckoutLineInput {
  productSlug: string;
  shape: string;
  length: string;
  quantity: number;
}

export interface CheckoutQuote {
  items: {
    productSlug: string;
    productName: string;
    shape: string;
    length: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  discountAmount: number;
  couponCode: string | null;
  shippingFee: number;
  totalAmount: number;
}

export interface CreateOrderInput {
  idempotencyKey: string;
  items: CheckoutLineInput[];
  paymentMethod: "BANK_TRANSFER" | "COD";
  couponCode?: string;
  addressId?: number;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
  transferReference?: string;
}

export interface CreatedOrder {
  orderCode: string;
  totalAmount: string | number;
}

export const orderApi = {
  async quote(
    items: CheckoutLineInput[],
    couponCode?: string
  ): Promise<CheckoutQuote> {
    const response = await apiClient.post<CheckoutQuote>("/orders/quote", {
      items,
      couponCode,
    });
    return response.data;
  },

  async createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
    const response = await apiClient.post<CreatedOrder>("/orders", input);
    return response.data;
  },
};
