# Frontend Authentication System - Architecture Guide

## Overview

This document explains the **Step-3: Frontend Authentication State, Token Handling, and Protected Routes** implementation for the Shopify Dashboard. The system provides a production-ready authentication architecture using React Context and React Router v6, with **mock JWT tokens** (no backend integration required).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     App.js (Root)                           │
│  - QueryClientProvider (React Query)                        │
│  - AuthProvider (Auth Context) ← NEW                        │
│  - Router (React Router v6)                                 │
└──────────────┬──────────────────────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
   ┌───▼────┐       ┌──▼────────┐
   │ Public │       │ Protected  │
   │ Routes │       │ Routes     │
   └────────┘       └───────────┘
       │                │
    Splash          Dashboard
    Welcome    ┌──→ Products
    Login      │    Orders
    Register   │    Analytics
               │    Profile (NEW)
           ProtectedRoute
           (checks token)
```

---

## Core Components

### 1. **AuthContext.jsx** (`context/AuthContext.jsx`)

The heart of the authentication system. Provides authentication state and methods to all components.

#### Key Features:
- ✅ **Token Management**: Stores mock JWT token
- ✅ **User Info**: Stores user name, email, login time
- ✅ **Persistence**: localStorage integration for session continuity
- ✅ **Mock Authentication**: Generates fake JWT tokens (no backend needed)
- ✅ **Guest Mode**: Separate state for guest users

#### State Variables:
```javascript
{
  token: String,              // Mock JWT token or null
  user: Object,               // { name, email, loginTime }
  isAuthenticated: Boolean,   // true if logged in
  isGuest: Boolean,          // true if guest mode
  isLoading: Boolean,        // true while checking auth on load
}
```

#### Methods:

**`login(email, userName?)`**
- Creates mock JWT token
- Stores user data in state and localStorage
- Sets isAuthenticated to true

```javascript
login("user@example.com", "John Doe");
// Generates: fake-jwt-token-1234567890-abc123...
// Stores: { email, name, loginTime }
```

**`logout()`**
- Clears all auth state
- Removes data from localStorage
- Resets isAuthenticated and user

```javascript
logout();
// Clears token, user, and guest mode
```

**`continueAsGuest()`**
- Sets guest mode flag
- No token or user data
- Limited access to features

```javascript
continueAsGuest();
// User can access public content only
```

**`isLoggedIn()`**
- Helper method to check if user is authenticated
- Returns boolean

```javascript
if (auth.isLoggedIn()) {
  // User is authenticated
}
```

#### Usage Example:
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { login, logout, user, token } = useAuth();
  
  const handleLogin = (email) => {
    login(email, "John");  // Sets up auth state
  };
  
  return (
    <div>
      {user && <p>Hello, {user.name}!</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

---

### 2. **ProtectedRoute.jsx** (`components/ProtectedRoute.jsx`)

Guards sensitive routes from unauthenticated access. Only authenticated users can view protected routes.

#### How It Works:
1. Checks if user has valid token (isAuthenticated = true)
2. If authenticated → renders the component
3. If not authenticated → redirects to /login
4. While checking → shows loading spinner

#### Protected Routes:
- `/` (Dashboard)
- `/products` (Products)
- `/orders` (Orders)
- `/analytics` (Analytics)
- `/products/:handle` (Product Detail)
- `/profile` (User Profile) - NEW

#### Public Routes:
- `/splash` (Splash Screen)
- `/welcome` (Welcome Screen)
- `/login` (Login Form)
- `/register` (Register Form)

#### Usage in App.js:
```javascript
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Layout>
        <Profile />
      </Layout>
    </ProtectedRoute>
  }
/>
```

#### How Redirect Works:
```
User tries to access /profile without token
        ↓
ProtectedRoute checks isAuthenticated
        ↓
isAuthenticated === false
        ↓
Redirect to /login
        ↓
User logs in
        ↓
localStorage updated with token
        ↓
<Navigate to="/profile" /> works now
```

---

### 3. **Profile.jsx** (`pages/Profile.jsx`)

Example of a **protected route**. Only visible to authenticated users. Demonstrates:
- Accessing user data from auth context
- Displaying mock JWT token
- Account management options

#### What It Shows:
- User name and avatar
- Email address
- Login time
- Mock JWT token (for development reference)
- Account settings buttons
- Logout functionality

#### Key Code:
```javascript
const { user, token, logout } = useAuth();

return (
  <div>
    <h1>Welcome, {user.name}!</h1>
    <p>Email: {user.email}</p>
    <p>Token: {token}</p>
    <button onClick={() => logout()}>Logout</button>
  </div>
);
```

---

## Data Flow Diagrams

### Authentication Flow (Login/Register)

```
User fills form
      ↓
Validation (email, password strength)
      ↓
Form valid? → No → Show error
      ↓ Yes
Simulate API delay (1000ms)
      ↓
Call auth.login(email, userName)
      ↓
AuthContext:
├─ Generate mock token
├─ Store user data in state
├─ Save to localStorage
└─ Set isAuthenticated = true
      ↓
Navigate to /
      ↓
ProtectedRoute checks token
      ↓
Token exists? → Yes
      ↓
Render Dashboard
```

### Persistent Login Flow (Page Refresh)

```
User refreshes page (F5)
      ↓
App.js loads
      ↓
AuthProvider initializes
      ↓
useEffect checks localStorage
      ↓
authToken exists?
├─ Yes → Restore state from localStorage
│        ├─ Set token
│        ├─ Set user data
│        └─ Set isAuthenticated = true
└─ No → Keep defaults (null, null, false)
      ↓
setIsLoading(false)
      ↓
User is logged in without re-authenticating!
```

### Logout Flow

```
User clicks Logout
      ↓
Call auth.logout()
      ↓
AuthContext:
├─ Clear token state
├─ Clear user data
├─ Clear localStorage
└─ Set isAuthenticated = false
      ↓
Navigate to /welcome
      ↓
User sees Welcome screen
```

### Protected Route Access Flow

```
Unauthenticated user tries /profile
      ↓
Route renders: <ProtectedRoute><Profile/></ProtectedRoute>
      ↓
ProtectedRoute checks isAuthenticated
      ↓
isAuthenticated === false?
├─ Yes → <Navigate to="/login" />
└─ No → Render <Profile />
      ↓
If redirected:
├─ React Router changes URL to /login
├─ Browser shows Login form
└─ User can't see /profile
```

---

## Integration with Existing Components

### Login.jsx

**Before:**
```javascript
// Stored in localStorage manually
localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('userEmail', email);
```

**After:**
```javascript
import { useAuth } from '../context/AuthContext';

const { login } = useAuth();

// In handleSubmit:
login(email);  // Handles all auth state + localStorage
```

### Register.jsx

**Before:**
```javascript
localStorage.setItem('isLoggedIn', 'true');
localStorage.setItem('userName', formData.name);
localStorage.setItem('userEmail', formData.email);
```

**After:**
```javascript
const { login } = useAuth();

// In handleSubmit:
login(formData.email, formData.name);  // Full user data
```

### Layout.jsx

**Before:**
```javascript
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const userName = localStorage.getItem('userName');
```

**After:**
```javascript
import { useAuth } from '../context/AuthContext';

const { user, logout } = useAuth();

// Use user.name instead of userName
// Call logout() instead of clearing localStorage
```

### Welcome.jsx

**Before:**
```javascript
<button onClick={() => navigate('/')}>Continue as Guest</button>
```

**After:**
```javascript
const { continueAsGuest } = useAuth();

const handleContinueAsGuest = () => {
  continueAsGuest();
  navigate('/');
};
```

---

## localStorage Structure

The auth system stores the following in localStorage:

```javascript
// When user logs in:
localStorage.authToken = "fake-jwt-token-1234567890-abc123..."

localStorage.authUser = JSON.stringify({
  email: "user@example.com",
  name: "John Doe",
  loginTime: "2026-01-08T10:30:00.000Z"
})

// When user is guest:
localStorage.guestMode = "true"

// When user logs out:
// All above keys are removed
```

---

## Migration to Real JWT Backend

When ready to integrate with a real backend, only **minor changes** are needed:

### Current (Mock) Implementation:
```javascript
login(email, userName) {
  // Generate fake token
  const mockToken = `fake-jwt-token-${Date.now()}-${Math.random()}`;
  
  const userData = { email, name: userName, loginTime: new Date() };
  
  // Store immediately
  setToken(mockToken);
  setUser(userData);
}
```

### Real Backend Implementation:
```javascript
async login(email, password) {
  // Call backend API
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message);
  }
  
  // Store real JWT token
  setToken(data.token);        // Real JWT from backend
  setUser(data.user);          // User data from backend
  localStorage.setItem('authToken', data.token);
  localStorage.setItem('authUser', JSON.stringify(data.user));
}
```

**Changes Required:**
1. Replace fake token generation with API call
2. Update localStorage with real token and user data
3. Add error handling for API failures
4. No other code changes needed! ✅

---

## Security Considerations

### Current Implementation (Mock/Development):

⚠️ **Important**: This implementation is for **development only**. The mock token is not secure.

- Mock token is generated on the client
- No server validation
- Anyone can modify localStorage
- No token expiration
- No refresh token mechanism

### Production Implementation (Real Backend):

When integrating real JWT:

✅ **Do:**
- Store JWT in httpOnly cookies (not localStorage)
- Implement token refresh endpoint
- Add token expiration checks
- Validate token on backend for every API request
- Use HTTPS for all requests
- Implement CSRF protection

❌ **Don't:**
- Store sensitive data in localStorage (exposed to XSS)
- Use fake tokens in production
- Skip backend validation
- Ignore token expiration

---

## API Integration Checklist

### Phase 1: Current (No Backend)
- ✅ Mock JWT token generation
- ✅ localStorage persistence
- ✅ Protected routes
- ✅ Auth context
- ✅ Form validation

### Phase 2: Backend Login (Ready)
```javascript
// Replace this in AuthContext.login():
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { token, user } = await response.json();
setToken(token);  // Real JWT
setUser(user);    // Real user data
```

### Phase 3: Backend Register (Ready)
```javascript
// Similar to login, call /api/auth/register endpoint
const response = await fetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name, email, password })
});
```

### Phase 4: Token Refresh (Optional Enhancement)
```javascript
// Add to AuthContext for automatic token refresh
useEffect(() => {
  const interval = setInterval(() => {
    // Call /api/auth/refresh endpoint
    // Update token before expiration
  }, 5 * 60 * 1000);  // Every 5 minutes
  
  return () => clearInterval(interval);
}, []);
```

---

## Testing the System

### Test Case 1: Login with Valid Credentials
```javascript
1. Navigate to /login
2. Enter: user@example.com, Password123
3. Click "Sign In"
4. Should redirect to /
5. Check Layout shows user profile
6. Refresh page → should stay logged in
```

### Test Case 2: Protected Route Access
```javascript
1. Logout (clear all auth state)
2. Navigate to /products
3. Should redirect to /login
4. Login
5. Now /products is accessible
```

### Test Case 3: Continue as Guest
```javascript
1. From Welcome screen, click "Continue as Guest"
2. Should navigate to /
3. Should show protected route (guest can see public content)
4. Should NOT show user profile in header
5. Should not be able to access /profile (redirects to /login)
```

### Test Case 4: localStorage Persistence
```javascript
1. Login with user@example.com
2. Open DevTools → Application → localStorage
3. See authToken and authUser keys
4. Close browser completely
5. Reopen and navigate to app
6. Should still be logged in (restored from localStorage)
7. Logout
8. Check localStorage is empty
```

### Test Case 5: Token Display
```javascript
1. Login successfully
2. Navigate to /profile
3. Should display mock JWT token
4. Click "Copy Token"
5. Token should be copied to clipboard
6. Paste and verify it matches storage
```

---

## File Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx          ← Auth state & methods
│   ├── components/
│   │   ├── ProtectedRoute.jsx       ← Route protection wrapper
│   │   ├── Layout.jsx               ← Updated with auth
│   │   └── ...
│   ├── pages/
│   │   ├── Profile.jsx              ← Protected route example (NEW)
│   │   ├── Login.jsx                ← Updated to use auth
│   │   ├── Register.jsx             ← Updated to use auth
│   │   ├── Welcome.jsx              ← Updated to use auth
│   │   └── ...
│   ├── App.js                       ← Updated with AuthProvider & ProtectedRoute
│   └── ...
└── package.json
```

---

## Quick Reference

### useAuth Hook
```javascript
import { useAuth } from '../context/AuthContext';

const auth = useAuth();

// Access:
auth.token              // JWT token or null
auth.user              // { name, email, loginTime } or null
auth.isAuthenticated   // Boolean
auth.isGuest           // Boolean
auth.isLoading         // Boolean (true while initializing)

// Methods:
auth.login(email, name)           // Authenticate user
auth.logout()                     // Clear auth state
auth.continueAsGuest()            // Enable guest mode
auth.isLoggedIn()                 // Check if authenticated
```

### ProtectedRoute Usage
```javascript
<Route
  path="/protected-page"
  element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  }
/>

// If user not authenticated:
// → Automatically redirects to /login
// No manual checks needed!
```

### localStorage Keys
```javascript
localStorage.authToken              // JWT token
localStorage.authUser               // User data (JSON)
localStorage.guestMode              // "true" if guest
```

---

## Common Issues & Solutions

### Issue: User logs out but stays on page
**Solution:** ProtectedRoute will redirect on next render. If on protected page, manually navigate:
```javascript
const handleLogout = () => {
  logout();
  navigate('/welcome');
};
```

### Issue: useState in ProtectedRoute keeps loading
**Solution:** AuthProvider initializes isLoading on mount. If still loading, add timeout:
```javascript
const { isLoading } = useAuth();

// Wait a tick for auth state to initialize
if (isLoading) {
  return <Loader />;
}
```

### Issue: Token not persisting after refresh
**Solution:** Check localStorage in DevTools. If empty, AuthContext didn't save. Verify login() is called:
```javascript
const handleLogin = () => {
  // Make sure you call login() from auth context
  login(email, name);  // Not localStorage.setItem()
};
```

### Issue: Can't access protected routes after login
**Solution:** Check that ProtectedRoute wraps the route and isAuthenticated is true:
```javascript
// ✅ Correct:
<Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />

// ❌ Wrong:
<Route path="/products" element={<Products />} />
```

---

## Future Enhancements

1. **Token Expiration**: Add expiry time and auto-refresh
2. **Remember Me**: Extended session persistence
3. **Multi-Device Logout**: Clear token on all devices
4. **OAuth Integration**: Google/GitHub login
5. **Email Verification**: Confirm email before using account
6. **Two-Factor Authentication**: Extra security layer
7. **Password Reset**: Email-based recovery flow
8. **Rate Limiting**: Prevent brute force attacks

---

## Summary

✅ **What You Have:**
- Auth Context with token and user state
- Protected routes that check authentication
- localStorage persistence for sessions
- Mock JWT tokens for development
- Clean separation of concerns
- Ready for backend integration

✅ **What You Can Do:**
- Login/Register with validation
- Stay logged in after refresh
- Access protected pages only when authenticated
- Logout and clear all data
- Continue as guest (if implemented)
- Add profile/settings pages

✅ **What's Ready for Backend:**
- Replace `login()` mock with API call
- No other code needs to change!
- Same interface, different implementation
- Gradual migration possible

---

**Created:** January 8, 2026  
**Status:** ✅ Complete and ready for use  
**Next Step:** Connect to backend API when ready
