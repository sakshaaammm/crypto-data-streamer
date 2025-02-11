
import { CryptoData } from '../types/crypto';

export const exportToCSV = (data: CryptoData[]) => {
  // Define headers for CSV
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

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `crypto_data_${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
