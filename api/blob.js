import { get } from '@vercel/blob';

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

export default async function handler(request, response) {
	const key = new URL(request.url, `https://${request.headers.host}`).searchParams.get('key');
	if (!key || !key.startsWith('apps/')) return response.status(400).json({ error: 'Invalid blob key' });
	try {
		const options = { access: 'private' };
		if (blobToken) options.token = blobToken;
		const blob = await get(key, options);
		if (!blob) return response.status(404).json({ error: 'File not found' });
		
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