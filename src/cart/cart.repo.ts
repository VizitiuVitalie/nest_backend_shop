import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from 'src/database/database.provider';
import { Cart } from './cart.model';
import { CartItem } from './cart-item.model';

@Injectable()
export class CartRepo {
  constructor(private readonly db_provider: DatabaseProvider) {}

  async createCart(cart: Cart): Promise<Cart> {
    try {
      await this.db_provider.query('BEGIN');

      const result = await this.db_provider.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
        [cart.user_id],
      );
      await this.db_provider.query('COMMIT');
      return new Cart(result.rows[0].id, result.rows[0].user_id);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async addItem(cartItem: CartItem): Promise<CartItem> {
    try {
      await this.db_provider.query('BEGIN');

      const result = await this.db_provider.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`,
        [cartItem.cart_id, cartItem.product_id, cartItem.quantity],
      );
      await this.db_provider.query('COMMIT');
      return new CartItem(
        result.rows[0].id,
        result.rows[0].cart_id,
        result.rows[0].product_id,
        result.rows[0].quantity,
      );
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async getCartItems(user_id: string): Promise<CartItem[]> {
    try {
      await this.db_provider.query('BEGIN');

      const result = await this.db_provider.query(
        `SELECT cart_items.id, cart_items.cart_id, cart_items.product_id, cart_items.quantity, products.price FROM cart_items JOIN products ON cart_items.product_id = products.id WHERE cart_items.cart_id = (SELECT carts.id FROM carts WHERE carts.user_id = $1)`,
        [user_id],
      );
      await this.db_provider.query('COMMIT');
      return result.rows.map(
        (row) =>
          new CartItem(row.id, row.cart_id, row.product_id, row.quantity),
      );
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }
}
