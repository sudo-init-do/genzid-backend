import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [WalletController],
})
export class WalletModule {}
