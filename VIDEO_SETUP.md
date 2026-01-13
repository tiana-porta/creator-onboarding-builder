# Video Setup for Commitment Step

## Where to Put Your Video

1. **Place your video file in the `public` folder:**
   ```
   /Users/tianaporta/whop-onboarding/public/commitment-video.mp4
   ```

2. **Supported formats:**
   - `.mp4` (recommended)
   - `.webm` (alternative)

3. **File name:** The component is looking for:
   - `commitment-video.mp4` (primary)
   - `commitment-video.webm` (fallback)

## Steps

1. **Add your video:**
   ```bash
   # Copy your video file to the public folder
   cp /path/to/your/video.mp4 /Users/tianaporta/whop-onboarding/public/commitment-video.mp4
   ```

2. **Test locally:**
   ```bash
   cd /Users/tianaporta/whop-onboarding
   npm run dev
   ```

3. **Visit:** `http://localhost:3000/onboarding`
   - Navigate to Step 2 (The Commitment)
   - The video should play automatically (muted)

## Video Settings

The video will:
- Auto-play (muted)
- Show controls
- Be responsive (16:9 aspect ratio)
- Work on mobile devices (`playsInline`)

## If You Want to Change the Video File Name

Edit `components/onboarding/Step2Commitment.tsx` and change:
```tsx
<source src="/commitment-video.mp4" type="video/mp4" />
```
to your file name.

