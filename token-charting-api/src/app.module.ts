import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [TokenModule], // ✅ Updated import
  providers: [PrismaService],
})
export class AppModule {}
