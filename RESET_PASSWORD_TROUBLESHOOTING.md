# Password Reset Troubleshooting Guide

## 🚨 Issue: Reset Link Redirects to Login Page

If clicking the reset password link in your email takes you back to the login page instead of the reset password form, here's how to fix it:

## 🔍 Step 1: Debug the Issue

1. **Request a new password reset** from `/auth`
2. **Click the reset link** in your email
3. **Check the URL** - it should look like:
   ```
   http://localhost:3000/auth/reset-password?type=recovery&access_token=...&refresh_token=...
   ```

4. **If the URL is different**, go to `/debug-reset` to see what parameters are being passed

## 🔧 Step 2: Check Supabase Configuration

### A. Email Templates
1. Go to your Supabase dashboard
2. Navigate to **Authentication → Email Templates**
3. Click on **"Reset Password"** template
4. Check the **"Action URL"** field - it should be:
   ```
   {{ .SiteURL }}/auth/reset-password
   ```
5. If it's different, update it and save

### B. Site URL Configuration
1. In Supabase dashboard, go to **Settings → General**
2. Check the **"Site URL"** field
3. Make sure it matches your development URL:
   ```
   http://localhost:3000
   ```

### C. Redirect URLs
1. Go to **Authentication → URL Configuration**
2. Add these URLs to **"Redirect URLs"**:
   ```
   http://localhost:3000/auth/reset-password
   http://localhost:3000/auth
   ```

## 🛠️ Step 3: Alternative Solutions

### Option 1: Use Debug Page
1. Go to `http://localhost:3000/debug-reset`
2. Copy the URL parameters from your email link
3. Add them to the debug page URL manually
4. See what parameters are missing

### Option 2: Manual Reset Process
If the automatic redirect isn't working, you can:

1. **Copy the reset link** from your email
2. **Manually navigate** to `/auth/reset-password`
3. **Add the parameters** from the email link to the URL
4. **Set your new password**

### Option 3: Check Browser Console
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Click the reset link
4. Look for any error messages or logs

## 🔄 Step 4: Test the Fix

1. **Update Supabase settings** as described above
2. **Request a new password reset**
3. **Click the new reset link**
4. **Verify it goes to the correct page**

## 📋 Common Issues and Solutions

### Issue 1: "Invalid reset link" error
**Cause**: Missing or expired tokens
**Solution**: Request a new password reset

### Issue 2: Redirects to `/auth` instead of `/auth/reset-password`
**Cause**: Incorrect redirect URL in Supabase
**Solution**: Update the email template action URL

### Issue 3: No parameters in the URL
**Cause**: Email template not configured properly
**Solution**: Check Supabase email template settings

### Issue 4: "Error setting session"
**Cause**: Invalid or expired tokens
**Solution**: Request a new reset link

## 🎯 Expected Behavior

When working correctly, the password reset flow should be:

1. **User requests reset** → Email sent
2. **User clicks email link** → Redirects to `/auth/reset-password?type=recovery&access_token=...&refresh_token=...`
3. **Page validates tokens** → Shows reset form
4. **User sets new password** → Success message
5. **User redirected to login** → Can sign in with new password

## 🆘 Still Having Issues?

If the problem persists:

1. **Check the debug page** at `/debug-reset` to see what's happening
2. **Verify your Supabase project** has email sending enabled
3. **Check your email spam folder** for the reset email
4. **Try with a different email address** to rule out email-specific issues
5. **Check browser console** for any JavaScript errors

## 📞 Quick Fix Checklist

- [ ] Supabase Site URL is set to `http://localhost:3000`
- [ ] Email template action URL is `{{ .SiteURL }}/auth/reset-password`
- [ ] Redirect URLs include `/auth/reset-password`
- [ ] Email is being received (check spam folder)
- [ ] Reset link has `type=recovery` parameter
- [ ] Reset link has `access_token` and `refresh_token` parameters

Once you've checked all these items, the password reset should work correctly! 🎉 