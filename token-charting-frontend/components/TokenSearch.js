import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TokenSearch({ onTokenSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchTokens = async () => {
      // Reset error state
      setError(null);

      // Only search if query is 2 or more characters
      if (query.length < 2) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log('Searching tokens with query:', query);

        const response = await axios.get('http://localhost:3000/token/search', {
          params: { query },
          validateStatus: function (status) {
            return status >= 200 && status < 300; // Default
          }
        });

        console.log('Search response:', response);
        console.log('Response data:', response.data);

        setResults(response.data);
        
        if (response.data.length === 0) {
          console.warn('No tokens found for query:', query);
        }
      } catch (error) {
        console.error('Error searching tokens:', error);
        
        // More detailed error handling
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          setError('Failed to fetch tokens');
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('No response from server');
        } else {
          console.error('Error setting up request:', error.message);
          setError('Error searching tokens');
        }
        
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchTokens, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleTokenSelect = (token) => {
    onTokenSelect(token.symbol);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a token (e.g., BTC, ETH)"
          className="w-full px-4 py-2 rounded-md bg-secondary text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {query.length > 0 && isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg 
              className="animate-spin h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-500 mt-2 text-sm">
          {error}
        </div>
      )}
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-secondary rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((token) => (
            <div
              key={token.symbol}
              onClick={() => handleTokenSelect(token)}
              className="px-4 py-2 hover:bg-primary/20 cursor-pointer text-white"
            >
              <div className="flex justify-between">
                <span>{token.symbol}</span>
                <span className="text-gray-400">{token.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}