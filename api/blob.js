import { get } from '@vercel/blob';

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

export default async function handler(request, response) {
	const key = new URL(request.url, `https://${request.headers.host}`).searchParams.get('key');
	if (!key || !key.startsWith('apps/')) return response.status(400).json({ error: 'Invalid blob key' });
	try {
		const options = { access: 'private' };
		if (blobToken) options.token = blobToken;
		const blob = await get(key, options);
		if (!blob) {
			if (key.endsWith('/logo')) {
				const defaultSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#0a2540'/><stop offset='50%' stop-color='#0052cc'/><stop offset='100%' stop-color='#0065ff'/></linearGradient><linearGradient id='gold' x1='0' y1='0' x2='1' y2='0'><stop offset='0%' stop-color='#f6d365'/><stop offset='100%' stop-color='#fda085'/></linearGradient></defs><rect width='200' height='200' rx='46' fill='url(#bg)'/><path d='M100 45 L155 75 L45 75 Z' fill='url(#gold)'/><rect x='52' y='82' width='16' height='56' rx='4' fill='#ffffff'/><rect x='84' y='82' width='16' height='56' rx='4' fill='#ffffff'/><rect x='116' y='82' width='16' height='56' rx='4' fill='#ffffff'/><rect x='148' y='82' width='16' height='56' rx='4' fill='#ffffff'/><rect x='42' y='144' width='132' height='16' rx='4' fill='url(#gold)'/><circle cx='145' cy='145' r='22' fill='#00d4b6'/><path d='M135 145 L142 152 L156 138' stroke='#ffffff' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' fill='none'/></svg>`;
				response.setHeader('Content-Type', 'image/svg+xml');
				response.setHeader('Cache-Control', 'public, max-age=3600');
				return response.status(200).send(defaultSvg);
			}
			return response.status(404).json({ error: 'File not found' });
		}

		const isApk = key.endsWith('/base.apk');
		response.setHeader('Content-Type', isApk ? 'application/vnd.android.package-archive' : (blob.contentType || 'image/png'));

		if (isApk) {
			const projectSlug = key.split('/')[1] || 'app';
			const apkFileName = `${projectSlug.replace(/[^a-z0-9]/gi, '_')}.apk`;
			response.setHeader('Content-Disposition', `attachment; filename="${apkFileName}"`);
			response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		} else {
			response.setHeader('Cache-Control', 'public, max-age=86400');
		}

		return response.status(200).send(Buffer.from(await new Response(blob.stream).arrayBuffer()));
	} catch (error) {
		console.error('Blob proxy failed:', error);
		return response.status(500).json({ error: 'Could not serve file' });
	}
}