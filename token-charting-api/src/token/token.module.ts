import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from '../prisma.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()], // Enable scheduling
  controllers: [TokenController],
  providers: [TokenService, PrismaService],
})
export class TokenModule {} // ✅ Renamed
