import {
  Controller,
  Post,
  Delete,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { User } from './user.model';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService,
    private readonly UserRepo: UserRepo,
  ) {}

  @Post('register')
  async register(
    @Body() { user, session_source }: { user: User; session_source: string },
  ): Promise<any> {
    try {
      const registeredUser = await this.UserService.register(
        user,
        session_source,
      );
      console.log(
        '[UserController.register]: successfully created account: ',
        registeredUser,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User successfully registered',
        data: registeredUser,
      };
    } catch (error) {
      console.error('[UserController.register]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(
    @Body()
    userData: {
      email: string;
      password: string;
      sessionSource: string;
    },
  ): Promise<any> {
    try {
      const { email, password, sessionSource } = userData;
      const loggedUser = await this.UserService.login(
        email,
        password,
        sessionSource,
      );
      console.log(
        '[UserController.login]: successfully logged in: ',
        loggedUser,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'User successfully logged in',
        data: loggedUser,
      };
    } catch (error) {
      console.error('[UserController.login]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('logout')
  async logout(@Body('session_id') session_id: string)  : Promise<any> {
    try {
      const result: any = await this.UserRepo.deleteSession(session_id);
      console.log(`[UserController.logout]: User with session ${session_id} successfully logged out`);
      return {
        statusCode: HttpStatus.OK,
        message: `User with session ${session_id} successfully logged out`,
        data: result,
      }
    } catch (error) {
      console.error('[UserController.logout]:', error);
      throw new HttpException(
        { status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
