import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService, private readonly prisma: PrismaService
  ) {}

  @Get()
  async getAllTokens() {
    console.log('GET /token - Fetching all tokens');
    const tokens = await this.tokenService.getAllTokens();
    console.log('Tokens found:', tokens);
    return tokens;
  }

  @Get(':symbol')
  getTokenBySymbol(@Param('symbol') symbol: string) {
    return this.tokenService.getTokenBySymbol(symbol);
  }

  @Post()
  createToken(@Body() data: Prisma.TokenCreateInput) {
    return this.tokenService.createToken(data);
  }

  @Get('price/:symbol')
  fetchTokenPrice(@Param('symbol') symbol: string) {
    return this.tokenService.fetchTokenPrice(symbol);
  }

  @Get('history/:symbol')
  async getTokenHistory(@Param('symbol') symbol: string) {
    return this.tokenService.getTokenHistory(symbol);
  }

  @Get('search')
  async searchTokens(@Query('query') query: string) {
    console.log('GET /token/search - Search query:', query);
    
    if (!query) {
      console.log('No query provided');
      return [];
    }

    try {
      const tokens = await this.tokenService.searchTokens(query);
      console.log('Search results:', tokens);
      return tokens;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  @Get('list')
  async listAllTokens() {
    console.log('GET /token/list - Attempting to fetch tokens');
    try {
      const tokens = await this.prisma.token.findMany({
        select: {
          id: true,
          name: true,
          symbol: true,
          createdAt: true
        }
      });
      console.log('Tokens found in list endpoint:', tokens);
      return tokens;
    } catch (error) {
      console.error('Error in list endpoint:', error);
      throw error;
    }
  }
}
