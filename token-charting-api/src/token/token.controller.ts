import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TokenService } from './token.service';
import { Prisma } from '@prisma/client';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  getAllTokens() {
    return this.tokenService.getAllTokens();
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
}
