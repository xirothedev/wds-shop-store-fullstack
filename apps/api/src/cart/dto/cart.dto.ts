export interface ItemRequestDto {
  id?: string;
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
} // For adding, editing cart items

export interface ItemDeleteRequestDto {
  id: string;
} // For deleting cart items

export interface ItemDto {
  id: string;
  cartId: string;
  productId: string;
  size: string;
  quantity: number;
}
