# Testing Guide: Frontend Authentication System

## Complete Test Suite for Step-3

---

## Pre-Test Setup

### 1. Start the Application
```bash
cd frontend
npm install    # If not already done
npm start      # Start dev server
```

### 2. Clear localStorage (Fresh Start)
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### 3. Open DevTools
```
Chrome: F12 or Ctrl+Shift+I
Firefox: F12
Safari: Cmd+Option+I
```

---

## Test Suite 1: Authentication Flow

### Test 1.1: Login with Valid Credentials ✅

**Objective:** Verify user can login with valid email and password

**Steps:**
```
1. Start at: http://localhost:3000
2. See: Splash screen (2.5s animation)
3. Auto-redirect to: /welcome
4. Click: "Login" button
5. Enter email: user@example.com
6. Enter password: Password123
7. Click: "Sign In"
```

**Expected Results:**
```
✓ Form validation passes
✓ Loading state shows "Signing in..."
✓ Redirects to / (Dashboard) after 1 second
✓ Dashboard loads with products/data
✓ Header shows user name
✓ "Profile" button appears in header
✓ "Logout" button appears in header
✓ No error messages
```

**localStorage Check:**
```javascript
// Open DevTools → Application → localStorage
console.log(localStorage.authToken);
// Should see: "fake-jwt-token-1234567890-abc123..."

console.log(JSON.parse(localStorage.authUser));
// Should see: { email, name, loginTime }
```

**Timeline:**
- ⏱️ Splash: 2.5 seconds
- ⏱️ Login submit: 1 second (simulated)
- ⏱️ Total: ~3.5 seconds to dashboard

---

### Test 1.2: Login with Invalid Email ❌

**Objective:** Verify email validation works

**Steps:**
```
1. Go to: /login
2. Enter email: notanemail
3. Enter password: Password123
4. Click: "Sign In"
```

**Expected Results:**
```
✓ Form does NOT submit
✓ Error message appears: "Please enter a valid email address"
✓ Focus remains on form
✓ No redirect to dashboard
✓ localStorage NOT updated
```

**Valid Email Patterns:**
```
✅ user@example.com
✅ john.doe@company.co.uk
✅ test123@domain.net
❌ notanemail
❌ @example.com
❌ user@.com
```

---

### Test 1.3: Login with Weak Password ❌

**Objective:** Verify password strength validation

**Steps:**
```
1. Go to: /login
2. Enter email: user@example.com
3. Enter password: 123          (only numbers)
4. Click: "Sign In"
```

**Expected Results:**
```
✓ Form does NOT submit
✓ Error message appears: "Password must be at least 6 characters long and contain at least one letter and one number"
✓ Focus remains on form
✓ No redirect
✓ localStorage NOT updated
```

**Password Requirements:**
```
✅ Must be 6+ characters
✅ Must contain at least 1 letter (a-z, A-Z)
✅ Must contain at least 1 number (0-9)

Examples:
✅ Password123
✅ Test1
✅ MyPass99
❌ 123456        (no letters)
❌ password      (no numbers)
❌ Pass1         (only 5 chars)
❌ 12345         (no letters)
```

---

### Test 1.4: Show/Hide Password Toggle 👁️

**Objective:** Verify password visibility toggle works

**Steps:**
```
1. Go to: /login
2. Click in password field
3. Type: Password123
4. Observe: password shows as dots
5. Click: eye icon (👁️)
6. Observe: password shows as text "Password123"
7. Click: eye icon again
8. Observe: password shows as dots again
```

**Expected Results:**
```
✓ Input type toggles between "password" and "text"
✓ Eye icon appears/changes
✓ Password value stays the same
✓ Can still submit form after toggling
✓ Toggle works multiple times
```

---

### Test 1.5: Registration Flow ✅

**Objective:** Verify user can register and auto-login

**Steps:**
```
1. Go to: /register
2. Fill form:
   - Name: John Doe
   - Email: newuser@example.com
   - Password: NewPass123
   - Confirm Password: NewPass123
3. Click: "Create Account"
```

**Expected Results:**
```
✓ All fields validated
✓ Loading state shows "Creating account..."
✓ Success message: "Account created successfully! Redirecting..."
✓ Redirects to / after 1.5 seconds
✓ User is automatically logged in
✓ Header shows: "John Doe" (user name from registration)
✓ localStorage contains new user data
```

**Validation Checks:**
```
✓ All fields required
✓ Email must be valid format
✓ Password must meet strength requirements
✓ Passwords must match
```

---

### Test 1.6: Password Mismatch on Register ❌

**Objective:** Verify confirm password validation

**Steps:**
```
1. Go to: /register
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: Password123
   - Confirm Password: Different123
3. Click: "Create Account"
```

**Expected Results:**
```
✓ Form does NOT submit
✓ Error message: "Passwords do not match"
✓ Focus remains on form
✓ No redirect
✓ No localStorage update
```

---

## Test Suite 2: Protected Routes

### Test 2.1: Access Protected Route Without Login ❌

**Objective:** Verify unauthorized access is blocked

**Steps:**
```
1. Clear localStorage: localStorage.clear()
2. Reload page: location.reload()
3. Wait for splash screen to complete
4. In URL bar: type http://localhost:3000/products
5. Press Enter
```

**Expected Results:**
```
✓ Splash screen appears first (2.5s)
✓ Redirects to /login instead of /products
✓ Login form appears
✓ No error message (normal behavior)
✓ Cannot access products without logging in
```

---

### Test 2.2: Access Protected Route After Login ✅

**Objective:** Verify authorized access works

**Steps:**
```
1. Login successfully (Test 1.1)
2. Click: "Products" in navigation
3. Observe: /products page loads
```

**Expected Results:**
```
✓ Redirects to /products (no loading spinner)
✓ Products page renders with data
✓ Can view all protected routes:
   - / (Dashboard)
   - /products
   - /products/:id
   - /orders
   - /analytics
   - /profile
```

---

### Test 2.3: Profile Page (Protected) ✅

**Objective:** Verify protected Profile page shows correct data

**Steps:**
```
1. Login as: user@example.com
2. Click: "Profile" link in header
3. Observe: /profile page loads
```

**Expected Results:**
```
✓ Profile page accessible only when logged in
✓ Shows user information:
  - Full name with avatar
  - Email address
  - Login timestamp
✓ Shows mock JWT token
✓ Copy token button works
✓ Account settings buttons present:
  - Edit Profile
  - Change Password
  - Logout
✓ Info message explains development status
```

---

### Test 2.4: Try Protected Route After Logout ❌

**Objective:** Verify access revoked after logout

**Steps:**
```
1. Login successfully
2. Go to: /products (works)
3. Click: "Logout"
4. Confirm: Redirected to /welcome
5. Try: /products again
6. Observe: Redirects to /login
```

**Expected Results:**
```
✓ Logout clears all auth state
✓ localStorage is empty (no authToken/authUser)
✓ Cannot access protected routes
✓ All protected routes redirect to /login
✓ Must login again to access
```

---

## Test Suite 3: Session Persistence

### Test 3.1: Stay Logged In After Page Refresh ✅

**Objective:** Verify session persists across refresh

**Steps:**
```
1. Login as: user@example.com (Test 1.1)
2. Go to: /products
3. Press: F5 (refresh page)
4. Observe: Page reloads
5. Check: Are you still logged in?
```

**Expected Results:**
```
✓ Page refreshes but stays on /products
✓ Header still shows user name
✓ No need to login again
✓ Session restored from localStorage
✓ All auth state intact
✓ Can navigate to other protected routes
```

**localStorage Verification:**
```javascript
// Open DevTools console before refresh
console.log(localStorage.authToken);
// After refresh, same token should exist
```

---

### Test 3.2: Stay Logged In After Closing Browser ✅

**Objective:** Verify long-term session persistence

**Steps:**
```
1. Login to app
2. Go to: /products
3. Close browser completely
4. Wait: 1 minute
5. Reopen browser
6. Navigate to: http://localhost:3000
7. Observe: Auto-splash redirects
```

**Expected Results:**
```
✓ Splash screen appears (even though you're logged in)
✓ Auto-redirects to /welcome
✓ Click any navigation link
✓ You're still logged in!
✓ No login prompt needed
✓ Session fully restored
```

**Note:** Splash only shows once per session due to sessionStorage check

---

### Test 3.3: localStorage Structure Check ✅

**Objective:** Verify data storage format

**Steps:**
```
1. Login successfully
2. Open DevTools
3. Go to: Application → localStorage
4. Find and inspect the keys
```

**Expected Structure:**
```javascript
localStorage = {
  authToken: "fake-jwt-token-1704167890123-xyz789",
  
  authUser: {
    "email": "user@example.com",
    "name": "John Doe",
    "loginTime": "2026-01-08T10:30:00.000Z"
  },
  
  splashSeen: "true"  // From app initialization
}
```

**Verify:**
```
✓ authToken is a string starting with "fake-jwt-token-"
✓ authUser is valid JSON with email, name, loginTime
✓ splashSeen is "true"
✓ No other auth-related keys
✓ localStorage clean and organized
```

---

## Test Suite 4: Guest Mode

### Test 4.1: Continue as Guest ✅

**Objective:** Verify guest mode access

**Steps:**
```
1. Start at: /welcome
2. Click: "Continue as Guest"
3. Observe: Redirects to /
```

**Expected Results:**
```
✓ No error or redirect
✓ Dashboard loads (or public home)
✓ Header shows NO user profile
✓ "Logout" button NOT visible
✓ isGuest flag is set
```

**localStorage Check:**
```javascript
console.log(localStorage.guestMode);
// Should show: "true"

console.log(localStorage.authToken);
// Should be: undefined or null
```

---

### Test 4.2: Guest Cannot Access Protected Routes ❌

**Objective:** Verify guests still can't access protected content

**Steps:**
```
1. Continue as guest (Test 4.1)
2. Try: /profile
3. Observe: Redirect behavior
```

**Expected Results:**
```
✓ Redirects to /login
✓ Guest mode doesn't bypass protection
✓ Must login to access protected routes
```

---

## Test Suite 5: Logout Functionality

### Test 5.1: Logout Clears Data ✅

**Objective:** Verify logout completely removes auth state

**Steps:**
```
1. Login successfully
2. Check localStorage (authToken exists)
3. Click: "Logout"
4. Check localStorage (should be empty)
```

**Expected Results:**
```
✓ localStorage.authToken is removed
✓ localStorage.authUser is removed
✓ localStorage.guestMode is removed
✓ React state is cleared
✓ User redirected to /welcome
```

**Verification:**
```javascript
// After logout
console.log(localStorage.authToken);      // undefined
console.log(localStorage.authUser);       // undefined
console.log(localStorage.guestMode);      // undefined
console.log(localStorage.splashSeen);     // "true" (only this remains)
```

---

### Test 5.2: Logout from Different Pages ✅

**Objective:** Verify logout works from any page

**Steps:**
```
1. Login and go to: /products
2. Click "Logout"
3. Verify redirect to /welcome

Repeat for:
- /orders
- /analytics
- /profile
```

**Expected Results:**
```
✓ Logout works from any protected page
✓ Always redirects to /welcome
✓ localStorage cleared each time
✓ Consistent behavior
```

---

## Test Suite 6: Navigation Flow

### Test 6.1: Welcome Screen Navigation ✅

**Objective:** Verify all buttons from Welcome work

**Steps:**
```
1. Clear localStorage: localStorage.clear()
2. Reload: location.reload()
3. Wait for splash
4. See Welcome screen
```

**Test Each Button:**
```
Button: "Continue as Guest"
└─ Should navigate to / (no auth required)

Button: "Login"
└─ Should navigate to /login

Button: "Register"
└─ Should navigate to /register
```

**Expected Results:**
```
✓ All three buttons work
✓ Each navigates to correct route
✓ No errors on navigation
```

---

### Test 6.2: Navigation Between Protected Routes ✅

**Objective:** Verify navigation menu works

**Steps:**
```
1. Login successfully
2. Click each navigation item
3. Verify page loads
```

**Navigation Links:**
```
✓ Dashboard (/)
✓ Products (/products)
✓ Orders (/orders)
✓ Analytics (/analytics)
✓ Profile (/profile)
✓ Logo link (back to /)
```

**Expected Results:**
```
✓ All links navigate correctly
✓ Current page highlighted in navigation
✓ No errors or redirects
✓ Data loads on each page
```

---

## Test Suite 7: Form Validation

### Test 7.1: Empty Fields on Login ❌

**Objective:** Verify required field validation

**Steps:**
```
1. Go to: /login
2. Leave email empty, fill password
3. Click: "Sign In"

Repeat with:
- Email filled, password empty
- Both empty
```

**Expected Results:**
```
✓ Error message: "Please fill in all fields"
✓ No form submission
✓ No redirect
✓ No localStorage update
```

---

### Test 7.2: Empty Fields on Register ❌

**Objective:** Verify all fields required

**Steps:**
```
1. Go to: /register
2. Try leaving each field empty
3. Click: "Create Account"
```

**Expected Results:**
```
✓ Error for each scenario
✓ Message: "Please fill in all fields"
✓ Form requires all fields
✓ No submission with missing data
```

---

## Test Suite 8: Error Handling

### Test 8.1: Error Message Display ✅

**Objective:** Verify errors show clearly

**Steps:**
```
1. Go to: /login
2. Trigger any validation error
3. Observe error message
```

**Expected Results:**
```
✓ Error appears in red box
✓ Message is clear and specific
✓ Error dismisses on new input
✓ No console errors (except validation)
✓ Multiple errors not stacked
```

---

## Test Suite 9: Loading States

### Test 9.1: Login Loading State ⏳

**Objective:** Verify loading feedback

**Steps:**
```
1. Go to: /login
2. Fill valid form
3. Click: "Sign In"
4. Watch button during 1-second delay
```

**Expected Results:**
```
✓ Button text changes: "Signing in..."
✓ Button disabled (can't click again)
✓ Form fields disabled
✓ After 1 second: redirects
```

---

### Test 9.2: ProtectedRoute Loading State ⏳

**Objective:** Verify auth check loading

**Steps:**
```
1. Open app (first load)
2. Watch for loading spinner while auth initializes
```

**Expected Results:**
```
✓ Brief loading spinner visible
✓ Resolves within 1-2 seconds
✓ Then shows actual page
```

---

## Test Suite 10: Responsive Design

### Test 10.1: Mobile View 📱

**Objective:** Verify responsive behavior

**Steps:**
```
1. Open DevTools (F12)
2. Click: Device toggle (Ctrl+Shift+M)
3. Select: iPhone or mobile device
4. Test all pages and features
```

**Expected Results:**
```
✓ Pages display correctly on mobile
✓ Forms are usable
✓ Navigation collapses/expands
✓ No horizontal scrolling
✓ Text readable
✓ Buttons clickable
```

---

### Test 10.2: Tablet View 📱

**Objective:** Verify tablet responsiveness

**Steps:**
```
1. DevTools → Select: iPad or tablet
2. Test navigation and forms
```

**Expected Results:**
```
✓ Layout adapts to tablet size
✓ Elements well-spaced
✓ Readable and usable
```

---

## Test Suite 11: Browser Compatibility

### Test 11.1: Chrome ✅

```
Browser: Google Chrome (latest)
Steps: Run all tests
Expected: All pass ✅
```

### Test 11.2: Firefox ✅

```
Browser: Mozilla Firefox (latest)
Steps: Run all tests
Expected: All pass ✅
```

### Test 11.3: Safari ✅

```
Browser: Apple Safari (latest)
Steps: Run all tests
Expected: All pass ✅
```

### Test 11.4: Edge ✅

```
Browser: Microsoft Edge (latest)
Steps: Run all tests
Expected: All pass ✅
```

---

## Test Suite 12: Console & Performance

### Test 12.1: No Console Errors ✅

**Objective:** Verify clean code execution

**Steps:**
```
1. Open DevTools → Console tab
2. Login and navigate through app
3. Watch console for errors
```

**Expected Results:**
```
✓ No red error messages
✓ No warnings related to auth
✓ Only informational messages
✓ No deprecation warnings
✓ Clean execution
```

---

### Test 12.2: localStorage Performance ✅

**Objective:** Verify fast state persistence

**Steps:**
```javascript
1. Open console
2. Run:
   console.time('auth-init');
   // ... login
   console.timeEnd('auth-init');
```

**Expected Results:**
```
✓ Auth init < 50ms
✓ localStorage operations < 5ms each
✓ No noticeable delay
✓ Smooth user experience
```

---

## Test Checklist

### Before Testing
```
□ Clear localStorage: localStorage.clear()
□ Close all app tabs
□ Refresh page
□ Open DevTools (F12)
□ Check Network tab (slow 3G)
```

### Authentication Tests
```
□ Test 1.1: Valid login
□ Test 1.2: Invalid email
□ Test 1.3: Weak password
□ Test 1.4: Show/hide password
□ Test 1.5: Registration
□ Test 1.6: Password mismatch
```

### Protected Routes Tests
```
□ Test 2.1: Access without login
□ Test 2.2: Access after login
□ Test 2.3: Profile page
□ Test 2.4: Access after logout
```

### Persistence Tests
```
□ Test 3.1: Page refresh
□ Test 3.2: Close browser
□ Test 3.3: localStorage structure
```

### Guest Mode Tests
```
□ Test 4.1: Continue as guest
□ Test 4.2: Guest can't access protected
```

### Logout Tests
```
□ Test 5.1: Logout clears data
□ Test 5.2: Logout from different pages
```

### Navigation Tests
```
□ Test 6.1: Welcome navigation
□ Test 6.2: Protected routes navigation
```

### Validation Tests
```
□ Test 7.1: Login empty fields
□ Test 7.2: Register empty fields
```

### Error Tests
```
□ Test 8.1: Error display
```

### Loading Tests
```
□ Test 9.1: Login loading
□ Test 9.2: ProtectedRoute loading
```

### Responsive Tests
```
□ Test 10.1: Mobile view
□ Test 10.2: Tablet view
```

### Browser Tests
```
□ Test 11.1: Chrome
□ Test 11.2: Firefox
□ Test 11.3: Safari
□ Test 11.4: Edge
```

### Quality Tests
```
□ Test 12.1: No console errors
□ Test 12.2: Performance acceptable
```

---

## Quick Test Command

Run all tests in sequence:
```
1. Clear localStorage
2. Refresh app
3. Go through Test Suite 1 (Authentication)
4. Go through Test Suite 2 (Protected Routes)
5. Go through Test Suite 3 (Persistence)
6. Go through Test Suite 4 (Guest)
7. Go through Test Suite 5 (Logout)
```

---

## Expected Results Summary

```
Total Tests: 28+
Expected Pass Rate: 100% ✅

Tests Should Pass:
✅ All authentication flows
✅ All protected route checks
✅ Session persistence
✅ Guest mode
✅ Logout functionality
✅ Navigation between pages
✅ Form validation
✅ Error handling
✅ Loading states
✅ Responsive design
✅ Browser compatibility
✅ No console errors
✅ Good performance

If any test fails:
→ Check browser console for errors
→ Verify localStorage structure
→ Check authentication context status
→ Review ProtectedRoute logic
```

---

**Testing Guide:** Complete  
**Last Updated:** January 8, 2026  
**Status:** ✅ Ready to Test
