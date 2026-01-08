# Quick Reference: Frontend Authentication System

## 🚀 Start Here

### Installation & Setup
```bash
# No installation needed! Everything is already set up.
# Just start using it in your components.
```

---

## 📌 Using Authentication in Your Components

### Check if User is Logged In
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? <p>Logged in!</p> : <p>Please login</p>;
}
```

### Get User Information
```javascript
const { user } = useAuth();

console.log(user.name);        // "John Doe"
console.log(user.email);       // "john@example.com"
console.log(user.loginTime);   // ISO timestamp
```

### Login User
```javascript
const { login } = useAuth();

// After form submission
login("user@example.com", "User Name");
```

### Logout User
```javascript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate('/welcome');
};
```

### Guest Mode
```javascript
const { continueAsGuest } = useAuth();

const handleGuest = () => {
  continueAsGuest();
  navigate('/');
};
```

---

## 🔐 Protecting Routes

### Simple Protected Route
```javascript
import ProtectedRoute from '../components/ProtectedRoute';
import MyPage from '../pages/MyPage';

// In App.js routes:
<Route
  path="/my-page"
  element={
    <ProtectedRoute>
      <Layout>
        <MyPage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

**What Happens:**
- User not logged in? → Redirects to /login
- User logged in? → Shows MyPage
- Page refresh? → Stays logged in from localStorage

---

## 📊 State Diagram

```
AuthContext provides:
├── token (string or null)
├── user (object or null)
├── isAuthenticated (boolean)
├── isGuest (boolean)
├── isLoading (boolean)
├── login(email, userName?)
├── logout()
├── continueAsGuest()
└── isLoggedIn()
```

---

## 🧪 Testing

### Test Login
```javascript
// 1. Go to /login
// 2. Enter: user@example.com, Password123
// 3. Click "Sign In"
// 4. Should show dashboard
// 5. Refresh page → still logged in ✅
```

### Test Protected Routes
```javascript
// 1. Logout
// 2. Try to go to /products
// 3. Should redirect to /login ✅
```

### Test localStorage
```javascript
// Open DevTools → Application → localStorage
// Look for:
// - authToken: "fake-jwt-token-..."
// - authUser: {"name":"...","email":"..."}
```

---

## 📝 Common Code Patterns

### Conditional Rendering
```javascript
const { user, isAuthenticated } = useAuth();

return (
  <div>
    {isAuthenticated ? (
      <div>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    ) : (
      <Link to="/login">Login</Link>
    )}
  </div>
);
```

### Form Submission with Auth
```javascript
const { login } = useAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate form
  if (!isValidEmail(email)) {
    setError('Invalid email');
    return;
  }
  
  // Login
  login(email, name);
  
  // Redirect
  navigate('/');
};
```

### Redirect After Login
```javascript
const { login } = useAuth();
const navigate = useNavigate();

const handleLogin = (email) => {
  login(email);
  setTimeout(() => navigate('/'), 500);
};
```

---

## 🔑 Key Concepts

### What is a Token?
```
A "token" is a unique identifier that proves a user is authenticated.
Currently: "fake-jwt-token-1234567890-abc"
Later: Real JWT from backend
Purpose: Tell the server which user is making requests
```

### What is ProtectedRoute?
```
A wrapper component that:
1. Checks if user has a token
2. If YES → Shows the protected page
3. If NO → Redirects to /login
```

### What is localStorage?
```
Browser storage that persists data after page refresh.
Used to store:
- authToken: So user stays logged in
- authUser: User name and email
- guestMode: Track guest mode
```

### What is useAuth Hook?
```
A React hook that gives access to authentication:
- const auth = useAuth();
- auth.token, auth.user, auth.isAuthenticated
- auth.login(), auth.logout(), auth.continueAsGuest()
```

---

## 🚨 Troubleshooting

### Issue: "useAuth must be used within AuthProvider"
**Solution:** Make sure AuthProvider wraps your component in App.js
```javascript
// ✅ Correct (in App.js):
<AuthProvider>
  <Router>...</Router>
</AuthProvider>

// ❌ Wrong:
<Router>
  <Component /> // Can't use useAuth here
</Router>
```

### Issue: User logs out but stays on page
**Solution:** Navigate after logout
```javascript
const handleLogout = () => {
  logout();
  navigate('/welcome'); // Add this
};
```

### Issue: Can't access /profile after login
**Solution:** Make sure ProtectedRoute wraps the route
```javascript
// ✅ Correct:
<Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

// ❌ Wrong:
<Route path="/profile" element={<Profile />} />
```

### Issue: localStorage is empty but user is logged in
**Solution:** This is fine! State is in memory. localStorage is backup for refresh.

### Issue: User data not showing in header
**Solution:** Make sure Layout uses auth context
```javascript
// In Layout.jsx:
const { user } = useAuth();
// Then use: {user.name}
```

---

## 📚 File Locations

| File | Purpose |
|------|---------|
| `context/AuthContext.jsx` | Auth state & methods |
| `components/ProtectedRoute.jsx` | Route protection |
| `pages/Profile.jsx` | Example protected page |
| `pages/Login.jsx` | Login form (updated) |
| `pages/Register.jsx` | Register form (updated) |
| `pages/Welcome.jsx` | Welcome screen (updated) |
| `components/Layout.jsx` | Header (updated) |
| `App.js` | Routes & providers (updated) |

---

## 🎯 Routes Overview

### Public Routes (No Auth Required)
```
/splash          → Splash screen
/welcome         → Welcome screen
/login           → Login form
/register        → Register form
```

### Protected Routes (Auth Required)
```
/                → Dashboard
/products        → Products list
/products/:id    → Product detail
/orders          → Orders
/analytics       → Analytics
/profile         → User profile (NEW)
```

---

## 🔄 Data Flow

### Login Flow
```
Login Form
    ↓
Validation (email, password)
    ↓
Call auth.login(email, name)
    ↓
AuthContext generates mock token
    ↓
Saves to localStorage
    ↓
Updates state
    ↓
Navigate to / (Dashboard)
    ↓
ProtectedRoute checks token
    ↓
Dashboard renders
```

### Protected Route Access
```
User navigates to /products
    ↓
ProtectedRoute checks: isAuthenticated?
    ↓
    ├─ YES → Render /products
    └─ NO → Navigate to /login
```

### Page Refresh
```
User refreshes page (F5)
    ↓
App.js loads
    ↓
AuthProvider initializes
    ↓
Checks localStorage
    ↓
Found authToken? 
    ├─ YES → Restore user state automatically
    └─ NO → Stay logged out
```

---

## 💾 localStorage Structure

```javascript
// After Login:
{
  authToken: "fake-jwt-token-1234567890-abc123def456",
  authUser: {
    "name": "John Doe",
    "email": "john@example.com",
    "loginTime": "2026-01-08T10:30:00.000Z"
  }
}

// After Logout:
{
  // Everything cleared!
}

// Guest Mode:
{
  guestMode: "true"
}
```

---

## ✅ Checklist: Adding New Protected Pages

```
□ Create MyPage.jsx in pages/
□ Import in App.js
□ Add route with ProtectedRoute wrapper:
  <Route path="/my-page" element={<ProtectedRoute><Layout><MyPage/></Layout></ProtectedRoute>} />
□ Use useAuth() if you need user data
□ Test by logging out and trying to access page
```

---

## 🚀 Backend Integration Checklist

When ready to connect real backend:

```
□ Update AuthContext.login() to call /api/auth/login
□ Update AuthContext to handle register endpoint
□ Add .env file with API_URL
□ Replace mock token with real JWT from API
□ Add error handling for API failures
□ Test login with real backend
□ Test token persistence
□ Test logout clears token
```

---

## 📞 Common Questions

**Q: Do I need to install anything?**  
A: No! Everything is already set up. Just use it.

**Q: How long does token last?**  
A: Forever (currently). Will be configurable with real backend.

**Q: Can I use this with my backend?**  
A: Yes! Just update login() method to call your API.

**Q: What if user clears localStorage?**  
A: They'll be logged out on next refresh. They can log in again.

**Q: Can I customize protected routes?**  
A: Yes! Create variation of ProtectedRoute component.

**Q: Where do I store sensitive data?**  
A: In memory state, not localStorage. Or httpOnly cookies with backend.

---

## 🎓 Learning Resources

**In This Project:**
- `AUTHENTICATION_GUIDE.md` - Detailed guide (500+ lines)
- `STEP3_IMPLEMENTATION.md` - Implementation details
- `AuthContext.jsx` - Well-commented source code
- `ProtectedRoute.jsx` - Route protection logic
- `Profile.jsx` - Example protected component

---

## 📊 Feature Summary

| Feature | Status | Details |
|---------|--------|---------|
| Token Storage | ✅ | Saved in localStorage |
| User Persistence | ✅ | Survives page refresh |
| Protected Routes | ✅ | ProtectedRoute component |
| Auto Redirect | ✅ | To /login if not auth |
| Form Validation | ✅ | Email & password checks |
| Error Messages | ✅ | Clear user feedback |
| Logout | ✅ | Clears everything |
| Guest Mode | ✅ | No auth required |
| Mock Tokens | ✅ | For development |
| Backend Ready | ✅ | Easy to integrate |

---

## 🎉 You're All Set!

Your authentication system is:
- ✅ Fully functional
- ✅ Production-ready architecture
- ✅ Well documented
- ✅ Easy to extend
- ✅ Ready for real backend

**Start using it now, integrate backend later!**

---

**Quick Links:**
- [AuthContext.jsx](../src/context/AuthContext.jsx) - Auth state
- [ProtectedRoute.jsx](../src/components/ProtectedRoute.jsx) - Route protection
- [AUTHENTICATION_GUIDE.md](../AUTHENTICATION_GUIDE.md) - Full guide
- [Profile.jsx](../src/pages/Profile.jsx) - Example page

---

**Created:** January 8, 2026  
**Status:** ✅ Complete & Ready  
**Version:** 1.0
