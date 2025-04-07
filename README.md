# Crypto Token Tracker

![Crypto Token Tracker Screenshot](https://i.ibb.co/7Jy7fM16/Screenshot-2025-03-31-at-4-41-01-PM.png)

## Overview

Crypto Token Tracker is a real-time cryptocurrency monitoring platform that provides detailed price action data across multiple time intervals. Users can track price movements for various cryptocurrencies with interactive charts displaying 1-minute, 5-minute, 15-minute, 30-minute, and 1-hour intervals.

## Features

- **Real-time Price Tracking**: Monitor cryptocurrency prices with up-to-the-minute accuracy
- **Multiple Time Intervals**: View price action across 1m, 5m, 15m, 30m, and 1h time frames
- **Token Search**: Easily find specific cryptocurrencies using the search functionality
- **Interactive Charts**: Hover over chart points to see precise price and timestamp information
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js, React
- **Styling**: Tailwind CSS
- **Data Management**: GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: CoinGecko API for real-time cryptocurrency data
- **Charting**: Recharts library for responsive data visualization

## Installation

```bash
# Clone the repository
git clone https://github.com/carlostbanks/nest-tokenList.git

# Navigate to the project directory
cd nest-tokenList

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys and database configuration to .env.local

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Use the search bar to find a specific cryptocurrency (e.g., BTC, ETH)
3. Select your preferred time interval (1m, 5m, 15m, 30m, 1h)
4. Hover over the chart to see detailed price information at specific timestamps
5. Track price movements and trends in real-time

## API Configuration

This project uses the CoinGecko API to fetch cryptocurrency data. To use your own API key:

1. Register for an API key at [CoinGecko](https://www.coingecko.com/en/api)
2. Add your API key to the `.env.local` file:
   ```
   COINGECKO_API_KEY=your_api_key_here
   ```

## Database Setup

The application uses PostgreSQL with Prisma ORM:

1. Make sure you have PostgreSQL installed and running
2. Update the database connection string in `.env.local`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/nest_token_list?schema=public"
   ```
3. Run migrations with `npx prisma migrate dev`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Carlos Banks - carlostbanks@gmail.com

Project Link: [https://github.com/carlostbanks/nest-tokenList](https://github.com/carlostbanks/nest-tokenList)
