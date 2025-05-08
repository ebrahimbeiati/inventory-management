import { 
  Typography, 
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ArrowUpDown
} from 'lucide-react';
import DashboardLayout from '@/app/dashboardWrapper';

// Mock data for products
const products = [
  { 
    id: '1', 
    name: 'Wireless Headphones', 
    sku: 'WH-001', 
    category: 'Electronics', 
    price: 99.99, 
    stock: 45,
    status: 'In Stock',
  },
  { 
    id: '2', 
    name: 'USB-C Cable', 
    sku: 'USB-C-001', 
    category: 'Accessories', 
    price: 19.99, 
    stock: 78,
    status: 'In Stock',
  },
  { 
    id: '3', 
    name: 'Laptop Stand', 
    sku: 'LS-001', 
    category: 'Accessories', 
    price: 49.99, 
    stock: 12,
    status: 'Low Stock',
  },
  { 
    id: '4', 
    name: 'External SSD 1TB', 
    sku: 'SSD-001', 
    category: 'Storage', 
    price: 149.99, 
    stock: 8,
    status: 'Low Stock',
  },
  { 
    id: '5', 
    name: 'Webcam HD', 
    sku: 'WC-001', 
    category: 'Electronics', 
    price: 79.99, 
    stock: 34,
    status: 'In Stock',
  },
  { 
    id: '6', 
    name: 'Mechanical Keyboard', 
    sku: 'KB-001', 
    category: 'Accessories', 
    price: 129.99, 
    stock: 0,
    status: 'Out of Stock',
  },
  { 
    id: '7', 
    name: 'Wireless Mouse', 
    sku: 'WM-001', 
    category: 'Accessories', 
    price: 39.99, 
    stock: 56,
    status: 'In Stock',
  }
];

const categories = [
  'All Categories',
  'Electronics',
  'Accessories',
  'Storage'
];

export default function ProductsPage() {
  return (
    <DashboardLayout title="Products">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Typography variant="h4" component="h1" gutterBottom>
              Products
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your product inventory
            </Typography>
          </div>
          
          <Button 
            variant="contained" 
            color="primary" 
            className="mt-4 md:mt-0"
            startIcon={<Plus size={18} />}
          >
            Add Product
          </Button>
        </div>
        
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <TextField 
            placeholder="Search products..." 
            variant="outlined"
            fullWidth 
            className="md:flex-1"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outlined" 
              startIcon={<Filter size={18} />}
            >
              Filter
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<ArrowUpDown size={18} />}
            >
              Sort
            </Button>
          </div>
        </div>
        
        {/* Categories filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {categories.map(category => (
            <Chip 
              key={category} 
              label={category} 
              clickable
              color={category === 'All Categories' ? 'primary' : 'default'}
              variant={category === 'All Categories' ? 'filled' : 'outlined'}
            />
          ))}
        </div>
        
        {/* Products List */}
        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{product.sku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">${product.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{product.stock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${product.status === 'In Stock' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : product.status === 'Low Stock' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <IconButton size="small" className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800">
                          <Eye size={18} />
                        </IconButton>
                        <IconButton size="small" className="text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-800">
                          <Edit size={18} />
                        </IconButton>
                        <IconButton size="small" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-800">
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between items-center">
              <Button variant="outlined" size="small">
                Previous
              </Button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of{' '}
                <span className="font-medium">7</span> results
              </span>
              <Button variant="outlined" size="small">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 