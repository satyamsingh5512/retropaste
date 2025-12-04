# 🎯 Demo User Setup

## For Hackathon Judges

### Quick Access

**Demo Credentials:**
```
Email:    demo@retropaste.dev
Password: demo123456
Username: demo_user
```

### How to Use

1. **Visit**: https://retropaste.vercel.app
2. **Click**: "SIGN IN" button
3. **Look for**: Green "DEMO CREDENTIALS" box
4. **Click**: "[AUTO-FILL DEMO CREDENTIALS]" button
5. **Click**: "[LOGIN]"

That's it! You're logged in and can test all features.

---

## Manual Setup (If Needed)

If the demo user doesn't exist yet, you can create it:

### Option 1: Via API (Easiest)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit in your browser:
   ```
   http://localhost:3000/api/seed-demo
   ```

3. You'll see a success message with the credentials

### Option 2: Via Script

```bash
npm run seed:demo
```

### Option 3: Manual Registration

1. Go to https://retropaste.vercel.app
2. Click "SIGN IN"
3. Click "Need an account? [REGISTER]"
4. Use the demo credentials to register

---

## Features to Test

Once logged in, try these features:

### 1. Create a Paste
- Click "ENTER THE TERMINAL"
- Paste some code
- Select language
- Set expiration
- Click "CREATE PASTE"

### 2. Code Playground
- View any JavaScript/TypeScript paste
- Click "[▶ RUN CODE]"
- See output in terminal

### 3. QR Code
- View any paste
- Click "[QR]" button
- Download or scan QR code

### 4. GitHub Gist
- View any paste
- Click "[GIST]" button
- Export to GitHub or Import from Gist

### 5. Embed Widget
- View any paste
- Click "[EMBED]" button
- Copy embed code
- Customize theme and height

### 6. Live Chat
- View any paste
- Click 💬 button (bottom-right)
- Ask questions about the code

### 7. Collaboration
- View any paste
- Click permission badge
- Change to "EDIT TOGETHER"
- Click "[EDIT]" to start editing

### 8. Statistics
- View any paste
- See stats panel with views, lines, etc.

### 9. AI Analysis
- Create a paste with code
- Wait for AI analysis
- See vulnerabilities and suggestions

---

## Troubleshooting

### Demo User Already Exists
If you see "Demo user already exists", that's perfect! Just use the credentials to log in.

### Can't Log In
1. Make sure MongoDB is connected
2. Try the seed API route
3. Or register manually with the demo credentials

### Features Not Working
1. Check browser console for errors
2. Make sure you're logged in
3. Try refreshing the page

---

## Support

If you encounter any issues:
- Check the browser console
- Verify MongoDB connection
- Contact: satym@retropaste.dev

---

**Happy Testing! 🎉**
