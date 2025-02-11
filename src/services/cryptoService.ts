
import axios from 'axios';
import { CryptoData } from '../types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const fetchTop50Cryptos = async (): Promise<CryptoData[]> => {
  try {
    const response = await axios.get(
      `${COINGECKO_API}/coins/markets`,
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: true,
          locale: 'en'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    throw error;
  }
};
