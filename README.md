# SkipCut Redirector (Chrome Extension)

Adds a small SkipCut button on YouTube. Clicking it opens the current video on `skipcut.com/<YouTubeVideoURL>` in a new tab. On SkipCut, the extension attempts to automatically enter fullscreen.

## Install (Developer Mode)
1. Download or clone this folder.
2. Open Chrome → Menu → Extensions → Manage Extensions.
3. Toggle Developer Mode on.
4. Click "Load unpacked" and select this folder.

## Usage
- On youtube.com, hover over a thumbnail or open a watch page. A SkipCut button (red circle with a white right arrow) appears in the bottom-right (thumbnails) or near the player controls (watch page).
- Click the button to open the same video on SkipCut. The extension will try to auto-fullscreen the embedded player.

## Notes
- The icon is embedded as an inline SVG (no external image files needed).
- Fullscreen may require user gesture depending on browser policy. The script retries for several seconds and falls back to clicking the YouTube fullscreen control if available.
- Works on `youtube.com`, `m.youtube.com`, and `youtu.be`.
