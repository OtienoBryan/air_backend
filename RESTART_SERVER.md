# How to Restart Backend Server

## Steps to Apply CORS Fix

### 1. Rebuild the Backend

```bash
cd backend
npm run build
```

Or if using TypeScript directly:
```bash
cd backend
npm run build
```

### 2. Restart the Server

**If using PM2:**
```bash
pm2 restart royalair_server
# or
pm2 restart all
```

**If using systemd service:**
```bash
sudo systemctl restart royalair_server
# or whatever your service name is
```

**If running manually:**
- Stop the current process (Ctrl+C)
- Start it again: `npm run start:prod` or `node dist/main.js`

### 3. Check Server Logs

After restarting, check the logs. You should see:
- `🌍 CORS check - Origin received: https://mc-aviation.vercel.app`
- `✅ CORS: Allowing Vercel domain: https://mc-aviation.vercel.app`

If you see `❌ CORS: Blocking origin:`, check what origin is being received.

### 4. Verify the Fix

1. Try logging in from: https://mc-aviation.vercel.app
2. Check server logs for CORS messages
3. The error should be resolved

## Important Notes

- **The server MUST be restarted** for the changes to take effect
- The new code includes logging to help debug CORS issues
- Check the server logs to see what origin is being received
