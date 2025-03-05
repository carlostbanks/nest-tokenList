import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' }
      ],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Prisma connected successfully');
      
      // Log all tokens during initialization
      const tokens = await this.token.findMany();
      console.log('Tokens in database:', JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Failed to connect to database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}