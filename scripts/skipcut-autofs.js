(function() {
	function tryFullscreen(videoIframe) {
		try {
			// For embedded YouTube iframe, requestFullscreen must be called on a user gesture in some browsers
			// but many will allow since navigation was user-initiated from the extension.
			const el = videoIframe || document.querySelector('iframe[src*="youtube.com"], iframe[src*="youtu.be"], .html5-video-player, video');
			if (!el) return false;
			if (document.fullscreenElement) return true;
			if (el.requestFullscreen) { el.requestFullscreen(); return true; }
			if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); return true; }
			if (el.msRequestFullscreen) { el.msRequestFullscreen(); return true; }
			return false;
		} catch (e) {
			return false;
		}
	}

	function clickYouTubeFsButton() {
		const fsBtn = document.querySelector('.ytp-fullscreen-button, button[title*="Full screen" i]');
		if (fsBtn) {
			fsBtn.click();
			return true;
		}
		return false;
	}

	function attemptAutoFullscreen() {
		if (tryFullscreen()) return;
		// Fallback: trigger the YouTube player's fullscreen button after player loads
		if (clickYouTubeFsButton()) return;
	}

	attemptAutoFullscreen();
	const interval = setInterval(function() {
		if (document.fullscreenElement) { clearInterval(interval); return; }
		attemptAutoFullscreen();
	}, 500);

	// Stop trying after 10 seconds
	setTimeout(function() { clearInterval(interval); }, 10000);
})();
