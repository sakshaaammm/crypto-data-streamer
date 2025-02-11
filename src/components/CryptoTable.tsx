
import { motion } from 'framer-motion';
import { CryptoData } from '../types/crypto';

interface CryptoTableProps {
  data: CryptoData[];
}

export const CryptoTable = ({ data }: CryptoTableProps) => {
  return (
    <div className="overflow-x-auto relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-w-full divide-y divide-gray-200 rounded-lg bg-white/80 backdrop-blur-lg"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                24h Change
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Market Cap
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volume (24h)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-gray-200">
            {data.map((crypto) => (
              <motion.tr
                key={crypto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                      <div className="text-sm text-gray-500">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${crypto.current_price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex text-sm ${
                    crypto.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${crypto.market_cap.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${crypto.total_volume.toLocaleString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};
