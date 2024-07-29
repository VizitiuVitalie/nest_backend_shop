import { Injectable } from '@nestjs/common';
import { UserRepo } from './user.repo';
import { User, SessionType } from './user.model';
import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly UserRepo: UserRepo) {}

  // Private methods
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private async generateAccessToken(id: string): Promise<string> {
    const payload = { id };
    return sign(payload, process.env.ACCESS_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '2m',
    });
  }

  private async generateRefreshToken(id: string): Promise<string> {
    const payload = { id };
    return sign(payload, process.env.REFRESH_SECRET_KEY, {
      algorithm: 'HS256',
      expiresIn: '10m',
    });
  }

  // Public methods
  async register(user: User, sessionSource: string): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);

    const createUser = new User({
      ...user,
      password: hashedPassword,
    });

    const registeredUser = await this.UserRepo.register(createUser);

    const accessToken = await this.generateAccessToken(registeredUser.id);
    const refreshToken = await this.generateRefreshToken(registeredUser.id);

    const session: SessionType = {
      session_id: uuidv4(),
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    registeredUser.sessions[sessionSource] = session;

    const updatedUser = await this.UserRepo.updateSessions(
      registeredUser.id,
      registeredUser.sessions,
    );
    console.log('debug', updatedUser);
    return updatedUser.toDTO();
  }

  async login(
    email: string,
    password: string,
    sessionSource: string,
  ): Promise<User> {
    const foundUser: User = await this.UserRepo.findByEmail(email);
    if (!foundUser) {
      throw new Error('Account not found');
    }
    const matched = await this.verifyPassword(password, foundUser.password);
    if (!matched) {
      throw new Error('Invalid email or password');
    }

    const accessToken = await this.generateAccessToken(foundUser.id);
    const refreshToken = await this.generateRefreshToken(foundUser.id);

    if (foundUser.sessions[sessionSource]) {
      foundUser.sessions[sessionSource].access_token = accessToken;
      foundUser.sessions[sessionSource].refresh_token = refreshToken;
    } else {
      foundUser.sessions[sessionSource] = {
        session_id: uuidv4(),
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }
    const updatedUser = await this.UserRepo.updateSessions(
      foundUser.id,
      foundUser.sessions,
    );

    return updatedUser.toDTO();
  }
}
