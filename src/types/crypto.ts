
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

export interface CryptoStats {
  averagePrice: number;
  highestPriceChange: {
    name: string;
    change: number;
  };
  lowestPriceChange: {
    name: string;
    change: number;
  };
}
