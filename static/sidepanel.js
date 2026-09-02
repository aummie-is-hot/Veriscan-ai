(() => {
	const defaultColor = '#38bdf8';
	const savedTheme = localStorage.getItem('veriscan-theme') || 'dark';
	const savedColor = localStorage.getItem('veriscan-primary') || defaultColor;
	const savedDesign = localStorage.getItem('veriscan-design') || 'skeuo';

	function hexToRgb(hex) {
		const value = hex.replace('#', '');
		return {
			r: parseInt(value.slice(0, 2), 16),
			g: parseInt(value.slice(2, 4), 16),
			b: parseInt(value.slice(4, 6), 16)
		};
	}

	function contrastColor(color) {
		const { r, g, b } = hexToRgb(color);
		const luminance = [r, g, b].map((channel) => {
			const normalized = channel / 255;
			return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
		}).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
		return luminance > 0.179 ? '#0b1111' : '#ffffff';
	}

	function applyTheme(theme, color) {
		const root = document.documentElement;
		const { r, g, b } = hexToRgb(color);
		const light = theme === 'light';
		root.dataset.theme = theme;
		root.style.setProperty('--primary', color);
		root.style.setProperty('--primary-contrast', contrastColor(color));
		root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
		root.style.setProperty('--accent-blue', color);
		root.style.setProperty('--accent', color);
		root.style.setProperty('--mint', color);
		root.style.setProperty('--bg-dark', light ? '#f6faf8' : '#090d16');
		root.style.setProperty('--bg', light ? '#f6faf8' : '#090d16');
		root.style.setProperty('--night', light ? '#f6faf8' : '#0b1111');
		root.style.setProperty('--surface', light ? '#ffffff' : '#101a1c');
		root.style.setProperty('--text-main', light ? '#13201b' : '#f1f5f9');
		root.style.setProperty('--text', light ? '#13201b' : '#f1f5f9');
		root.style.setProperty('--ink', light ? '#13201b' : '#f2f4f0');
		root.style.setProperty('--text-muted', light ? '#40534b' : '#94a3b8');
		root.style.setProperty('--muted', light ? '#40534b' : '#94a3b8');
		root.style.setProperty('--card-bg', light ? 'rgba(255, 255, 255, 0.96)' : 'rgba(22, 30, 46, 0.75)');
		root.style.setProperty('--panel', light ? 'rgba(255, 255, 255, 0.96)' : 'rgba(22, 30, 46, 0.82)');
		root.style.setProperty('--border-color', light ? 'rgba(19, 32, 27, 0.18)' : 'rgba(255, 255, 255, 0.1)');
		root.style.setProperty('--line', light ? 'rgba(19, 32, 27, 0.18)' : 'rgba(242, 244, 240, 0.14)');
		document.body.classList.toggle('theme-light', light);
	}

	function applyDesign(design) {
		document.documentElement.dataset.design = design;
		localStorage.setItem('veriscan-design', design);
	}

	applyTheme(savedTheme, savedColor);
	applyDesign(savedDesign);

	const panel = document.createElement('aside');
	panel.className = 'side-panel';
	panel.innerHTML = `
		<div class="side-panel-brand">VERISCAN <span>AI</span></div>
		<button class="side-panel-toggle" type="button" aria-label="Collapse navigation" aria-expanded="true">
			<span class="side-panel-toggle-icon">&#8249;</span>
		</button>
		<nav class="side-panel-nav" aria-label="Application navigation">
			<div class="side-panel-label">Workspace</div>
			<a href="/app" data-route="/app"><span class="nav-icon">&#9632;</span><span class="nav-text">Dashboard</span></a>
			<a href="/assistant" data-route="/assistant"><span class="nav-icon">&#9673;</span><span class="nav-text">Assistant</span></a>
			<a href="/upload" data-route="/upload"><span class="nav-icon">&#8593;</span><span class="nav-text">Video analysis</span></a>
			<a href="/settings" data-route="/settings"><span class="nav-icon">&#9881;</span><span class="nav-text">Settings</span></a>
			<a href="/insights" data-route="/insights"><span class="nav-icon">&#9733;</span><span class="nav-text">Latest insights</span></a>
			<a href="/info" data-route="/info"><span class="nav-icon">&#8505;</span><span class="nav-text">How it works</span></a>
			<a href="/login" data-route="/login"><span class="nav-icon">&#8594;</span><span class="nav-text">Log in</span></a>
			<a href="/create-account" data-route="/create-account"><span class="nav-icon">&#43;</span><span class="nav-text">Create account</span></a>
			<div class="side-panel-label">Telemetry</div>
			<a href="/app#vision"><span class="nav-icon">&#9673;</span><span class="nav-text">Vision feed</span></a>
			<a href="/app#metrics"><span class="nav-icon">&#8943;</span><span class="nav-text">Signal metrics</span></a>
		</nav>
		<div class="side-panel-account" aria-live="polite"><span class="account-dot"></span><span class="account-text">Guest mode</span></div>
		<a class="side-panel-landing" href="/"><span class="nav-icon">&#8592;</span><span class="nav-text">Back to landing</span></a>
	`;

	const styles = document.createElement('style');
	styles.textContent = `
		:root { --side-panel-width: 238px; --side-panel-collapsed: 70px; }
		:focus-visible { outline: 3px solid var(--primary); outline-offset: 3px; }
		.button, .chat-form button, .chat-msg.user, .btn-audio { color: var(--primary-contrast) !important; background: var(--primary) !important; border-color: var(--primary) !important; }
		.button:hover, .chat-form button:hover { background: color-mix(in srgb, var(--primary) 88%, white) !important; }
		.side-panel { box-shadow: inset -1px 0 0 rgba(255,255,255,.08), 8px 0 24px rgba(0,0,0,.2); background: linear-gradient(145deg, var(--surface, #101a1c), color-mix(in srgb, var(--surface, #101a1c) 86%, black)); }
		.side-panel-toggle, .color-picker { box-shadow: inset 1px 1px 0 rgba(255,255,255,.18), inset -1px -2px 0 rgba(0,0,0,.25), 0 3px 0 rgba(0,0,0,.25); }
		.side-panel-nav a, .side-panel-landing, .setting-row { box-shadow: inset 0 1px 0 rgba(255,255,255,.04); }
		.side-panel-nav a:active, .side-panel-landing:active, .setting-row:active { box-shadow: inset 0 3px 6px rgba(0,0,0,.2); }
		/* Global visual themes. Skeuo is the default design. */
		[data-design="glass"] body { background-image: linear-gradient(135deg, rgba(var(--primary-rgb),.13), transparent 44%), radial-gradient(circle at 80% 5%, rgba(255,255,255,.16), transparent 25%); }
		[data-design="glass"] .video-card, [data-design="glass"] .metrics-card, [data-design="glass"] .session-summary, [data-design="glass"] .upload-card, [data-design="glass"] .results-card, [data-design="glass"] .settings-card, [data-design="glass"] .chat-shell, [data-design="glass"] .signal-board, [data-design="glass"] .card { border-color: rgba(255,255,255,.34); background: linear-gradient(135deg, rgba(255,255,255,.22), rgba(255,255,255,.06)); backdrop-filter: blur(20px); box-shadow: 0 20px 45px rgba(0,0,0,.18), inset 1px 1px 0 rgba(255,255,255,.35); }
		[data-design="glass"] .side-panel { background: rgba(17,28,38,.68); backdrop-filter: blur(22px); }
		[data-design="glass"] .metric-box, [data-design="glass"] .session-stat, [data-design="glass"] .roadmap-item { background: rgba(255,255,255,.08); }
		[data-design="jarvis"] body { background-color: #050a12; background-image: linear-gradient(135deg, rgba(0,204,255,.1), transparent 42%), repeating-linear-gradient(90deg, transparent 0, transparent 79px, rgba(0,204,255,.035) 80px); }
		[data-design="jarvis"] .video-card, [data-design="jarvis"] .metrics-card, [data-design="jarvis"] .session-summary, [data-design="jarvis"] .upload-card, [data-design="jarvis"] .results-card, [data-design="jarvis"] .settings-card, [data-design="jarvis"] .chat-shell, [data-design="jarvis"] .signal-board, [data-design="jarvis"] .card { border-color: rgba(0,204,255,.48); border-radius: 3px; background: linear-gradient(150deg, rgba(5,31,48,.94), rgba(3,13,24,.96)); box-shadow: inset 0 0 22px rgba(0,174,255,.08), 0 0 18px rgba(0,174,255,.1); }
		[data-design="jarvis"] h1, [data-design="jarvis"] h2, [data-design="jarvis"] h3, [data-design="jarvis"] .brand, [data-design="jarvis"] .side-panel-brand { letter-spacing: .04em; text-transform: uppercase; }
		[data-design="jarvis"] .side-panel { background: #061522; border-right-color: rgba(0,204,255,.4); }
		[data-design="jarvis"] .metric-box, [data-design="jarvis"] .session-stat, [data-design="jarvis"] .roadmap-item { border-radius: 2px; background: rgba(0,145,190,.08); }
		[data-design="terminal"] body { background-color: #07100b; background-image: repeating-linear-gradient(0deg, rgba(82,255,128,.025) 0, rgba(82,255,128,.025) 1px, transparent 1px, transparent 4px); }
		[data-design="terminal"] .video-card, [data-design="terminal"] .metrics-card, [data-design="terminal"] .session-summary, [data-design="terminal"] .upload-card, [data-design="terminal"] .results-card, [data-design="terminal"] .settings-card, [data-design="terminal"] .chat-shell, [data-design="terminal"] .signal-board, [data-design="terminal"] .card { border-color: rgba(82,255,128,.4); border-radius: 2px; background: rgba(5,24,12,.92); box-shadow: inset 0 0 18px rgba(82,255,128,.07), 0 0 13px rgba(82,255,128,.08); }
		[data-design="terminal"] h1, [data-design="terminal"] h2, [data-design="terminal"] h3, [data-design="terminal"] .brand, [data-design="terminal"] .side-panel-brand, [data-design="terminal"] .metric-value { font-family: 'DM Mono', monospace; letter-spacing: .03em; }
		[data-design="terminal"] .side-panel { background: #06130a; border-right-color: rgba(82,255,128,.35); }
		[data-design="terminal"] .metric-box, [data-design="terminal"] .session-stat, [data-design="terminal"] .roadmap-item { border-radius: 2px; background: rgba(82,255,128,.05); }
		/* Every design keeps a readable, purpose-built light palette. */
		[data-theme="light"][data-design="skeuo"] body { background-image: radial-gradient(circle at 15% 8%, rgba(255,255,255,.9), transparent 28%), repeating-linear-gradient(0deg, rgba(19,32,27,.018) 0, rgba(19,32,27,.018) 1px, transparent 1px, transparent 4px); }
		[data-theme="light"][data-design="skeuo"] .video-card, [data-theme="light"][data-design="skeuo"] .metrics-card, [data-theme="light"][data-design="skeuo"] .session-summary, [data-theme="light"][data-design="skeuo"] .upload-card, [data-theme="light"][data-design="skeuo"] .results-card, [data-theme="light"][data-design="skeuo"] .settings-card, [data-theme="light"][data-design="skeuo"] .chat-shell, [data-theme="light"][data-design="skeuo"] .signal-board, [data-theme="light"][data-design="skeuo"] .card { background: linear-gradient(145deg, rgba(255,255,255,.98), rgba(226,235,230,.9)); border-color: rgba(19,32,27,.2); box-shadow: inset 1px 1px 0 rgba(255,255,255,.95), inset -2px -2px 0 rgba(19,32,27,.1), 0 14px 30px rgba(19,32,27,.14); }
		[data-theme="light"][data-design="skeuo"] .metric-box, [data-theme="light"][data-design="skeuo"] .session-stat, [data-theme="light"][data-design="skeuo"] .roadmap-item { background: rgba(225,235,229,.82); }
		[data-theme="light"][data-design="glass"] body { background-color: #eef7f5; background-image: linear-gradient(135deg, rgba(var(--primary-rgb),.15), transparent 44%), radial-gradient(circle at 80% 5%, rgba(255,255,255,.95), transparent 25%); }
		[data-theme="light"][data-design="glass"] .video-card, [data-theme="light"][data-design="glass"] .metrics-card, [data-theme="light"][data-design="glass"] .session-summary, [data-theme="light"][data-design="glass"] .upload-card, [data-theme="light"][data-design="glass"] .results-card, [data-theme="light"][data-design="glass"] .settings-card, [data-theme="light"][data-design="glass"] .chat-shell, [data-theme="light"][data-design="glass"] .signal-board, [data-theme="light"][data-design="glass"] .card { background: linear-gradient(135deg, rgba(255,255,255,.72), rgba(255,255,255,.38)); border-color: rgba(19,32,27,.2); box-shadow: 0 20px 45px rgba(31,70,63,.13), inset 1px 1px 0 rgba(255,255,255,.9); }
		[data-theme="light"][data-design="glass"] .side-panel { background: rgba(255,255,255,.78); }
		[data-theme="light"][data-design="glass"] .metric-box, [data-theme="light"][data-design="glass"] .session-stat, [data-theme="light"][data-design="glass"] .roadmap-item { background: rgba(255,255,255,.42); }
		[data-theme="light"][data-design="jarvis"] body { background-color: #edf7fa; background-image: linear-gradient(135deg, rgba(0,125,165,.12), transparent 42%), repeating-linear-gradient(90deg, transparent 0, transparent 79px, rgba(0,125,165,.04) 80px); }
		[data-theme="light"][data-design="jarvis"] .video-card, [data-theme="light"][data-design="jarvis"] .metrics-card, [data-theme="light"][data-design="jarvis"] .session-summary, [data-theme="light"][data-design="jarvis"] .upload-card, [data-theme="light"][data-design="jarvis"] .results-card, [data-theme="light"][data-design="jarvis"] .settings-card, [data-theme="light"][data-design="jarvis"] .chat-shell, [data-theme="light"][data-design="jarvis"] .signal-board, [data-theme="light"][data-design="jarvis"] .card { background: linear-gradient(150deg, rgba(255,255,255,.98), rgba(220,240,246,.94)); border-color: rgba(0,125,165,.35); box-shadow: inset 0 0 22px rgba(0,145,190,.08), 0 0 18px rgba(0,145,190,.1); }
		[data-theme="light"][data-design="jarvis"] .side-panel { background: #e2f1f5; border-right-color: rgba(0,125,165,.3); }
		[data-theme="light"][data-design="jarvis"] .metric-box, [data-theme="light"][data-design="jarvis"] .session-stat, [data-theme="light"][data-design="jarvis"] .roadmap-item { background: rgba(0,145,190,.07); }
		[data-theme="light"][data-design="terminal"] body { background-color: #effaf1; background-image: repeating-linear-gradient(0deg, rgba(21,112,45,.04) 0, rgba(21,112,45,.04) 1px, transparent 1px, transparent 4px); }
		[data-theme="light"][data-design="terminal"] .video-card, [data-theme="light"][data-design="terminal"] .metrics-card, [data-theme="light"][data-design="terminal"] .session-summary, [data-theme="light"][data-design="terminal"] .upload-card, [data-theme="light"][data-design="terminal"] .results-card, [data-theme="light"][data-design="terminal"] .settings-card, [data-theme="light"][data-design="terminal"] .chat-shell, [data-theme="light"][data-design="terminal"] .signal-board, [data-theme="light"][data-design="terminal"] .card { background: #f7fff8; border-color: rgba(21,112,45,.35); box-shadow: inset 0 0 18px rgba(21,112,45,.06), 0 0 13px rgba(21,112,45,.1); }
		[data-theme="light"][data-design="terminal"] .side-panel { background: #e2f4e6; border-right-color: rgba(21,112,45,.3); }
		[data-theme="light"][data-design="terminal"] .metric-box, [data-theme="light"][data-design="terminal"] .session-stat, [data-theme="light"][data-design="terminal"] .roadmap-item { background: rgba(21,112,45,.06); }
		body { padding-left: calc(30px + var(--side-panel-width)); transition: padding-left .25s ease; }
		.side-panel { position: fixed; inset: 0 auto 0 0; z-index: 1100; width: var(--side-panel-width); padding: 30px 14px 20px; display: flex; flex-direction: column; background: var(--surface, #101a1c); border-right: 1px solid var(--border-color); transition: width .25s ease; }
		.side-panel-brand { padding: 0 14px 43px; color: var(--text); font: 800 .9rem 'Manrope', 'Inter', sans-serif; letter-spacing: .16em; white-space: nowrap; }
		.side-panel-brand span { color: var(--primary); }
		.side-panel-toggle { position: absolute; top: 26px; right: -14px; width: 28px; height: 28px; border: 1px solid var(--border-color); border-radius: 50%; background: var(--surface, #1d2b2c); color: var(--primary); cursor: pointer; }
		.side-panel-toggle-icon { display: block; font-size: 1.4rem; line-height: 1rem; transform: translateY(-1px); }
		.side-panel-label { margin: 20px 14px 9px; color: var(--muted); font: 500 .62rem 'DM Mono', monospace; letter-spacing: .12em; text-transform: uppercase; }
		.side-panel-nav a, .side-panel-landing, .setting-row { display: flex; align-items: center; gap: 13px; min-height: 43px; padding: 0 14px; border-radius: 6px; color: var(--muted); font: 600 .78rem 'Manrope', sans-serif; transition: background .2s, color .2s; }
		.side-panel-nav a:hover, .side-panel-nav a.active, .side-panel-landing:hover, .setting-row:hover { color: var(--text); background: rgba(var(--primary-rgb), .12); }
		.nav-icon { display: inline-grid; place-items: center; width: 17px; color: var(--primary); font-size: .9rem; flex: 0 0 17px; }
		.side-panel-account { display: flex; align-items: center; gap: 9px; margin: 20px 14px 0; color: var(--muted); font: 500 .65rem 'DM Mono', monospace; white-space: nowrap; overflow: hidden; }
		.account-dot { width: 7px; height: 7px; flex: 0 0 7px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 8px var(--primary); }
		.setting-row { cursor: pointer; }
		.setting-row input { margin-left: auto; }
		.theme-switch { accent-color: var(--primary); width: 16px; height: 16px; }
		.color-picker { width: 25px; height: 25px; padding: 2px; border: 1px solid var(--border-color); border-radius: 5px; background: transparent; cursor: pointer; }
		.design-select { max-width: 118px; min-width: 0; padding: 5px 6px; border: 1px solid var(--border-color); border-radius: 5px; color: var(--text); background: var(--surface, #101a1c); font: .63rem 'Manrope', sans-serif; }
		.side-panel-landing { margin-top: auto; border-top: 1px solid var(--border-color); border-radius: 0; padding-top: 15px; }
		.side-panel.collapsed { width: var(--side-panel-collapsed); }
		body.panel-collapsed { padding-left: calc(30px + var(--side-panel-collapsed)); }
		.side-panel.collapsed .side-panel-brand, .side-panel.collapsed .side-panel-label, .side-panel.collapsed .nav-text { display: none; }
		.side-panel.collapsed .side-panel-account { justify-content: center; margin-left: 0; margin-right: 0; }
		.side-panel.collapsed .account-text { display: none; }
		.side-panel.collapsed .side-panel-nav a, .side-panel.collapsed .side-panel-landing { justify-content: center; padding-left: 0; padding-right: 0; }
		@media (max-width: 760px) { body, body.panel-collapsed { padding: 86px 16px 24px; } .side-panel { inset: 0 0 auto; width: 100%; height: 68px; padding: 0 16px; flex-direction: row; align-items: center; border-right: 0; border-bottom: 1px solid var(--border-color); } .side-panel-brand { padding: 0; } .side-panel-toggle { top: 20px; right: 16px; } .side-panel-nav, .side-panel-account, .side-panel-landing { display: none; } .side-panel:not(.collapsed) .side-panel-nav { position: absolute; top: 68px; left: 0; right: 0; display: flex; gap: 4px; padding: 10px 12px; background: var(--surface, #101a1c); border-bottom: 1px solid var(--border-color); } .side-panel:not(.collapsed) .side-panel-label { display: none; } .side-panel:not(.collapsed) .side-panel-nav a { flex: 1; justify-content: center; padding: 0 8px; font-size: .7rem; } }
	`;

	document.head.appendChild(styles);
	document.body.prepend(panel);

	const toggle = panel.querySelector('.side-panel-toggle');
	const isMobile = window.matchMedia('(max-width: 760px)').matches;
	const savedPanelState = localStorage.getItem('veriscan-panel-collapsed');
	const startCollapsed = isMobile || savedPanelState === 'true';
	if (startCollapsed) {
		panel.classList.add('collapsed');
		document.body.classList.add('panel-collapsed');
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Expand navigation');
		panel.querySelector('.side-panel-toggle-icon').innerHTML = '&#8250;';
	}
	fetch('/api/account-status').then((response) => response.json()).then((account) => {
		if (account.authenticated) {
			panel.querySelector('.account-text').textContent = `Signed in as ${account.username}`;
			panel.querySelector('.side-panel-account').title = 'Account session active';
			panel.querySelector('[data-route="/login"]').style.display = 'none';
			panel.querySelector('[data-route="/create-account"]').style.display = 'none';
			const logoutLink = document.createElement('a');
			logoutLink.href = '/logout';
			logoutLink.className = 'side-panel-logout';
			logoutLink.innerHTML = '<span class="nav-icon">&#8594;</span><span class="nav-text">Log out</span>';
			panel.querySelector('.side-panel-nav').appendChild(logoutLink);
		}
	}).catch(() => {});
	toggle.addEventListener('click', () => {
		const collapsed = panel.classList.toggle('collapsed');
		document.body.classList.toggle('panel-collapsed', collapsed);
		localStorage.setItem('veriscan-panel-collapsed', String(collapsed));
		toggle.setAttribute('aria-expanded', String(!collapsed));
		toggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
		panel.querySelector('.side-panel-toggle-icon').innerHTML = collapsed ? '&#8250;' : '&#8249;';
	});

	const currentPath = window.location.pathname;
	panel.querySelectorAll('[data-route]').forEach((link) => {
		if (link.dataset.route === currentPath) link.classList.add('active');
	});
})();
