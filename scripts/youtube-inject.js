(function() {
	const BUTTON_CLASS = 'skipcut-button';
	const BUTTON_ATTR = 'data-skipcut-injected';
	const SKIPCUT_BASE = 'https://skipcut.com/';

	// Inline SVG icon: red circle with white right-pointing arrow
	const ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#e11d48"/><polygon points="9,7 9,17 16,12" fill="#ffffff"/></svg>';
	const ICON_DATA_URL = 'data:image/svg+xml;utf8,' + encodeURIComponent(ICON_SVG);

	function normalizeYouTubeUrl(urlStr) {
		try {
			// Handle relative paths like /watch?v=...
			return new URL(urlStr, location.origin).toString();
		} catch (e) {
			return urlStr;
		}
	}

	function buildSkipcutUrl(youtubeUrl) {
		const normalized = normalizeYouTubeUrl(youtubeUrl);
		return SKIPCUT_BASE + normalized; // Do not encode; SkipCut expects the raw URL path-appended
	}

	function openOnSkipcut(youtubeUrl) {
		const target = buildSkipcutUrl(youtubeUrl);
		window.open(target, '_blank', 'noopener');
	}

	function getVideoUrlFromThumb(thumbEl) {
		// For grid items and search results
		const link = thumbEl.closest('a#thumbnail, a.ytd-thumbnail, a.thumbnail, a#video-title-link') || thumbEl.querySelector('a');
		if (link && link.href) return link.href;
		return null;
	}

	function getCurrentWatchUrl() {
		if (location.hostname.includes('youtube.com') || location.hostname === 'youtu.be') {
			return location.href;
		}
		return null;
	}

	function createButton(sizePx) {
		const btn = document.createElement('button');
		btn.className = BUTTON_CLASS;
		btn.setAttribute(BUTTON_ATTR, '1');
		btn.title = 'Open on SkipCut';
		btn.style.width = sizePx + 'px';
		btn.style.height = sizePx + 'px';
		btn.style.backgroundImage = `url(${ICON_DATA_URL})`;
		btn.addEventListener('click', function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			// Find video URL depending on context
			let youtubeUrl = null;
			const host = location.host;
			if (host.includes('youtube.com')) {
				if (location.pathname.startsWith('/watch')) {
					youtubeUrl = getCurrentWatchUrl();
				} else {
					const root = btn.__skipcutRoot || btn.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-playlist-video-renderer, a');
					if (root) {
						const url = getVideoUrlFromThumb(root);
						if (url) youtubeUrl = url;
					}
				}
			} else if (host === 'youtu.be') {
				youtubeUrl = getCurrentWatchUrl();
			}
			if (!youtubeUrl) {
				youtubeUrl = location.href;
			}
			openOnSkipcut(youtubeUrl);
		});
		return btn;
	}

	function injectOnWatchPage() {
		// Add a button near the player controls area
		const player = document.querySelector('ytd-watch-flexy #movie_player, #ytd-player, .html5-video-player');
		if (!player) return;
		if (player.querySelector(`.${BUTTON_CLASS}[${BUTTON_ATTR}]`)) return;

		const container = document.createElement('div');
		container.className = 'skipcut-watch-container';
		const btn = createButton(28);
		container.appendChild(btn);
		player.appendChild(container);
	}

	function injectOnThumbnails() {
		const candidates = document.querySelectorAll('ytd-thumbnail, a#thumbnail, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');
		candidates.forEach(function(el) {
			if (el.querySelector(`.${BUTTON_CLASS}`)) return;
			const btn = createButton(24);
			btn.__skipcutRoot = el;
			const wrapper = document.createElement('div');
			wrapper.className = 'skipcut-thumb-container';
			wrapper.appendChild(btn);
			// Prefer positioning inside the thumbnail container
			const thumb = el.querySelector('a#thumbnail, a.ytd-thumbnail, a#video-title-link') || el;
			thumb.style.position = thumb.style.position || 'relative';
			thumb.appendChild(wrapper);
		});
	}

	function handleMutations() {
		if (location.pathname.startsWith('/watch') || location.hostname === 'youtu.be') {
			injectOnWatchPage();
		} else {
			injectOnThumbnails();
		}
	}

	// Initial injection
	handleMutations();

	// Observe SPA navigation and dynamic loads
	const observer = new MutationObserver(function() {
		handleMutations();
	});
	observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

	// Also hook into YouTube navigation changes
	window.addEventListener('yt-navigate-finish', handleMutations);
	window.addEventListener('popstate', handleMutations);
})();
