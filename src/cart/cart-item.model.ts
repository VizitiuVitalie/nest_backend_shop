export class CartItem {
  constructor(
    public id: string,
    public cart_id: string,
    public product_id: string,
    public quantity: number,
  ) {}
}
