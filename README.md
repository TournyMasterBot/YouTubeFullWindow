# YouTube Full Window

A small Manifest V3 browser extension that adds a **full-window** button to the YouTube player.

YouTube's built-in theatre mode only widens the video column; the page header, title, and
suggestions stay on screen. This extension pins the player itself to the browser window, so the
video **and its controls** fill everything, similar to Twitch's theatre mode.

Works in Microsoft Edge and other Chromium browsers (Chrome, Brave). It is intended as a local,
unpacked install and is not published to any extension store.

## Features

- A button in the player's bottom-right controls, next to Theater mode and Fullscreen.
- Keyboard shortcut: `Alt+T` toggles full-window mode.
- `Esc` exits full-window mode.
- Hides the YouTube header, the page below the player, the sidebar, and the comments while active.
- Leaves full-window mode automatically when you navigate to another video.
- No permissions, no network requests, no data collected or stored. It only runs on
  `https://www.youtube.com/*`.

## Install (unpacked)

1. Clone or download this repository.
2. Open `edge://extensions` (or `chrome://extensions`).
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
5. Reload any open YouTube tabs.

After editing any file, click the reload icon on the extension's card and reload the YouTube tab.

## Usage

Open a video at `youtube.com/watch?...`, then either click the corner-brackets button in the
player controls or press `Alt+T`. Press `Esc` or `Alt+T` again to leave.

## How it works

- `content.js` injects the button (a clone of YouTube's own size button, so it matches the
  surrounding controls), toggles an `ytfw-active` class on `<html>`, and re-adds the button when
  YouTube rebuilds its control bar.
- `content.css` pins `#movie_player` to the viewport, forces the video to follow the window size,
  and hides everything that is not the player.
- The player's ancestors are tagged while active so their `transform`, `contain`, `z-index` and
  similar properties cannot trap the fixed-position player or stack other page elements above it.

## Limitations

- YouTube changes its page markup often. If the button disappears or the layout breaks, the
  selectors in `ensureButton()` (`content.js`) and the hide list in `content.css` are the first
  things to check.
- Only `youtube.com/watch` pages are supported (not Shorts, embeds, or `m.youtube.com`).
- Full-window mode is not the browser's native fullscreen; the browser's tab strip and address bar
  stay visible. Use `F` / YouTube's fullscreen button if you want those gone too.

## Files

| File            | Purpose                                         |
| --------------- | ----------------------------------------------- |
| `manifest.json` | Extension manifest (MV3, content script only)   |
| `content.js`    | Button injection, toggle logic, keyboard shortcuts |
| `content.css`   | Full-window layout and hiding rules             |

## Disclaimer

Not affiliated with or endorsed by YouTube or Google. "YouTube" is a trademark of Google LLC.
