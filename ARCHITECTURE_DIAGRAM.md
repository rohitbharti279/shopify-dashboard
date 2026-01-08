# Frontend Authentication Architecture

## System Overview

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                      App.js (Root)                         ┃
┃  ┌─────────────────────────────────────────────────────┐  ┃
┃  │ QueryClientProvider                                 │  ┃
┃  │  └─ AuthProvider (Step-3) ✨ NEW                   │  ┃
┃  │      └─ Router (React Router v6)                    │  ┃
┃  │          ├─ Routes                                  │  ┃
┃  │          │  ├─ Public Routes (No Protection)       │  ┃
┃  │          │  │  ├─ /splash                          │  ┃
┃  │          │  │  ├─ /welcome                         │  ┃
┃  │          │  │  ├─ /login                           │  ┃
┃  │          │  │  └─ /register                        │  ┃
┃  │          │  └─ Protected Routes (AuthRequired)      │  ┃
┃  │          │     ├─ / (Dashboard)                    │  ┃
┃  │          │     ├─ /products                        │  ┃
┃  │          │     ├─ /products/:handle                │  ┃
┃  │          │     ├─ /orders                          │  ┃
┃  │          │     ├─ /analytics                       │  ┃
┃  │          │     └─ /profile (NEW) ✨                │  ┃
┃  │          └─ Toaster (Toast notifications)          │  ┃
┃  └─────────────────────────────────────────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## Authentication Context Hierarchy

```
┌─────────────────────────────────────────────────┐
│  AuthContext (Singleton)                        │
│  Provides global auth state to all children     │
│                                                 │
│  State Variables:                               │
│  ├─ token: string | null                       │
│  ├─ user: { name, email, loginTime } | null   │
│  ├─ isAuthenticated: boolean                   │
│  ├─ isGuest: boolean                           │
│  └─ isLoading: boolean                         │
│                                                 │
│  Methods:                                       │
│  ├─ login(email, userName?)                    │
│  ├─ logout()                                    │
│  ├─ continueAsGuest()                          │
│  └─ isLoggedIn()                               │
└─────────────────────────────────────────────────┘
         ↓
    useAuth() Hook
         ↓
   Any Component Can:
   ├─ Check auth status
   ├─ Get user info
   ├─ Call login/logout
   └─ Access token
```

---

## Component Tree

```
App (Root)
├── QueryClientProvider
│   └── AuthProvider ✨ NEW
│       └── Router
│           ├── Splash
│           │   └── (Auto-navigate after 2.5s)
│           │
│           ├── Welcome
│           │   ├── continueAsGuest() call
│           │   ├── navigate to /login
│           │   └── navigate to /register
│           │
│           ├── Login
│           │   ├── useAuth() hook ✨
│           │   ├── Form validation
│           │   ├── call login()
│           │   └── Navigate to / after success
│           │
│           ├── Register
│           │   ├── useAuth() hook ✨
│           │   ├── Form validation
│           │   ├── call login()
│           │   └── Navigate to / after success
│           │
│           ├── ProtectedRoute ✨ NEW
│           │   └── Dashboard
│           │       ├── useShopify() hook
│           │       ├── Fetch products
│           │       └── Layout wrapper
│           │           └── Header
│           │               ├── useAuth() hook
│           │               ├── Show user profile
│           │               ├── Profile link
│           │               └── Logout button
│           │
│           ├── ProtectedRoute ✨ NEW
│           │   └── Products
│           │       ├── Product list
│           │       └── Layout wrapper
│           │
│           ├── ProtectedRoute ✨ NEW
│           │   └── Orders
│           │       ├── Order list
│           │       └── Layout wrapper
│           │
│           ├── ProtectedRoute ✨ NEW
│           │   └── Analytics
│           │       ├── Charts
│           │       └── Layout wrapper
│           │
│           ├── ProtectedRoute ✨ NEW
│           │   └── Profile ✨ NEW
│           │       ├── useAuth() hook
│           │       ├── Show user info
│           │       ├── Display mock token
│           │       ├── Account settings
│           │       └── Layout wrapper
│           │
│           └── 404
```

---

## Data Flow Diagrams

### 1. Authentication Initialization (App Load)

```
App Mounts
    ↓
AuthProvider useEffect runs
    ↓
Check localStorage for:
├─ authToken
├─ authUser
└─ guestMode
    ↓
    ├─ Found? → Restore state
    │   ├─ setToken(savedToken)
    │   ├─ setUser(savedUser)
    │   └─ setIsAuthenticated(true)
    │
    └─ Not found? → Keep defaults
        ├─ token = null
        ├─ user = null
        └─ isAuthenticated = false
    ↓
setIsLoading(false)
    ↓
Components can now use auth state
```

### 2. Login Flow

```
User @ /login Form
    ↓
Enter email & password
    ↓
Click "Sign In"
    ↓
handleSubmit() → Validate form
├─ Check email format (/^\S+@\S+\.\S+$/)
└─ Check password strength (/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
    ↓
Valid? → No → Show error message & return
    ↓
Valid? → Yes
    ↓
Simulate API delay: await 1000ms
    ↓
Call auth.login(email, name?)
    ↓
    AuthContext.login():
    ├─ Generate mock token
    │  └─ "fake-jwt-token-{timestamp}-{random}"
    ├─ Create user object
    │  └─ { email, name, loginTime }
    ├─ Update React state
    │  ├─ setToken(token)
    │  ├─ setUser(user)
    │  └─ setIsAuthenticated(true)
    └─ Save to localStorage
       ├─ localStorage.authToken = token
       └─ localStorage.authUser = JSON.stringify(user)
    ↓
Return from login() call
    ↓
Navigate to /
    ↓
Route renders: <ProtectedRoute><Dashboard/></ProtectedRoute>
    ↓
ProtectedRoute checks: isAuthenticated?
    ↓
Yes! → Render Dashboard
    ↓
User sees home page ✅
```

### 3. Protected Route Check

```
User tries to access /products
    ↓
Route matched: <ProtectedRoute><Products/></ProtectedRoute>
    ↓
ProtectedRoute component renders
    ↓
Read from context: isAuthenticated, isLoading
    ↓
isLoading? → Yes → Show Loader, wait for auth init
    ↓
isLoading? → No → Continue
    ↓
isAuthenticated? → Yes → Render <Products />
    ↓
isAuthenticated? → No → Return <Navigate to="/login" />
    ↓
React Router changes URL to /login
    ↓
Login form appears
    ↓
User logs in → token created → isAuthenticated = true
    ↓
Can now access /products ✅
```

### 4. Logout Flow

```
User clicks Logout button
    ↓
handleLogout() called
    ↓
Call auth.logout()
    ↓
AuthContext.logout():
├─ Clear React state
│  ├─ setToken(null)
│  ├─ setUser(null)
│  └─ setIsAuthenticated(false)
└─ Clear localStorage
   ├─ localStorage.removeItem('authToken')
   └─ localStorage.removeItem('authUser')
    ↓
Return from logout() call
    ↓
Navigate to /welcome
    ↓
Welcome screen appears
    ↓
Try to access /products:
├─ ProtectedRoute checks isAuthenticated
├─ Result: false
└─ Redirects to /login ✅
```

### 5. Page Refresh with Active Session

```
User logged in @ /products
    ↓
Refreshes page (F5)
    ↓
Browser reloads page
    ↓
App.js loads
    ↓
AuthProvider mounts
    ↓
useEffect checks localStorage
    ↓
Found authToken & authUser?
├─ Yes → Restore state
│  ├─ setToken(localStorage.authToken)
│  ├─ setUser(JSON.parse(localStorage.authUser))
│  └─ setIsAuthenticated(true)
└─ Done in < 10ms
    ↓
setIsLoading(false)
    ↓
Route attempts to render /products
    ↓
ProtectedRoute checks isAuthenticated
    ↓
Result: true (restored from localStorage)
    ↓
Renders /products with user data
    ↓
User back on /products page without re-login! ✅
```

---

## State Management Flow

### AuthContext State Structure

```
AuthContext
├── State Variables (useState)
│   ├── token: string | null
│   │   ├── Stores: "fake-jwt-token-1234567890-abc"
│   │   ├── Set by: login()
│   │   ├── Cleared by: logout()
│   │   └── Persisted: localStorage.authToken
│   │
│   ├── user: Object | null
│   │   ├── Stores: { name, email, loginTime }
│   │   ├── Set by: login()
│   │   ├── Cleared by: logout()
│   │   └── Persisted: localStorage.authUser
│   │
│   ├── isAuthenticated: boolean
│   │   ├── Stores: true if token exists
│   │   ├── Controls: Protected route access
│   │   └── Checks by: ProtectedRoute, useAuth()
│   │
│   ├── isGuest: boolean
│   │   ├── Stores: true if guest mode
│   │   ├── Set by: continueAsGuest()
│   │   └── Used for: Limited feature access
│   │
│   └── isLoading: boolean
│       ├── Stores: true while checking localStorage
│       ├── Set by: useEffect on mount
│       └── Used by: ProtectedRoute (show Loader)
│
├── Effects (useEffect)
│   └── On component mount:
│       ├── Check localStorage for authToken
│       ├── Check localStorage for authUser
│       ├── Restore if found
│       └── Set isLoading = false
│
└── Methods
    ├── login(email, userName?)
    │   ├── Generates mock token
    │   ├── Creates user object
    │   ├── Updates state
    │   └── Saves to localStorage
    │
    ├── logout()
    │   ├── Clears token state
    │   ├── Clears user state
    │   ├── Removes localStorage
    │   └── Resets isAuthenticated
    │
    ├── continueAsGuest()
    │   ├── Sets isGuest = true
    │   ├── Clears token & user
    │   └── Sets localStorage.guestMode
    │
    └── isLoggedIn()
        └── Returns: isAuthenticated && token !== null
```

---

## Component Interaction Map

```
┌──────────────────────────────────────────────────────────┐
│                   Global Auth State                      │
│              (AuthContext + localStorage)                │
│                                                          │
│  token: "fake-jwt-token-..."                            │
│  user: { name, email, loginTime }                       │
│  isAuthenticated: true | false                          │
│  isGuest: true | false                                  │
└──────────────────────────────────────────────────────────┘
              ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓
              
   ┌─────────────────────────────────────────────────────────┐
   │ useAuth() Hook                                          │
   │ Available in any component within AuthProvider          │
   └─────────────────────────────────────────────────────────┘
              ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑ ↓


   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │   Login      │  │  Register    │  │   Welcome    │
   │              │  │              │  │              │
   │ useAuth()    │  │ useAuth()    │  │ useAuth()    │
   │ ├─ login()   │  │ ├─ login()   │  │ ├─ guest()   │
   │ └─ navigate  │  │ └─ navigate  │  │ └─ login/reg │
   └──────────────┘  └──────────────┘  └──────────────┘


   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
   │   Layout     │  │  Dashboard   │  │   Profile    │
   │              │  │              │  │              │
   │ useAuth()    │  │ useQuery()   │  │ useAuth()    │
   │ ├─ user      │  │ ├─ products  │  │ ├─ user      │
   │ ├─ logout()  │  │ └─ loading   │  │ ├─ token     │
   │ └─ show name │  │              │  │ └─ logout()  │
   └──────────────┘  └──────────────┘  └──────────────┘


   ┌──────────────────────────────────────────────────────┐
   │    ProtectedRoute                                    │
   │                                                      │
   │  Wraps every protected component                     │
   │  ├─ Checks: isAuthenticated?                        │
   │  ├─ Yes → Render component                          │
   │  └─ No → Redirect to /login                         │
   └──────────────────────────────────────────────────────┘
```

---

## localStorage Lifecycle

```
Initial State:
└─ localStorage is empty

After Login:
├─ authToken: "fake-jwt-token-1234567890-abc123"
└─ authUser: '{"name":"John","email":"john@example.com",...}'

After Page Refresh:
├─ AuthProvider reads localStorage
├─ Restores token and user to state
├─ Components can access via useAuth()
└─ User stays logged in without re-authenticating

After Logout:
├─ logout() called
├─ localStorage.removeItem('authToken')
├─ localStorage.removeItem('authUser')
└─ localStorage is clean again

Guest Mode:
├─ continueAsGuest() called
├─ localStorage.guestMode: "true"
├─ token and user cleared
└─ Limited access mode
```

---

## Route Access Control

```
                    ┌──────────────┐
                    │  User Action │
                    │  Navigate to │
                    │   /products  │
                    └──────┬───────┘
                           ↓
                    ┌──────────────┐
                    │ Route Match? │
                    │  /products   │
                    └──────┬───────┘
                           ↓ Yes
         ┌─────────────────────────────────────┐
         │  Render: <ProtectedRoute>           │
         │          <Products />               │
         │          </ProtectedRoute>          │
         └─────────────────────┬───────────────┘
                               ↓
         ┌─────────────────────────────────────┐
         │  ProtectedRoute Component           │
         │  Reads from AuthContext:            │
         │  - isAuthenticated                  │
         │  - isLoading                        │
         └─────────────────┬───────────────────┘
                           ↓
              ┌────────────────────────┐
              │  isLoading === true?   │
              └────────────┬───────────┘
                   ↙  Yes  ↖  No
                ↙            ↖
         Return Loader    Continue
                              ↓
              ┌────────────────────────┐
              │ isAuthenticated === true?
              └────────────┬───────────┘
                   ↙  Yes  ↖  No
                ↙            ↖
         Return <Products/>  <Navigate to="/login" />
                              ↓
                         Redirect to
                          /login page
```

---

## Type Definitions

```typescript
// AuthContext Types
type AuthContextType = {
  // State
  token: string | null;
  user: {
    email: string;
    name: string;
    loginTime: string; // ISO timestamp
  } | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  
  // Methods
  login: (email: string, userName?: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
  isLoggedIn: () => boolean;
};

// Component Props
type ProtectedRouteProps = {
  children: React.ReactNode;
};

type LayoutProps = {
  children: React.ReactNode;
};
```

---

## Sequence Diagram: Login → Dashboard → Logout

```
User          Browser      AuthContext    localStorage
 │               │              │               │
 ├─ login form ──>              │               │
 │               │              │               │
 │<─ form ───────┤              │               │
 │               │              │               │
 ├─ email/pass ──>              │               │
 │               │              │               │
 │               ├─ validate ──>│               │
 │               │<─ ✓ valid ─┤               │
 │               │              │               │
 │               ├─ login() ───>│               │
 │               │              ├─ generate ──>│ save
 │               │              │ token        │ token
 │               │              │              │
 │               │<─ ok ────────┤              │
 │               │              │              │
 │<─ redirect ───┤              │              │
 │  to / ────────>              │              │
 │               │              │              │
 │               ├──────────────> check auth   │
 │               │    ✓ authed  │              │
 │               │              │              │
 │<─ dashboard ──┤              │              │
 │               │              │              │
 │  ... (30 min) │              │              │
 │               │              │              │
 ├─ logout ──────>              │              │
 │               │              │              │
 │               ├─ logout() ──>│              │
 │               │              ├─ clear ────>│ delete
 │               │              │ token       │ token
 │               │              │              │
 │               │<─ ok ────────┤              │
 │               │              │              │
 │<─ redirect ───┤              │              │
 │  to /welcome ─>              │              │
 │               │              │              │
 │<─ welcome ────┤              │              │
 │               │              │              │

Legend:
─ ─> Request/Action
<─ ─ Response/Result
─ ─> Data Flow
```

---

## Security Checklist

```
✅ Current Implementation (Development)
├─ Mock tokens stored in localStorage
├─ Token visible in browser DevTools
├─ No server validation
├─ Good for development & testing
└─ NOT for production

🔒 Production Ready (When Backend Integrated)
├─ Real JWT from backend
├─ Store in httpOnly cookies (optional)
├─ Token validated on every API request
├─ Implement token expiration
├─ Implement refresh token mechanism
├─ Use HTTPS everywhere
├─ Add CSRF protection
└─ Monitor for suspicious activity
```

---

**Architecture Diagram Created:** January 8, 2026  
**Status:** ✅ Complete  
**Version:** 1.0
