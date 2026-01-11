import { apiClient } from './axios';

export interface InitiatePaymentDto {
  returnUrl?: string;
}

export interface PaymentTransactionResponse {
  id: string;
  transactionCode: string;
  status: string;
  amount: number;
  paymentUrl: string;
}

export interface InitiatePaymentResponse {
  orderId: string;
  paymentStatus: string;
  transaction: PaymentTransactionResponse;
}

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
};

const unwrap = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiResponse<T>).data;
  }
  return payload as T;
};

export const paymentApi = {
  initiatePayment: async (
    orderId: string,
    dto: InitiatePaymentDto = {}
  ): Promise<InitiatePaymentResponse> => {
    const response = await apiClient.post<ApiResponse<InitiatePaymentResponse>>(
      `/payments/orders/${orderId}/initiate`,
      dto
    );
    return unwrap(response.data);
  },
};
