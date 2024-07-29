import { Injectable } from '@nestjs/common';
import { User, UserSessionType } from './user.model';
import { DatabaseProvider } from '../database/database.provider';

@Injectable()
export class UserRepo {
  constructor(private readonly db_provider: DatabaseProvider) {}

  async register(user: User): Promise<User> {
    try {
      await this.db_provider.query('BEGIN');

      const queryText = `
        INSERT INTO users (email, password, name, sessions, contact, address)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, password, name, sessions, contact, address;
      `;

      const result = await this.db_provider.query(queryText, [
        user.email,
        user.password,
        user.name,
        JSON.stringify(user.sessions),
        JSON.stringify(user.contact),
        JSON.stringify(user.address),
      ]);

      await this.db_provider.query('COMMIT');

      const registeredUser = result.rows[0];
      return new User(registeredUser);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.db_provider.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    if (result.rows.length === 0) {
      return undefined;
    }
    return new User(result.rows[0]);
  }

  async updateSessions(
    user_id: string,
    sessions: UserSessionType,
  ): Promise<User> {
    await this.db_provider.query('BEGIN');
    try {
      const queryText = `UPDATE users SET sessions = $1 WHERE id = $2 RETURNING *`;

      const result = await this.db_provider.query(queryText, [
        JSON.stringify(sessions),
        user_id,
      ]);

      await this.db_provider.query('COMMIT');

      const updatedUser = result.rows[0];
      return new User(updatedUser);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }

  async deleteSession(session_id: string): Promise<void> {
    await this.db_provider.query('BEGIN');
    try {
      const selectQuery = `
        SELECT * FROM users
        WHERE EXISTS (
          SELECT 1
          FROM jsonb_each_text(users.sessions) as sess(session_source, session_data)
          WHERE session_data::jsonb @> $1::jsonb
        )
      `;
      const result = await this.db_provider.query(selectQuery, [
        JSON.stringify({ session_id }),
      ]);

      if (result.rows.length === 0) {
        throw new Error('Session not found');
      }

      const user = result.rows[0];
      const sessions = user.sessions;

      let sessionFound = false;
      for (const sessionSource in sessions) {
        if (sessions[sessionSource].session_id === session_id) {
          delete sessions[sessionSource];
          sessionFound = true;
          break;
        }
      }

      if (!sessionFound) {
        throw new Error('Session ID not found in user sessions');
      }

      const updateQuery = `
        UPDATE users SET sessions = $1 WHERE id = $2
      `;
      await this.db_provider.query(updateQuery, [
        JSON.stringify(sessions),
        user.id,
      ]);

      await this.db_provider.query('COMMIT');
      console.log(`[UserRepo.deleteSession]: Session successfully deleted`);
    } catch (error) {
      await this.db_provider.query('ROLLBACK');
      throw error;
    }
  }
}
