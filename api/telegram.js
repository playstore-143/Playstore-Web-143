import { head, put, del } from '@vercel/blob';

// Put the real token in .env.local or Vercel Environment Variables. Never commit a real token here.
const token = process.env.TELEGRAM_BOT_TOKEN;

async function telegram(method, body) {
	const result = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return result.json();
}

async function saveTelegramFile(fileId, path) {
	const file = await telegram('getFile', { file_id: fileId });
	const download = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`);
	const blob = await put(path, await download.arrayBuffer(), { access: 'public', addRandomSuffix: false });
	return blob.url;
}

async function loadSession(chatId) {
	try {
		const record = await head(`sessions/${chatId}.json`);
		return fetch(record.url).then((result) => result.json());
	} catch {
		return { step: 'name', data: {} };
	}
}

async function saveSession(chatId, session) {
	await put(`sessions/${chatId}.json`, JSON.stringify(session), { access: 'public', addRandomSuffix: false });
}

function slugify(value) {
	return `${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40)}-${Date.now().toString(36)}`;
}

export default async function handler(request, response) {
	if (request.method !== 'POST') return response.status(405).json({ error: 'POST only' });
	if (!token) return response.status(500).json({ error: 'TELEGRAM_BOT_TOKEN is missing' });
	const update = request.body;
	const message = update?.message;
	if (!message?.chat?.id) return response.status(200).json({ ok: true });
	const chatId = message.chat.id;
	const session = await loadSession(chatId);

	if (message.text === '/start') {
		await saveSession(chatId, { step: 'name', data: {} });
		await telegram('sendMessage', { chat_id: chatId, text: 'App name bhejiye.' });
		return response.status(200).json({ ok: true });
	}
	if (session.step === 'name' && message.text) {
		session.data.name = message.text.trim(); session.step = 'developer';
		await telegram('sendMessage', { chat_id: chatId, text: 'Developer/company name bhejiye.' });
	} else if (session.step === 'developer' && message.text) {
		session.data.developer = message.text.trim(); session.step = 'logo';
		await telegram('sendMessage', { chat_id: chatId, text: 'Logo image bhejiye.' });
	} else if (session.step === 'logo' && (message.photo?.length || message.document)) {
		const fileId = message.photo?.at(-1)?.file_id || message.document.file_id;
		session.data.logoUrl = await saveTelegramFile(fileId, `apps/${chatId}/logo`); session.step = 'apk';
		await telegram('sendMessage', { chat_id: chatId, text: 'Ab base.apk document ke roop me bhejiye.' });
	} else if (session.step === 'apk' && message.document) {
		if (!message.document.file_name?.toLowerCase().endsWith('.apk')) {
			await telegram('sendMessage', { chat_id: chatId, text: 'Sirf .apk file bhejiye.' });
			return response.status(200).json({ ok: true });
		}
		session.data.apkUrl = await saveTelegramFile(message.document.file_id, `apps/${chatId}/base.apk`);
		session.data.slug = slugify(session.data.name); session.data.category = 'APPS'; session.data.tagline = 'Your app, ready to install.'; session.data.description = `${session.data.name} by ${session.data.developer}. Download the official app package and get started.`; session.data.version = '1.0.0';
		await put(`apps/${session.data.slug}.json`, JSON.stringify(session.data), { access: 'public', addRandomSuffix: false });
		await telegram('sendMessage', { chat_id: chatId, text: `Aapka app page ready hai:\nhttps://${request.headers.host}/app/${session.data.slug}` });
		await del(`sessions/${chatId}.json`);
		return response.status(200).json({ ok: true });
	} else {
		await telegram('sendMessage', { chat_id: chatId, text: 'Current step ke hisaab se input bhejiye ya /start se dobara shuru karein.' });
	}
	if (session.step !== 'name' || !message.text?.startsWith('/start')) await saveSession(chatId, session);
	return response.status(200).json({ ok: true });
}