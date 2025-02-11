
import { useQuery } from '@tanstack/react-query';
import { fetchTop50Cryptos } from '../services/cryptoService';
import { CryptoTable } from '../components/CryptoTable';
import { StatCard } from '../components/StatCard';
import { CryptoData, CryptoStats } from '../types/crypto';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { exportToCSV } from '../utils/exportUtils';
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const calculateStats = (data: CryptoData[]): CryptoStats => {
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

  return {
    averagePrice,
    highestPriceChange,
    lowestPriceChange
  };
};

const Index = () => {
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchTop50Cryptos,
    refetchInterval: refreshInterval,
    refetchIntervalInBackground: true,
  });

  const handleExport = () => {
    if (data) {
      exportToCSV(data);
      toast({
        title: "Export Successful",
        description: "The CSV file has been downloaded. You can open it in Excel.",
      });
    }
  };

  const stats = data ? calculateStats(data) : null;
  const top5 = data?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-white to-soft-gray p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Cryptocurrency Market Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-gray-600 mb-6"
          >
            Real-time analysis of the top 50 cryptocurrencies
          </motion.p>
          <Button
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            Error loading cryptocurrency data. Please try again later.
          </div>
        ) : data && stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard
                title="Average Price"
                value={`$${stats.averagePrice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`}
              />
              <StatCard
                title="Highest 24h Change"
                value={`${stats.highestPriceChange.name}`}
                subtitle={`${stats.highestPriceChange.change.toFixed(2)}%`}
                isPositive={true}
              />
              <StatCard
                title="Lowest 24h Change"
                value={`${stats.lowestPriceChange.name}`}
                subtitle={`${stats.lowestPriceChange.change.toFixed(2)}%`}
                isPositive={false}
              />
              <StatCard
                title="Total Cryptocurrencies"
                value={data.length}
              />
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top 5 by Market Cap</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {top5.map((crypto) => (
                  <motion.div
                    key={crypto.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
                      <span className="text-sm font-medium text-gray-500">#{crypto.market_cap_rank}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{crypto.name}</h3>
                    <p className="text-2xl font-bold text-gray-900 mb-2">
                      ${crypto.current_price.toLocaleString()}
                    </p>
                    <p className={`text-sm ${
                      crypto.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Cryptocurrencies</h2>
              <CryptoTable data={data} />
            </div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
};

export default Index;
