import { useEffect, useState } from 'react';
import axios from 'axios';
import TokenChart from '../components/TokenChart';

export default function Home() {
  const [tokenData, setTokenData] = useState(null);
  const [selectedToken, setSelectedToken] = useState('BTC'); // Default to Bitcoin

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/token/history/${selectedToken}`);
        setTokenData(res.data);
      } catch (error) {
        console.error('Error fetching token history:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedToken]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Crypto Token Charting</h1>

      <select onChange={(e) => setSelectedToken(e.target.value)} value={selectedToken}>
        <option value="BTC">Bitcoin (BTC)</option>
        <option value="ETH">Ethereum (ETH)</option>
        <option value="SOL">Solana (SOL)</option>
      </select>

      {tokenData ? <TokenChart tokenData={tokenData} /> : <p>Loading data...</p>}
    </div>
  );
}
