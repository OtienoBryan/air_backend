# Restart Backend Server - IMPORTANT

## Backend has been rebuilt with updated CORS configuration

The build completed successfully. Now you MUST restart the server for the changes to take effect.

## How to Restart:

### If running in terminal 2 (which it appears to be):

1. **Stop the server:**
   - Go to terminal 2
   - Press `Ctrl + C` to stop the current server

2. **Start the server again:**
   ```bash
   npm start
   ```

### Or if using PM2 on the production server:

```bash
pm2 restart royalair_server
# or
pm2 restart all
```

## What the CORS fix does:

1. ✅ Allows requests with no origin (proxy requests)
2. ✅ Allows all Vercel domains (`*.vercel.app`)
3. ✅ Allows mc-aviation domains
4. ✅ Logs the origin for debugging

## After restarting:

1. Try logging in at: https://mc-aviation.vercel.app
2. Use credentials: `admin@royal.com` / `admin123`
3. The CORS error should be resolved
4. Check server logs to see the CORS check messages

## The CORS error will persist until you restart!

The old code (line 57 error) is still running. After restart, it will use the new code with proper proxy support.
