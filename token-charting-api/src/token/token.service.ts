import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import axios from 'axios';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(private prisma: PrismaService) {}

  async getAllTokens() {
    try {
      const tokens = await this.prisma.token.findMany({
        select: {
          id: true,
          name: true,
          symbol: true,
          createdAt: true
        }
      });
      console.log('All tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  }

  async getTokenBySymbol(symbol: string) {
    const formattedSymbol = symbol.toUpperCase();
    return this.prisma.token.findUnique({
      where: { symbol: formattedSymbol },
      include: { prices: true },
    });
  }

  async createToken(data: Prisma.TokenCreateInput) {
    const formattedSymbol = data.symbol.toUpperCase();
    return this.prisma.token.create({
      data: {
        name: data.name,
        symbol: formattedSymbol,
      },
    });
  }

  async searchTokens(query: string) {
    console.log('Service: Searching with query:', query);
    
    try {
      const tokens = await this.prisma.token.findMany({
        where: {
          OR: [
            { 
              symbol: { 
                contains: query.toUpperCase(),
                mode: 'insensitive'
              } 
            },
            { 
              name: { 
                contains: query,
                mode: 'insensitive'
              } 
            }
          ]
        },
        select: {
          id: true,
          name: true,
          symbol: true,
          createdAt: true
        }
      });

      console.log('Service: Search results', tokens);
      return tokens;
    } catch (error) {
      console.error('Service: Search error', error);
      throw error;
    }
  }

  // Method to create a token if it doesn't exist
  async findOrCreateToken(symbol: string, name?: string) {
    const formattedSymbol = symbol.toUpperCase();
    
    // Try to find existing token
    let token = await this.prisma.token.findUnique({
      where: { symbol: formattedSymbol }
    });

    // If token doesn't exist, create it
    if (!token) {
      token = await this.prisma.token.create({
        data: {
          symbol: formattedSymbol,
          name: name || formattedSymbol
        }
      });
    }

    return token;
  }

  async listAllTokens() {
    try {
      const tokens = await this.prisma.token.findMany({
        select: {
          id: true,
          name: true,
          symbol: true,
          createdAt: true
        }
      });
      console.log('Attempting to list tokens:', tokens);
      return tokens;
    } catch (error) {
      console.error('Error listing tokens:', error);
      throw error;
    }
  }

  async fetchTokenPrice(symbol: string) {
    const formattedSymbol = symbol.toUpperCase();
    try {
      const tokenData = await this.prisma.token.findUnique({
        where: { symbol: formattedSymbol },
      });
  
      if (!tokenData) {
        throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
      }
  
      const coinGeckoName = tokenData.name.toLowerCase();
      // Fetch price using the name (not symbol)
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoName}&vs_currencies=usd`,
        { headers: { 'User-Agent': 'NestJS Token App' } }
      );
  
      const price = response.data[coinGeckoName]?.usd;
      if (!price) {
        throw new HttpException('Price not found', HttpStatus.NOT_FOUND);
      }
  
      await this.prisma.price.create({
        data: {
          tokenId: tokenData.id,
          price,
        },
      });
  
      return { symbol: formattedSymbol, name: tokenData.name, price };
    } catch (error) {
      console.error('Error fetching price:', error.response?.data || error.message);
      throw new HttpException('Failed to fetch price', HttpStatus.BAD_REQUEST);
    }
  }  

  async getTokenHistory(symbol: string) {
    const formattedSymbol = symbol.toUpperCase();
  
    const token = await this.prisma.token.findUnique({
      where: { symbol: formattedSymbol },
      include: { prices: { orderBy: { timestamp: 'desc' } } },
    });
  
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
  
    return {
      symbol: token.symbol,
      history: token.prices.map(entry => ({
        timestamp: entry.timestamp,
        price: entry.price,
      })),
    };
  }
  

  async updateAllTokenPrices() {
    this.logger.log('🔄 Running scheduled price updates...');
    const tokenList = await this.prisma.token.findMany();
    if (!tokenList.length) {
      this.logger.warn('⚠ No tokens found in the database.');
      return;
    }

    for (const tokenEntry of tokenList) {
      this.logger.log(`Fetching price for: ${tokenEntry.symbol}`);
      await this.fetchTokenPrice(tokenEntry.symbol);
    }
  }

  onModuleInit() {
    this.logger.log('🚀 Starting token price update scheduler...');
    setInterval(() => {
      this.updateAllTokenPrices();
    }, 60000); // Runs every 1 minute (60000 ms)
  }
}
