
import { CryptoData } from '../types/crypto';

const calculateStats = (data: CryptoData[]) => {
  const averagePrice = data.reduce((acc, curr) => acc + curr.current_price, 0) / data.length;
  
  const priceChanges = data.map(crypto => ({
    name: crypto.name,
    change: crypto.price_change_percentage_24h
  }));
  
  const highestPriceChange = priceChanges.reduce((max, curr) => 
    curr.change > max.change ? curr : max
  , priceChanges[0]);
  
  const lowestPriceChange = priceChanges.reduce((min, curr) => 
    curr.change < min.change ? curr : min
  , priceChanges[0]);

  const top5ByMarketCap = [...data]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 5)
    .map(crypto => ({
      name: crypto.name,
      marketCap: crypto.market_cap,
      price: crypto.current_price
    }));

  return {
    averagePrice,
    highestPriceChange,
    lowestPriceChange,
    top5ByMarketCap
  };
};

export const exportToCSV = (data: CryptoData[]) => {
  const stats = calculateStats(data);
  
  // Define sections for CSV
  const statsSection = [
    ['Statistical Analysis', ''],
    ['Average Price (USD)', stats.averagePrice.toFixed(2)],
    ['Highest 24h Change', `${stats.highestPriceChange.name} (${stats.highestPriceChange.change.toFixed(2)}%)`],
    ['Lowest 24h Change', `${stats.lowestPriceChange.name} (${stats.lowestPriceChange.change.toFixed(2)}%)`],
    [''],
    ['Top 5 by Market Cap', ''],
    ['Name', 'Market Cap (USD)', 'Price (USD)'],
    ...stats.top5ByMarketCap.map(crypto => [
      crypto.name,
      crypto.marketCap.toLocaleString(),
      crypto.price.toLocaleString()
    ]),
    [''],
    ['Complete Dataset', ''],
  ];

  // Define headers for main data
  const headers = [
    'Name',
    'Symbol',
    'Price (USD)',
    'Market Cap',
    '24h Volume',
    '24h Change %',
    'Last Updated'
  ];

  // Format data rows
  const rows = data.map(crypto => [
    crypto.name,
    crypto.symbol.toUpperCase(),
    crypto.current_price,
    crypto.market_cap,
    crypto.total_volume,
    crypto.price_change_percentage_24h,
    new Date().toISOString()
  ]);

  // Combine all sections
  const csvContent = [
    ...statsSection,
    headers,
    ...rows
  ].map(row => row.join(',')).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `crypto_analysis_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
