import { useEffect, useState } from 'react';
import axios from 'axios';
import TokenChart from '../components/TokenChart';
import TokenSearch from '../components/TokenSearch';

export default function Home() {
  const [tokenData, setTokenData] = useState(null);
  const [selectedToken, setSelectedToken] = useState('BTC');
  const [timeInterval, setTimeInterval] = useState('5m');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching token history for: ${selectedToken}`);
  
        const res = await axios.get(`http://localhost:3000/token/history/${selectedToken}`);
  
        console.log('Full API response:', res.data);
  
        // Ensure the data structure matches what the chart expects
        if (res.data && res.data.history) {
          // Filter data based on time interval
          const now = new Date();
          const filteredHistory = res.data.history.filter(entry => {
            const entryDate = new Date(entry.timestamp);
            const timeDiff = (now - entryDate) / (1000 * 60); // difference in minutes
            
            switch(timeInterval) {
              case '1m': return timeDiff <= 1;
              case '5m': return timeDiff <= 5;
              case '15m': return timeDiff <= 15;
              case '30m': return timeDiff <= 30;
              case '1h': return timeDiff <= 60;
              default: return true;
            }
          });

          setTokenData({
            ...res.data,
            history: filteredHistory
          });
        } else {
          console.warn('Invalid API response structure:', res.data);
          setTokenData(null);
        }
      } catch (error) {
        console.error('Error fetching token history:', error);
        setTokenData(null);
      }
    };
  
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [selectedToken, timeInterval]);

  const tokens = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'SOL', name: 'Solana' },
  ];

  const timeIntervals = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '30m', label: '30m' },
    { value: '1h', label: '1h' },
  ];

  const handleTokenSelect = (symbol) => {
    setSelectedToken(symbol);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-5 bg-background">
      <h1 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent mb-5">
        Crypto Token Tracker
      </h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-5 w-full max-w-4xl items-center">
        <TokenSearch onTokenSelect={handleTokenSelect} />
        
        <div className="flex justify-center gap-2">
          {timeIntervals.map((interval) => (
            <button
              key={interval.value}
              className={`
                px-3 py-2 rounded-md font-bold transition-all
                ${timeInterval === interval.value 
                  ? 'bg-primary text-black' 
                  : 'bg-secondary text-white'
                }
                hover:transform hover:scale-105
              `}
              onClick={() => setTimeInterval(interval.value)}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-4xl bg-secondary/10 backdrop-blur-lg rounded-xl p-5 shadow-lg">
        <div className="text-white text-xl mb-4">
          Current Token: <span className="font-bold text-primary">{selectedToken}</span>
        </div>
        {tokenData ? (
          <TokenChart tokenData={tokenData} />
        ) : (
          <p className="text-center text-foreground/70">Loading data...</p>
        )}
      </div>
    </div>
  );
}