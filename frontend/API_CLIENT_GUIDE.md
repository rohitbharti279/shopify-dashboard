# Centralized API Client - Usage Guide

## Overview

Your app now has a **production-ready centralized API client** that:

✅ **Automatically attaches auth tokens** from localStorage  
✅ **Uses standard Authorization: Bearer <token>** header  
✅ **Works for public APIs** (no token required)  
✅ **Works for protected APIs** (token required)  
✅ **Handles errors** properly  
✅ **Is reusable** across the entire app  
✅ **Production-ready** structure  

---

## Architecture

### Token Flow

```
Component calls: apiClient.get('/endpoint')
            ↓
Request Interceptor:
├─ Read token from localStorage
├─ Attach Authorization: Bearer <token>
└─ Send request
            ↓
Backend receives request with token
            ↓
Backend validates token
            ↓
Response Interceptor:
├─ Handle 401 (token invalid)
├─ Handle 403 (no permission)
├─ Handle 404 (not found)
├─ Handle 5xx (server error)
└─ Return data
            ↓
Component receives response
```

---

## File Location

```
frontend/src/services/api.js
```

---

## Key Components

### 1. **API Instance**
```javascript
const api = axios.create({...})
```
- Configured with your base URL
- Default JSON headers
- Request and response interceptors

### 2. **Request Interceptor**
Automatically:
- Reads token from `localStorage.authToken`
- Adds `Authorization: Bearer <token>` header
- Works for public (no token) and protected (token required) endpoints

### 3. **Response Interceptor**
Automatically:
- Handles 401 Unauthorized
- Handles 403 Forbidden
- Handles 404 Not Found
- Handles 5xx Server errors
- Extracts error messages

### 4. **apiClient Object**
Exports methods:
- `get(endpoint, options)`
- `post(endpoint, data, options)`
- `put(endpoint, data, options)`
- `patch(endpoint, data, options)`
- `delete(endpoint, options)`

### 5. **shopifyApi Object**
Pre-built endpoint methods:
- Products (get, create, update, delete)
- Orders (get, create, update, cancel)
- Analytics (sales, revenue, customers)
- Customers (get, list)
- Auth (login, register, refresh, logout)
- User (profile, change password)

---

## Usage Examples

### Basic GET Request (Public API)

```javascript
import { apiClient } from '../services/api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Token automatically attached if present
        const data = await apiClient.get('/shopify/products');
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

### Using Pre-built shopifyApi

```javascript
import { shopifyApi } from '../services/api';

function ProductList() {
  useEffect(() => {
    shopifyApi.getProducts({ limit: 10 })
      .then(data => setProducts(data.products))
      .catch(err => setError(err.message));
  }, []);
}
```

### POST Request (Protected API)

```javascript
import { apiClient } from '../services/api';

async function createNewProduct(productData) {
  try {
    // Token automatically attached
    const response = await apiClient.post(
      '/shopify/products',
      {
        title: productData.title,
        description: productData.description,
        price: productData.price
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to create product:', error.message);
  }
}
```

### Using Pre-built shopifyApi for POST

```javascript
import { shopifyApi } from '../services/api';

async function createProduct() {
  try {
    const newProduct = await shopifyApi.createProduct({
      title: 'New Product',
      description: 'Great product',
      price: 29.99
    });
    console.log('Created:', newProduct);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Async/Await Pattern

```javascript
import { apiClient } from '../services/api';

async function fetchOrderDetails(orderId) {
  try {
    // GET
    const order = await apiClient.get(`/shopify/orders/${orderId}`);
    console.log('Order:', order);

    // UPDATE (PUT)
    const updated = await apiClient.put(
      `/shopify/orders/${orderId}`,
      { status: 'shipped' }
    );
    console.log('Updated:', updated);

    // DELETE
    await apiClient.delete(`/shopify/orders/${orderId}`);
    console.log('Deleted');
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

### Promise Pattern

```javascript
import { shopifyApi } from '../services/api';

shopifyApi.getOrders({ limit: 20 })
  .then(data => {
    console.log('Orders:', data);
  })
  .catch(err => {
    console.error('Failed to fetch orders:', err.message);
  });
```

---

## How Token Attachment Works

### Automatic Token Attachment

```javascript
// In request interceptor:
const token = localStorage.getItem('authToken');

if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

### What Happens

**Case 1: User is Logged In**
```
localStorage.authToken = "fake-jwt-token-1234567890-abc..."
            ↓
Request made to /shopify/products
            ↓
Interceptor reads token
            ↓
Header added: Authorization: Bearer fake-jwt-token-...
            ↓
Backend validates token
            ↓
User is authenticated ✅
```

**Case 2: User is NOT Logged In**
```
localStorage.authToken = (doesn't exist)
            ↓
Request made to /shopify/products
            ↓
Interceptor checks: token exists?
            ↓
NO → Headers sent WITHOUT Authorization
            ↓
Backend treats as public request ✅
            ↓
Works for public APIs
Fails for protected APIs (401)
```

**Case 3: User Logs Out**
```
User clicks Logout
            ↓
logout() removes authToken from localStorage
            ↓
Next API request made
            ↓
Interceptor: No token found
            ↓
Headers sent WITHOUT Authorization
            ↓
User is effectively logged out ✅
```

---

## Using with React Query

### Setup Hook

```javascript
import { useQuery, useMutation } from '@tanstack/react-query';
import { shopifyApi } from '../services/api';

function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => shopifyApi.getProducts({ limit: 50 })
  });
}

export default useProducts;
```

### Usage in Component

```javascript
import useProducts from '../hooks/useProducts';

function ProductList() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.products.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
```

### Mutation (Create/Update/Delete)

```javascript
import { useMutation } from '@tanstack/react-query';
import { shopifyApi } from '../services/api';

function CreateProductForm() {
  const mutation = useMutation({
    mutationFn: (productData) => shopifyApi.createProduct(productData),
    onSuccess: (data) => {
      console.log('Created:', data);
      // Invalidate and refetch products
    },
    onError: (error) => {
      console.error('Error:', error.message);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      mutation.mutate({ title: 'New' });
    }}>
      {mutation.isLoading && <p>Creating...</p>}
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Available Pre-built Endpoints

### Products
```javascript
shopifyApi.getProducts(params)           // GET all
shopifyApi.getProduct(handle)            // GET one
shopifyApi.createProduct(data)           // POST new
shopifyApi.updateProduct(handle, data)   // PUT update
shopifyApi.deleteProduct(handle)         // DELETE
```

### Orders
```javascript
shopifyApi.getOrders(params)             // GET all
shopifyApi.getOrder(id)                  // GET one
shopifyApi.createOrder(data)             // POST new
shopifyApi.updateOrder(id, data)         // PUT update
shopifyApi.cancelOrder(id)               // POST cancel
```

### Analytics
```javascript
shopifyApi.getSalesAnalytics(params)     // Sales data
shopifyApi.getRevenueData(params)        // Revenue data
shopifyApi.getCustomerAnalytics(params)  // Customer data
```

### Customers
```javascript
shopifyApi.getCustomers(params)          // GET all
shopifyApi.getCustomer(id)               // GET one
```

### Authentication
```javascript
shopifyApi.login(credentials)            // POST login
shopifyApi.register(userData)            // POST register
shopifyApi.refreshToken()                // POST refresh
shopifyApi.logout()                      // POST logout
```

### User Profile
```javascript
shopifyApi.getCurrentUser()              // GET current user
shopifyApi.updateProfile(data)           // PUT update
shopifyApi.changePassword(data)          // POST change
```

---

## Custom Endpoints

### Generic GET

```javascript
import { apiClient } from '../services/api';

const data = await apiClient.get('/custom/endpoint', {
  params: { page: 1, limit: 20 }
});
```

### Generic POST

```javascript
const response = await apiClient.post('/custom/endpoint', {
  name: 'value',
  email: 'user@example.com'
});
```

### Generic PUT

```javascript
const updated = await apiClient.put('/custom/endpoint/123', {
  name: 'updated value'
});
```

### Generic PATCH

```javascript
const patched = await apiClient.patch('/custom/endpoint/123', {
  status: 'active'
});
```

### Generic DELETE

```javascript
await apiClient.delete('/custom/endpoint/123');
```

---

## Error Handling

### Try/Catch Pattern

```javascript
async function safeFetch() {
  try {
    const data = await apiClient.get('/endpoint');
    return data;
  } catch (error) {
    // error.message contains formatted error
    console.error('Error:', error.message);
    return null;
  }
}
```

### Error Types Handled

| Status | Meaning | Action |
|--------|---------|--------|
| 401 | Unauthorized | Token invalid/expired |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 5xx | Server Error | Backend issue |

### Handling Specific Errors

```javascript
async function fetchData() {
  try {
    const data = await apiClient.get('/protected/endpoint');
  } catch (error) {
    if (error.message.includes('Unauthorized')) {
      // Handle 401: Redirect to login
      window.location.href = '/login';
    } else if (error.message.includes('Forbidden')) {
      // Handle 403: Show permission denied
      showPermissionError();
    } else {
      // Handle other errors
      showGenericError(error.message);
    }
  }
}
```

---

## Integration with AuthContext

### How They Work Together

```
AuthContext stores token in localStorage
            ↓
apiClient reads from localStorage
            ↓
Automatically attaches to requests
            ↓
Backend validates token
            ↓
Response returned to component
```

### Example Flow

```javascript
// 1. User logs in (AuthContext sets token)
const { login } = useAuth();
await login(email, password);  // Token saved to localStorage

// 2. Component makes API request
const data = await apiClient.get('/protected/endpoint');
// Token automatically attached!

// 3. User logs out (AuthContext clears token)
const { logout } = useAuth();
logout();  // Token removed from localStorage

// 4. Next API request made
const data = await apiClient.get('/protected/endpoint');
// No token attached - returns 401 or empty
```

---

## Configuration

### Environment Variables

```bash
# .env file
REACT_APP_API_URL=http://localhost:5050/api
```

Or defaults to:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';
```

### Changing Base URL

```javascript
// In api.js
const API_BASE_URL = 'https://api.yourdomain.com';
```

### Adding Custom Headers

```javascript
// In request interceptor
config.headers['X-Custom-Header'] = 'value';
```

---

## Advanced Usage

### Direct Axios Access

```javascript
import api from '../services/api';

// For special cases, use axios directly
api.post('/special', data, {
  headers: { 'X-Special': 'true' },
  timeout: 5000
});
```

### Query Parameters

```javascript
// With params object
const data = await apiClient.get('/products', {
  params: {
    page: 1,
    limit: 20,
    sort: 'price'
  }
});
```

### Request Timeout

```javascript
const data = await apiClient.get('/endpoint', {
  timeout: 10000  // 10 seconds
});
```

### Custom Headers

```javascript
const data = await apiClient.get('/endpoint', {
  headers: {
    'X-Custom-Header': 'value'
  }
});
```

---

## Best Practices

### 1. Always Handle Errors

```javascript
// ✅ Good
try {
  const data = await apiClient.get('/endpoint');
} catch (error) {
  console.error('Error:', error.message);
}

// ❌ Bad
const data = await apiClient.get('/endpoint');
```

### 2. Use Pre-built shopifyApi When Available

```javascript
// ✅ Better
const products = await shopifyApi.getProducts();

// ✅ Also fine
const products = await apiClient.get('/shopify/products');
```

### 3. Handle Loading States

```javascript
// ✅ Good
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  apiClient.get('/endpoint')
    .finally(() => setLoading(false));
}, []);

// Display loading indicator while fetching
```

### 4. Validate Token Before Protected Requests

```javascript
import { useAuth } from '../context/AuthContext';

function ProtectedComponent() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get('/protected/endpoint');
    }
  }, [isAuthenticated]);
}
```

### 5. Don't Expose Sensitive Data

```javascript
// ✅ Good
console.log('Success!');

// ❌ Bad
console.log('Token:', token);
console.log('Password:', password);
```

---

## Troubleshooting

### Problem: 401 Unauthorized

**Cause:** Token is invalid or expired  
**Solution:** Check token in localStorage, user may need to login again

```javascript
const token = localStorage.getItem('authToken');
console.log('Token:', token);  // Check if it exists
```

### Problem: 403 Forbidden

**Cause:** User doesn't have permission  
**Solution:** Check user's permissions in backend

### Problem: Token Not Attached

**Cause:** localStorage.authToken doesn't exist  
**Solution:** Verify user is logged in

```javascript
const auth = useAuth();
console.log('Is logged in:', auth.isAuthenticated);
```

### Problem: CORS Error

**Cause:** Browser blocking cross-origin request  
**Solution:** Check backend CORS configuration

### Problem: Network Error

**Cause:** Backend not running or unreachable  
**Solution:** Verify `REACT_APP_API_URL` environment variable

```bash
# Check .env file
echo REACT_APP_API_URL=http://localhost:5050/api
```

---

## Summary

### What You Have

✅ Centralized API client  
✅ Automatic token attachment  
✅ Error handling  
✅ Pre-built endpoints  
✅ Production-ready  
✅ Easy to extend  

### How to Use

```javascript
// 1. Import
import { apiClient, shopifyApi } from '../services/api';

// 2. Make request (token automatic!)
const data = await shopifyApi.getProducts();

// 3. Handle response
if (data) { /* success */ }
```

### That's It!

Your API client is ready to use across your entire app. 🚀

---

**Created:** January 8, 2026  
**Status:** ✅ Ready to Use  
**Token Attachment:** ✅ Automatic  
**Production Ready:** ✅ Yes
