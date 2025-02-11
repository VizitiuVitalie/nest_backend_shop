import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const PORT = process.env.PORT
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`app is listening on port ${PORT}`);
    
  });
}
bootstrap();
