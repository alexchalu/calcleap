/* ToolPulse — App Logic */

// ── Tool Registry ──────────────────────────────────────────────
const tools = [
    { id: 'json-formatter', icon: '{ }', name: 'JSON Formatter', desc: 'Format, validate, and minify JSON data instantly.', badge: 'Developer', render: renderJSON },
    { id: 'word-counter', icon: '📝', name: 'Word & Character Counter', desc: 'Count words, characters, sentences, and paragraphs.', badge: 'Writing', render: renderWordCounter },
    { id: 'password-gen', icon: '🔐', name: 'Password Generator', desc: 'Generate strong, secure random passwords.', badge: 'Security', render: renderPasswordGen },
    { id: 'qr-generator', icon: '📱', name: 'QR Code Generator', desc: 'Create QR codes for URLs, text, WiFi, and more.', badge: 'Utility', render: renderQRGen },
    { id: 'base64', icon: '🔄', name: 'Base64 Encoder/Decoder', desc: 'Encode and decode Base64 strings.', badge: 'Developer', render: renderBase64 },
    { id: 'color-converter', icon: '🎨', name: 'Color Converter', desc: 'Convert between HEX, RGB, and HSL color formats.', badge: 'Design', render: renderColorConverter },
    { id: 'hash-gen', icon: '🔒', name: 'Hash Generator', desc: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.', badge: 'Security', render: renderHashGen },
    { id: 'uuid-gen', icon: '🆔', name: 'UUID Generator', desc: 'Generate random UUIDs (v4) in bulk.', badge: 'Developer', render: renderUUIDGen },
    { id: 'url-codec', icon: '🔗', name: 'URL Encoder/Decoder', desc: 'Encode and decode URL components.', badge: 'Developer', render: renderURLCodec },
    { id: 'text-case', icon: '🔤', name: 'Text Case Converter', desc: 'Convert text to UPPER, lower, Title, camelCase, and more.', badge: 'Writing', render: renderTextCase },
    { id: 'lorem-ipsum', icon: '📄', name: 'Lorem Ipsum Generator', desc: 'Generate placeholder text for designs and layouts.', badge: 'Design', render: renderLoremIpsum },
    { id: 'timestamp', icon: '🕐', name: 'Unix Timestamp Converter', desc: 'Convert between Unix timestamps and human dates.', badge: 'Developer', render: renderTimestamp },
    { id: 'percentage-calc', icon: '📊', name: 'Percentage Calculator', desc: 'Calculate percentages, increases, and differences.', badge: 'Math', render: renderPercentageCalc },
    { id: 'unit-converter', icon: '📐', name: 'Unit Converter', desc: 'Convert length, weight, temperature, and data units.', badge: 'Utility', render: renderUnitConverter },
    { id: 'regex-tester', icon: '⚙️', name: 'Regex Tester', desc: 'Test regular expressions with real-time matching.', badge: 'Developer', render: renderRegexTester },
];

// ── App State & Navigation ─────────────────────────────────────
function init() {
    renderGrid();
    setupSearch();
    setupTheme();
    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    document.getElementById('backBtn').addEventListener('click', () => { location.hash = ''; });
    document.getElementById('logo').addEventListener('click', (e) => { e.preventDefault(); location.hash = ''; });
}

function renderGrid() {
    const grid = document.getElementById('toolGrid');
    grid.innerHTML = tools.map(t => `
        <a class="tool-card" href="#${t.id}" data-name="${t.name.toLowerCase()}">
            <div class="icon">${t.icon}</div>
            <h3>${t.name}</h3>
            <p>${t.desc}</p>
            <span class="badge">${t.badge}</span>
        </a>
    `).join('');
}

function setupSearch() {
    const input = document.getElementById('toolSearch');
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(card => {
            card.style.display = card.dataset.name.includes(q) ? '' : 'none';
        });
    });
}

function handleRoute() {
    const hash = location.hash.slice(1);
    const tool = tools.find(t => t.id === hash);
    if (tool) {
        document.getElementById('landing').classList.remove('active');
        document.getElementById('toolPage').classList.add('active');
        document.getElementById('toolTitle').textContent = tool.icon + ' ' + tool.name;
        document.getElementById('toolDesc').textContent = tool.desc;
        document.title = `${tool.name} — ToolPulse`;
        const content = document.getElementById('toolContent');
        content.innerHTML = '';
        tool.render(content);
        window.scrollTo(0, 0);
    } else {
        document.getElementById('landing').classList.add('active');
        document.getElementById('toolPage').classList.remove('active');
        document.title = 'ToolPulse — Free Online Tools';
    }
}

// ── Theme ──────────────────────────────────────────────────────
function setupTheme() {
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('tp-theme');
    if (saved === 'light') { document.documentElement.setAttribute('data-theme', 'light'); btn.textContent = '☀️'; }
    btn.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
        btn.textContent = isLight ? '🌙' : '☀️';
        localStorage.setItem('tp-theme', isLight ? 'dark' : 'light');
    });
}

// ── Helpers ─────────────────────────────────────────────────────
function copyText(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = orig, 1500);
    });
}

function el(tag, attrs = {}, children = '') {
    const e = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') e.className = v;
        else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v);
    });
    if (typeof children === 'string') e.innerHTML = children;
    else if (children instanceof HTMLElement) e.appendChild(children);
    else if (Array.isArray(children)) children.forEach(c => { if (c) e.appendChild(c); });
    return e;
}

// ── Tool Renderers ──────────────────────────────────────────────

// 1. JSON Formatter
function renderJSON(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input JSON</label>
            <textarea id="jsonIn" rows="10" placeholder='{"key": "value"}'></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="jsonFormat()">Format</button>
            <button class="btn btn-secondary" onclick="jsonMinify()">Minify</button>
            <button class="btn btn-secondary" onclick="jsonValidate()">Validate</button>
        </div>
        <div class="output-area" id="jsonOut"><button class="copy-btn" onclick="copyText(document.getElementById('jsonOut').innerText, this)">Copy</button>Paste JSON above and click Format</div>
    `;
}
window.jsonFormat = () => {
    try {
        const obj = JSON.parse(document.getElementById('jsonIn').value);
        document.getElementById('jsonOut').textContent = JSON.stringify(obj, null, 2);
    } catch (e) { document.getElementById('jsonOut').textContent = '❌ Invalid JSON: ' + e.message; }
};
window.jsonMinify = () => {
    try {
        const obj = JSON.parse(document.getElementById('jsonIn').value);
        document.getElementById('jsonOut').textContent = JSON.stringify(obj);
    } catch (e) { document.getElementById('jsonOut').textContent = '❌ Invalid JSON: ' + e.message; }
};
window.jsonValidate = () => {
    try {
        JSON.parse(document.getElementById('jsonIn').value);
        document.getElementById('jsonOut').textContent = '✅ Valid JSON';
    } catch (e) { document.getElementById('jsonOut').textContent = '❌ Invalid: ' + e.message; }
};

// 2. Word & Character Counter
function renderWordCounter(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Enter your text</label>
            <textarea id="wcIn" rows="8" placeholder="Type or paste your text here..."></textarea>
        </div>
        <div class="stats-grid" id="wcStats">
            <div class="stat-box"><div class="value" id="wcWords">0</div><div class="label">Words</div></div>
            <div class="stat-box"><div class="value" id="wcChars">0</div><div class="label">Characters</div></div>
            <div class="stat-box"><div class="value" id="wcCharsNoSpace">0</div><div class="label">No Spaces</div></div>
            <div class="stat-box"><div class="value" id="wcSentences">0</div><div class="label">Sentences</div></div>
            <div class="stat-box"><div class="value" id="wcParagraphs">0</div><div class="label">Paragraphs</div></div>
            <div class="stat-box"><div class="value" id="wcReadTime">0</div><div class="label">Read Time (min)</div></div>
        </div>
    `;
    document.getElementById('wcIn').addEventListener('input', updateWC);
}
function updateWC() {
    const text = document.getElementById('wcIn').value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    document.getElementById('wcWords').textContent = words;
    document.getElementById('wcChars').textContent = text.length;
    document.getElementById('wcCharsNoSpace').textContent = text.replace(/\s/g, '').length;
    document.getElementById('wcSentences').textContent = text.trim() ? (text.match(/[.!?]+/g) || []).length || (words > 0 ? 1 : 0) : 0;
    document.getElementById('wcParagraphs').textContent = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    document.getElementById('wcReadTime').textContent = Math.max(1, Math.ceil(words / 200));
}

// 3. Password Generator
function renderPasswordGen(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Password Length: <span id="pwLenVal">16</span></label>
            <input type="range" id="pwLen" min="4" max="128" value="16">
        </div>
        <div class="check-row">
            <label><input type="checkbox" id="pwUpper" checked> Uppercase (A-Z)</label>
            <label><input type="checkbox" id="pwLower" checked> Lowercase (a-z)</label>
            <label><input type="checkbox" id="pwDigits" checked> Digits (0-9)</label>
            <label><input type="checkbox" id="pwSymbols" checked> Symbols (!@#$...)</label>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="generatePassword()">Generate Password</button>
            <button class="btn btn-secondary" onclick="generateBulkPasswords()">Generate 10</button>
        </div>
        <div class="output-area" id="pwOut" style="font-size:1.1rem;letter-spacing:1px"><button class="copy-btn" onclick="copyText(document.getElementById('pwOut').innerText, this)">Copy</button>Click Generate</div>
        <div class="strength-meter"><div class="fill" id="pwStrength"></div></div>
    `;
    document.getElementById('pwLen').addEventListener('input', e => {
        document.getElementById('pwLenVal').textContent = e.target.value;
    });
}
window.generatePassword = () => {
    const len = parseInt(document.getElementById('pwLen').value);
    let chars = '';
    if (document.getElementById('pwUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('pwLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('pwDigits').checked) chars += '0123456789';
    if (document.getElementById('pwSymbols').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { document.getElementById('pwOut').textContent = '⚠️ Select at least one option'; return; }
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    let pw = '';
    for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];
    document.getElementById('pwOut').textContent = pw;
    // Strength meter
    const strength = Math.min(100, (chars.length / 90) * (len / 20) * 100);
    const fill = document.getElementById('pwStrength');
    fill.style.width = strength + '%';
    fill.style.background = strength > 70 ? 'var(--success)' : strength > 40 ? 'var(--warning)' : 'var(--danger)';
};
window.generateBulkPasswords = () => {
    const len = parseInt(document.getElementById('pwLen').value);
    let chars = '';
    if (document.getElementById('pwUpper').checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (document.getElementById('pwLower').checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (document.getElementById('pwDigits').checked) chars += '0123456789';
    if (document.getElementById('pwSymbols').checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) { document.getElementById('pwOut').textContent = '⚠️ Select at least one option'; return; }
    let out = '';
    for (let j = 0; j < 10; j++) {
        const arr = new Uint32Array(len);
        crypto.getRandomValues(arr);
        let pw = '';
        for (let i = 0; i < len; i++) pw += chars[arr[i] % chars.length];
        out += pw + '\n';
    }
    document.getElementById('pwOut').textContent = out.trim();
};

// 4. QR Code Generator
function renderQRGen(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Content</label>
            <textarea id="qrIn" rows="3" placeholder="Enter URL, text, or WiFi credentials..."></textarea>
        </div>
        <div class="field"><label class="label">Size</label>
            <select id="qrSize"><option value="4">Small</option><option value="6" selected>Medium</option><option value="10">Large</option><option value="15">Extra Large</option></select>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="generateQR()">Generate QR Code</button>
            <button class="btn btn-secondary" onclick="downloadQR()">Download PNG</button>
        </div>
        <div id="qrOutput" style="text-align:center;margin-top:1rem;"></div>
    `;
}
window.generateQR = () => {
    const text = document.getElementById('qrIn').value.trim();
    if (!text) return;
    const size = parseInt(document.getElementById('qrSize').value);
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    document.getElementById('qrOutput').innerHTML = qr.createSvgTag(size, 0);
};
window.downloadQR = () => {
    const text = document.getElementById('qrIn').value.trim();
    if (!text) return;
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const img = qr.createDataURL(10, 0);
    const a = document.createElement('a');
    a.href = img;
    a.download = 'qrcode.png';
    a.click();
};

// 5. Base64 Encoder/Decoder
function renderBase64(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input</label>
            <textarea id="b64In" rows="6" placeholder="Enter text to encode or Base64 to decode..."></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="b64Encode()">Encode</button>
            <button class="btn btn-secondary" onclick="b64Decode()">Decode</button>
        </div>
        <div class="output-area" id="b64Out"><button class="copy-btn" onclick="copyText(document.getElementById('b64Out').innerText, this)">Copy</button>Result will appear here</div>
    `;
}
window.b64Encode = () => {
    try { document.getElementById('b64Out').textContent = btoa(unescape(encodeURIComponent(document.getElementById('b64In').value))); }
    catch (e) { document.getElementById('b64Out').textContent = '❌ Error: ' + e.message; }
};
window.b64Decode = () => {
    try { document.getElementById('b64Out').textContent = decodeURIComponent(escape(atob(document.getElementById('b64In').value.trim()))); }
    catch (e) { document.getElementById('b64Out').textContent = '❌ Invalid Base64: ' + e.message; }
};

// 6. Color Converter
function renderColorConverter(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Pick a Color</label>
            <input type="color" id="colorPicker" value="#6c5ce7" style="width:100%;height:50px;border:none;cursor:pointer;border-radius:var(--radius-sm);">
        </div>
        <div class="color-preview" id="colorPreview" style="background:#6c5ce7"></div>
        <div class="field"><label class="label">Or enter a color value</label>
            <input type="text" id="colorIn" placeholder="#6c5ce7 or rgb(108,92,231) or hsl(252,75%,63%)" value="#6c5ce7">
        </div>
        <div class="btn-row"><button class="btn" onclick="convertColor()">Convert</button></div>
        <div class="stats-grid" id="colorOut">
            <div class="stat-box"><div class="value" id="cHex" style="font-size:1.1rem">#6C5CE7</div><div class="label">HEX</div></div>
            <div class="stat-box"><div class="value" id="cRGB" style="font-size:1.1rem">108, 92, 231</div><div class="label">RGB</div></div>
            <div class="stat-box"><div class="value" id="cHSL" style="font-size:1.1rem">252°, 75%, 63%</div><div class="label">HSL</div></div>
        </div>
    `;
    document.getElementById('colorPicker').addEventListener('input', e => {
        document.getElementById('colorIn').value = e.target.value;
        document.getElementById('colorPreview').style.background = e.target.value;
        convertColor();
    });
}
window.convertColor = () => {
    const val = document.getElementById('colorIn').value.trim();
    let r, g, b;
    // Parse HEX
    const hexMatch = val.match(/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i);
    if (hexMatch) {
        let hex = hexMatch[1];
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        r = parseInt(hex.substr(0, 2), 16);
        g = parseInt(hex.substr(2, 2), 16);
        b = parseInt(hex.substr(4, 2), 16);
    }
    // Parse RGB
    const rgbMatch = val.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) { r = +rgbMatch[1]; g = +rgbMatch[2]; b = +rgbMatch[3]; }
    if (r === undefined) { document.getElementById('cHex').textContent = '?'; return; }
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    // HSL
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rf: h = ((gf - bf) / d + (gf < bf ? 6 : 0)) / 6; break;
            case gf: h = ((bf - rf) / d + 2) / 6; break;
            case bf: h = ((rf - gf) / d + 4) / 6; break;
        }
    }
    document.getElementById('cHex').textContent = hex;
    document.getElementById('cRGB').textContent = `${r}, ${g}, ${b}`;
    document.getElementById('cHSL').textContent = `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    document.getElementById('colorPreview').style.background = hex;
    document.getElementById('colorPicker').value = hex;
};

// 7. Hash Generator
function renderHashGen(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input Text</label>
            <textarea id="hashIn" rows="4" placeholder="Enter text to hash..."></textarea>
        </div>
        <div class="btn-row"><button class="btn" onclick="generateHashes()">Generate Hashes</button></div>
        <div id="hashOut"></div>
    `;
}
window.generateHashes = async () => {
    const text = document.getElementById('hashIn').value;
    const enc = new TextEncoder();
    const data = enc.encode(text);
    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    let html = '';
    for (const algo of algos) {
        const hashBuf = await crypto.subtle.digest(algo, data);
        const hashArr = Array.from(new Uint8Array(hashBuf));
        const hashHex = hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
        html += `<div class="field"><label class="label">${algo}</label><div class="output-area" style="font-size:0.8rem"><button class="copy-btn" onclick="copyText('${hashHex}', this)">Copy</button>${hashHex}</div></div>`;
    }
    document.getElementById('hashOut').innerHTML = html;
};

// 8. UUID Generator
function renderUUIDGen(container) {
    container.innerHTML = `
        <div class="field"><label class="label">How many UUIDs?</label>
            <input type="number" id="uuidCount" value="5" min="1" max="100">
        </div>
        <div class="btn-row"><button class="btn" onclick="generateUUIDs()">Generate</button></div>
        <div class="output-area" id="uuidOut"><button class="copy-btn" onclick="copyText(document.getElementById('uuidOut').innerText, this)">Copy</button>Click Generate</div>
    `;
}
window.generateUUIDs = () => {
    const count = Math.min(100, parseInt(document.getElementById('uuidCount').value) || 5);
    let out = '';
    for (let i = 0; i < count; i++) out += crypto.randomUUID() + '\n';
    document.getElementById('uuidOut').textContent = out.trim();
};

// 9. URL Encoder/Decoder
function renderURLCodec(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input</label>
            <textarea id="urlIn" rows="4" placeholder="Enter URL or text..."></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="urlEncode()">Encode</button>
            <button class="btn btn-secondary" onclick="urlDecode()">Decode</button>
        </div>
        <div class="output-area" id="urlOut"><button class="copy-btn" onclick="copyText(document.getElementById('urlOut').innerText, this)">Copy</button>Result here</div>
    `;
}
window.urlEncode = () => { document.getElementById('urlOut').textContent = encodeURIComponent(document.getElementById('urlIn').value); };
window.urlDecode = () => {
    try { document.getElementById('urlOut').textContent = decodeURIComponent(document.getElementById('urlIn').value); }
    catch (e) { document.getElementById('urlOut').textContent = '❌ Invalid: ' + e.message; }
};

// 10. Text Case Converter
function renderTextCase(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input Text</label>
            <textarea id="caseIn" rows="5" placeholder="Enter text to convert..."></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="textCase('upper')">UPPER CASE</button>
            <button class="btn btn-secondary" onclick="textCase('lower')">lower case</button>
            <button class="btn btn-secondary" onclick="textCase('title')">Title Case</button>
            <button class="btn btn-secondary" onclick="textCase('sentence')">Sentence case</button>
            <button class="btn btn-secondary" onclick="textCase('camel')">camelCase</button>
            <button class="btn btn-secondary" onclick="textCase('snake')">snake_case</button>
            <button class="btn btn-secondary" onclick="textCase('kebab')">kebab-case</button>
            <button class="btn btn-secondary" onclick="textCase('reverse')">esreveR</button>
        </div>
        <div class="output-area" id="caseOut"><button class="copy-btn" onclick="copyText(document.getElementById('caseOut').innerText, this)">Copy</button>Converted text here</div>
    `;
}
window.textCase = (type) => {
    const text = document.getElementById('caseIn').value;
    let result;
    switch (type) {
        case 'upper': result = text.toUpperCase(); break;
        case 'lower': result = text.toLowerCase(); break;
        case 'title': result = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()); break;
        case 'sentence': result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
        case 'camel': result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
        case 'snake': result = text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''); break;
        case 'kebab': result = text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); break;
        case 'reverse': result = text.split('').reverse().join(''); break;
    }
    document.getElementById('caseOut').textContent = result;
};

// 11. Lorem Ipsum Generator
function renderLoremIpsum(container) {
    const lorem = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra.",
        "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.",
        "Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam.",
        "Fusce risus nisl, viverra et, tempor et, pretium in, sapien. Donec venenatis vulputate lorem."
    ];
    container.innerHTML = `
        <div class="field"><label class="label">Number of Paragraphs</label>
            <input type="number" id="loremCount" value="3" min="1" max="20">
        </div>
        <div class="btn-row"><button class="btn" onclick="generateLorem()">Generate</button></div>
        <div class="output-area" id="loremOut"><button class="copy-btn" onclick="copyText(document.getElementById('loremOut').innerText, this)">Copy</button></div>
    `;
    window._lorem = lorem;
    window.generateLorem = () => {
        const count = Math.min(20, parseInt(document.getElementById('loremCount').value) || 3);
        let out = '';
        for (let i = 0; i < count; i++) {
            let para = '';
            const sentences = 3 + Math.floor(Math.random() * 4);
            for (let j = 0; j < sentences; j++) para += lorem[Math.floor(Math.random() * lorem.length)] + ' ';
            out += para.trim() + '\n\n';
        }
        document.getElementById('loremOut').textContent = out.trim();
    };
    window.generateLorem();
}

// 12. Unix Timestamp Converter
function renderTimestamp(container) {
    const now = Math.floor(Date.now() / 1000);
    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-box"><div class="value" id="tsNow" style="font-size:1.2rem">${now}</div><div class="label">Current Timestamp</div></div>
        </div>
        <div class="field"><label class="label">Unix Timestamp → Date</label>
            <input type="text" id="tsIn" placeholder="${now}" value="${now}">
        </div>
        <div class="btn-row"><button class="btn" onclick="tsToDate()">Convert to Date</button></div>
        <div class="output-area" id="tsOut">${new Date(now * 1000).toISOString()}<br>${new Date(now * 1000).toString()}</div>
        <hr style="border-color:var(--border);margin:2rem 0">
        <div class="field"><label class="label">Date → Unix Timestamp</label>
            <input type="text" id="dateIn" placeholder="2025-12-31 23:59:59" value="${new Date().toISOString().slice(0, 19).replace('T', ' ')}">
        </div>
        <div class="btn-row"><button class="btn" onclick="dateToTs()">Convert to Timestamp</button></div>
        <div class="output-area" id="dateOut">${now}</div>
    `;
    setInterval(() => { document.getElementById('tsNow').textContent = Math.floor(Date.now() / 1000); }, 1000);
}
window.tsToDate = () => {
    const ts = parseInt(document.getElementById('tsIn').value);
    if (isNaN(ts)) { document.getElementById('tsOut').textContent = '❌ Invalid timestamp'; return; }
    const ms = ts > 9999999999 ? ts : ts * 1000;
    const d = new Date(ms);
    document.getElementById('tsOut').textContent = `ISO: ${d.toISOString()}\nLocal: ${d.toString()}\nUTC: ${d.toUTCString()}\nRelative: ${timeAgo(d)}`;
};
window.dateToTs = () => {
    const d = new Date(document.getElementById('dateIn').value);
    if (isNaN(d)) { document.getElementById('dateOut').textContent = '❌ Invalid date'; return; }
    document.getElementById('dateOut').textContent = `Seconds: ${Math.floor(d.getTime() / 1000)}\nMilliseconds: ${d.getTime()}`;
};
function timeAgo(date) {
    const s = Math.floor((Date.now() - date) / 1000);
    if (s < 60) return s + 's ago';
    if (s < 3600) return Math.floor(s / 60) + 'm ago';
    if (s < 86400) return Math.floor(s / 3600) + 'h ago';
    return Math.floor(s / 86400) + 'd ago';
}

// 13. Percentage Calculator
function renderPercentageCalc(container) {
    container.innerHTML = `
        <div class="field">
            <label class="label">What is <input type="number" id="pctA" value="25" style="width:80px;display:inline"> % of <input type="number" id="pctB" value="200" style="width:100px;display:inline"> ?</label>
            <button class="btn" style="margin-top:0.5rem" onclick="calcPct1()">Calculate</button>
            <div class="output-area" id="pctOut1">= 50</div>
        </div>
        <hr style="border-color:var(--border);margin:1.5rem 0">
        <div class="field">
            <label class="label"><input type="number" id="pctC" value="50" style="width:100px;display:inline"> is what % of <input type="number" id="pctD" value="200" style="width:100px;display:inline"> ?</label>
            <button class="btn" style="margin-top:0.5rem" onclick="calcPct2()">Calculate</button>
            <div class="output-area" id="pctOut2">= 25%</div>
        </div>
        <hr style="border-color:var(--border);margin:1.5rem 0">
        <div class="field">
            <label class="label">% change from <input type="number" id="pctE" value="100" style="width:100px;display:inline"> to <input type="number" id="pctF" value="150" style="width:100px;display:inline"></label>
            <button class="btn" style="margin-top:0.5rem" onclick="calcPct3()">Calculate</button>
            <div class="output-area" id="pctOut3">= +50%</div>
        </div>
    `;
}
window.calcPct1 = () => { document.getElementById('pctOut1').textContent = '= ' + (parseFloat(document.getElementById('pctA').value) / 100 * parseFloat(document.getElementById('pctB').value)); };
window.calcPct2 = () => { document.getElementById('pctOut2').textContent = '= ' + (parseFloat(document.getElementById('pctC').value) / parseFloat(document.getElementById('pctD').value) * 100).toFixed(2) + '%'; };
window.calcPct3 = () => {
    const from = parseFloat(document.getElementById('pctE').value), to = parseFloat(document.getElementById('pctF').value);
    const change = ((to - from) / from * 100).toFixed(2);
    document.getElementById('pctOut3').textContent = '= ' + (change > 0 ? '+' : '') + change + '%';
};

// 14. Unit Converter
function renderUnitConverter(container) {
    const categories = {
        'Length': { units: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches', 'Centimeters', 'Yards'], base: [1, 1000, 1609.344, 0.3048, 0.0254, 0.01, 0.9144] },
        'Weight': { units: ['Kilograms', 'Grams', 'Pounds', 'Ounces', 'Tonnes', 'Stones'], base: [1, 0.001, 0.453592, 0.0283495, 1000, 6.35029] },
        'Temperature': { units: ['Celsius', 'Fahrenheit', 'Kelvin'], special: true },
        'Data': { units: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'], base: [1, 1024, 1048576, 1073741824, 1099511627776, 1125899906842624] },
        'Speed': { units: ['m/s', 'km/h', 'mph', 'knots'], base: [1, 0.277778, 0.44704, 0.514444] },
    };
    const catOptions = Object.keys(categories).map(c => `<option>${c}</option>`).join('');
    container.innerHTML = `
        <div class="field"><label class="label">Category</label><select id="ucCat">${catOptions}</select></div>
        <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:end">
            <div class="field"><label class="label">From</label><input type="number" id="ucVal" value="1"><select id="ucFrom" style="margin-top:0.5rem"></select></div>
            <div style="font-size:1.5rem;padding-bottom:1rem;text-align:center">→</div>
            <div class="field"><label class="label">To</label><div class="output-area" id="ucResult" style="font-size:1.3rem;font-weight:700;min-height:auto;padding:0.875rem 1rem">1</div><select id="ucTo" style="margin-top:0.5rem"></select></div>
        </div>
    `;
    window._ucCategories = categories;
    function updateUnits() {
        const cat = categories[document.getElementById('ucCat').value];
        const options = cat.units.map((u, i) => `<option value="${i}">${u}</option>`).join('');
        document.getElementById('ucFrom').innerHTML = options;
        document.getElementById('ucTo').innerHTML = options;
        if (cat.units.length > 1) document.getElementById('ucTo').value = '1';
        convertUnit();
    }
    window.convertUnit = () => {
        const catName = document.getElementById('ucCat').value;
        const cat = categories[catName];
        const val = parseFloat(document.getElementById('ucVal').value) || 0;
        const from = parseInt(document.getElementById('ucFrom').value);
        const to = parseInt(document.getElementById('ucTo').value);
        let result;
        if (catName === 'Temperature') {
            // Convert to Celsius first, then to target
            let celsius;
            if (from === 0) celsius = val;
            else if (from === 1) celsius = (val - 32) * 5 / 9;
            else celsius = val - 273.15;
            if (to === 0) result = celsius;
            else if (to === 1) result = celsius * 9 / 5 + 32;
            else result = celsius + 273.15;
        } else {
            const baseVal = val * cat.base[from];
            result = baseVal / cat.base[to];
        }
        document.getElementById('ucResult').textContent = Number.isInteger(result) ? result : result.toPrecision(8);
    };
    document.getElementById('ucCat').addEventListener('change', updateUnits);
    document.getElementById('ucVal').addEventListener('input', convertUnit);
    document.getElementById('ucFrom').addEventListener('change', convertUnit);
    document.getElementById('ucTo').addEventListener('change', convertUnit);
    updateUnits();
}

// 15. Regex Tester
function renderRegexTester(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Regular Expression</label>
            <div style="display:flex;gap:0.5rem;align-items:center">
                <span style="font-size:1.2rem;color:var(--text-muted)">/</span>
                <input type="text" id="regexPattern" placeholder="[a-z]+@[a-z]+\\.[a-z]+" style="flex:1">
                <span style="font-size:1.2rem;color:var(--text-muted)">/</span>
                <input type="text" id="regexFlags" value="gi" style="width:60px" placeholder="gi">
            </div>
        </div>
        <div class="field"><label class="label">Test String</label>
            <textarea id="regexTest" rows="5" placeholder="Enter text to test against the pattern..."></textarea>
        </div>
        <div id="regexOut"></div>
    `;
    const run = () => {
        const pattern = document.getElementById('regexPattern').value;
        const flags = document.getElementById('regexFlags').value;
        const test = document.getElementById('regexTest').value;
        if (!pattern || !test) { document.getElementById('regexOut').innerHTML = ''; return; }
        try {
            const re = new RegExp(pattern, flags);
            const matches = [...test.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
            let html = `<div style="margin:1rem 0;color:var(--success);font-weight:600">${matches.length} match${matches.length !== 1 ? 'es' : ''} found</div>`;
            // Highlight matches
            let highlighted = test;
            const allMatches = [];
            for (const m of matches) allMatches.push({ start: m.index, end: m.index + m[0].length, text: m[0] });
            // Build highlighted HTML
            let lastIdx = 0;
            let hHTML = '';
            for (const m of allMatches) {
                hHTML += escapeHTML(test.slice(lastIdx, m.start));
                hHTML += `<mark style="background:var(--accent);color:#fff;padding:1px 3px;border-radius:3px">${escapeHTML(m.text)}</mark>`;
                lastIdx = m.end;
            }
            hHTML += escapeHTML(test.slice(lastIdx));
            html += `<div class="output-area" style="white-space:pre-wrap">${hHTML}</div>`;
            // Match details
            if (matches.length > 0 && matches.length <= 50) {
                html += '<div style="margin-top:1rem"><strong>Match Details:</strong></div>';
                matches.forEach((m, i) => {
                    html += `<div style="font-size:0.85rem;color:var(--text-muted);margin:0.25rem 0">#${i + 1}: "${escapeHTML(m[0])}" at index ${m.index}</div>`;
                });
            }
            document.getElementById('regexOut').innerHTML = html;
        } catch (e) {
            document.getElementById('regexOut').innerHTML = `<div style="color:var(--danger);margin-top:1rem">❌ ${e.message}</div>`;
        }
    };
    document.getElementById('regexPattern').addEventListener('input', run);
    document.getElementById('regexFlags').addEventListener('input', run);
    document.getElementById('regexTest').addEventListener('input', run);
}
function escapeHTML(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ── NEW TOOLS ───────────────────────────────────────────────────

// 16. Markdown Preview
window.render_markdown_preview = function(container) {
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="field"><label class="label">Markdown</label>
                <textarea id="mdIn" rows="15" placeholder="# Hello World\n\nWrite **markdown** here..."></textarea>
            </div>
            <div class="field"><label class="label">Preview</label>
                <div id="mdOut" style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;min-height:300px;overflow:auto"></div>
            </div>
        </div>
    `;
    document.getElementById('mdIn').addEventListener('input', function() {
        let md = this.value;
        // Simple markdown parser
        md = md.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        md = md.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        md = md.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        md = md.replace(/\*(.*?)\*/g, '<em>$1</em>');
        md = md.replace(/`(.*?)`/g, '<code style="background:var(--border);padding:2px 6px;border-radius:4px">$1</code>');
        md = md.replace(/^\- (.*$)/gm, '<li>$1</li>');
        md = md.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
        md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--accent)">$1</a>');
        md = md.replace(/\n\n/g, '<br><br>');
        document.getElementById('mdOut').innerHTML = md;
    });
};

// 17. Image to Base64
window.render_image_to_base64 = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Select Image</label>
            <input type="file" id="imgFile" accept="image/*" style="padding:0.5rem">
        </div>
        <div id="imgPreview" style="margin:1rem 0"></div>
        <div class="output-area" id="imgB64Out" style="max-height:200px;overflow:auto"><button class="copy-btn" onclick="copyText(document.getElementById('imgB64Out').innerText, this)">Copy</button>Base64 string will appear here</div>
        <div class="field" style="margin-top:1rem"><label class="label">Data URI (for HTML/CSS)</label>
            <div class="output-area" id="imgDataUri" style="max-height:100px;overflow:auto"><button class="copy-btn" onclick="copyText(document.getElementById('imgDataUri').innerText, this)">Copy</button></div>
        </div>
    `;
    document.getElementById('imgFile').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const dataUri = ev.target.result;
            const b64 = dataUri.split(',')[1];
            document.getElementById('imgB64Out').textContent = b64;
            document.getElementById('imgDataUri').textContent = dataUri;
            document.getElementById('imgPreview').innerHTML = '<img src="' + dataUri + '" style="max-width:300px;max-height:200px;border-radius:var(--radius-sm)">';
        };
        reader.readAsDataURL(file);
    });
};

// 18. Diff Checker
window.render_diff_checker = function(container) {
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="field"><label class="label">Original Text</label>
                <textarea id="diffA" rows="10" placeholder="Paste original text..."></textarea>
            </div>
            <div class="field"><label class="label">Modified Text</label>
                <textarea id="diffB" rows="10" placeholder="Paste modified text..."></textarea>
            </div>
        </div>
        <div class="btn-row"><button class="btn" onclick="runDiff()">Compare</button></div>
        <div id="diffOut" style="margin-top:1rem"></div>
    `;
};
window.runDiff = function() {
    const a = document.getElementById('diffA').value.split('\n');
    const b = document.getElementById('diffB').value.split('\n');
    let html = '<div style="font-family:monospace;font-size:0.85rem">';
    const max = Math.max(a.length, b.length);
    let added = 0, removed = 0, unchanged = 0;
    for (let i = 0; i < max; i++) {
        const la = a[i] !== undefined ? a[i] : null;
        const lb = b[i] !== undefined ? b[i] : null;
        if (la === lb) {
            html += `<div style="padding:2px 8px;color:var(--text-muted)">&nbsp; ${escapeHTML(la || '')}</div>`;
            unchanged++;
        } else {
            if (la !== null) { html += `<div style="padding:2px 8px;background:rgba(225,112,85,0.15);color:var(--danger)">- ${escapeHTML(la)}</div>`; removed++; }
            if (lb !== null) { html += `<div style="padding:2px 8px;background:rgba(0,184,148,0.15);color:var(--success)">+ ${escapeHTML(lb)}</div>`; added++; }
        }
    }
    html += '</div>';
    document.getElementById('diffOut').innerHTML = `
        <div class="stats-grid" style="margin-bottom:1rem">
            <div class="stat-box"><div class="value" style="color:var(--success)">${added}</div><div class="label">Added</div></div>
            <div class="stat-box"><div class="value" style="color:var(--danger)">${removed}</div><div class="label">Removed</div></div>
            <div class="stat-box"><div class="value">${unchanged}</div><div class="label">Unchanged</div></div>
        </div>
        <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;max-height:400px;overflow:auto">${html}</div>
    `;
};

// 19. CSS Minifier
window.render_css_minifier = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">CSS Code</label>
            <textarea id="cssIn" rows="10" placeholder="body {\n  margin: 0;\n  padding: 0;\n}"></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="minifyCSS()">Minify</button>
            <button class="btn btn-secondary" onclick="beautifyCSS()">Beautify</button>
        </div>
        <div class="output-area" id="cssOut"><button class="copy-btn" onclick="copyText(document.getElementById('cssOut').innerText, this)">Copy</button>Result here</div>
        <div id="cssSavings" style="margin-top:0.5rem;color:var(--text-muted);font-size:0.85rem"></div>
    `;
};
window.minifyCSS = function() {
    const css = document.getElementById('cssIn').value;
    const min = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
    document.getElementById('cssOut').textContent = min;
    const saved = ((1 - min.length / css.length) * 100).toFixed(1);
    document.getElementById('cssSavings').textContent = `📉 ${css.length} → ${min.length} bytes (${saved}% smaller)`;
};
window.beautifyCSS = function() {
    let css = document.getElementById('cssIn').value;
    css = css.replace(/\s*{\s*/g, ' {\n  ').replace(/\s*}\s*/g, '\n}\n\n').replace(/;\s*/g, ';\n  ').replace(/\n  \n}/g, '\n}');
    document.getElementById('cssOut').textContent = css.trim();
};

// 20. JavaScript Minifier
window.render_javascript_minifier = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">JavaScript Code</label>
            <textarea id="jsIn" rows="10" placeholder="function hello() {\n  console.log('world');\n}"></textarea>
        </div>
        <div class="btn-row"><button class="btn" onclick="minifyJS()">Minify</button></div>
        <div class="output-area" id="jsOut"><button class="copy-btn" onclick="copyText(document.getElementById('jsOut').innerText, this)">Copy</button>Result here</div>
        <div id="jsSavings" style="margin-top:0.5rem;color:var(--text-muted);font-size:0.85rem"></div>
    `;
};
window.minifyJS = function() {
    const js = document.getElementById('jsIn').value;
    const min = js.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n\s*\n/g, '\n').replace(/^\s+/gm, '').replace(/\s+$/gm, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    document.getElementById('jsOut').textContent = min;
    const saved = ((1 - min.length / js.length) * 100).toFixed(1);
    document.getElementById('jsSavings').textContent = `📉 ${js.length} → ${min.length} bytes (${saved}% smaller)`;
};

// 21. HTML Entity Encoder/Decoder
window.render_html_encoder = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input</label>
            <textarea id="htmlIn" rows="6" placeholder="<div class=&quot;hello&quot;>World & Friends</div>"></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="htmlEncode()">Encode</button>
            <button class="btn btn-secondary" onclick="htmlDecode()">Decode</button>
        </div>
        <div class="output-area" id="htmlOut"><button class="copy-btn" onclick="copyText(document.getElementById('htmlOut').innerText, this)">Copy</button>Result here</div>
    `;
};
window.htmlEncode = function() {
    const text = document.getElementById('htmlIn').value;
    const div = document.createElement('div');
    div.textContent = text;
    document.getElementById('htmlOut').textContent = div.innerHTML;
};
window.htmlDecode = function() {
    const text = document.getElementById('htmlIn').value;
    const div = document.createElement('div');
    div.innerHTML = text;
    document.getElementById('htmlOut').textContent = div.textContent;
};

// 22. Mortgage Calculator
window.render_mortgage_calculator = function(container) {
    container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div class="field"><label class="label">Home Price ($)</label><input type="number" id="mortPrice" value="350000"></div>
            <div class="field"><label class="label">Down Payment ($)</label><input type="number" id="mortDown" value="70000"></div>
            <div class="field"><label class="label">Interest Rate (%)</label><input type="number" id="mortRate" value="6.5" step="0.1"></div>
            <div class="field"><label class="label">Loan Term (years)</label><select id="mortTerm"><option value="30" selected>30 years</option><option value="20">20 years</option><option value="15">15 years</option><option value="10">10 years</option></select></div>
        </div>
        <div class="btn-row"><button class="btn" onclick="calcMortgage()">Calculate</button></div>
        <div class="stats-grid" id="mortOut">
            <div class="stat-box"><div class="value" id="mortMonthly">—</div><div class="label">Monthly Payment</div></div>
            <div class="stat-box"><div class="value" id="mortTotal">—</div><div class="label">Total Payment</div></div>
            <div class="stat-box"><div class="value" id="mortInterest">—</div><div class="label">Total Interest</div></div>
            <div class="stat-box"><div class="value" id="mortLoan">—</div><div class="label">Loan Amount</div></div>
        </div>
    `;
};
window.calcMortgage = function() {
    const price = parseFloat(document.getElementById('mortPrice').value);
    const down = parseFloat(document.getElementById('mortDown').value);
    const rate = parseFloat(document.getElementById('mortRate').value) / 100 / 12;
    const term = parseInt(document.getElementById('mortTerm').value) * 12;
    const loan = price - down;
    const monthly = loan * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    const total = monthly * term;
    const fmt = n => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
    document.getElementById('mortMonthly').textContent = fmt(monthly);
    document.getElementById('mortTotal').textContent = fmt(total);
    document.getElementById('mortInterest').textContent = fmt(total - loan);
    document.getElementById('mortLoan').textContent = fmt(loan);
};

// 23. BMI Calculator
window.render_bmi_calculator = function(container) {
    container.innerHTML = `
        <div class="check-row" style="margin-bottom:1rem">
            <label><input type="radio" name="bmiUnit" value="imperial" checked onclick="toggleBMIUnits()"> Imperial (lbs/ft)</label>
            <label><input type="radio" name="bmiUnit" value="metric" onclick="toggleBMIUnits()"> Metric (kg/cm)</label>
        </div>
        <div id="bmiImperial">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem">
                <div class="field"><label class="label">Weight (lbs)</label><input type="number" id="bmiLbs" value="170"></div>
                <div class="field"><label class="label">Height (ft)</label><input type="number" id="bmiFt" value="5"></div>
                <div class="field"><label class="label">Height (in)</label><input type="number" id="bmiIn" value="10"></div>
            </div>
        </div>
        <div id="bmiMetric" style="display:none">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
                <div class="field"><label class="label">Weight (kg)</label><input type="number" id="bmiKg" value="77"></div>
                <div class="field"><label class="label">Height (cm)</label><input type="number" id="bmiCm" value="178"></div>
            </div>
        </div>
        <div class="btn-row"><button class="btn" onclick="calcBMI()">Calculate BMI</button></div>
        <div class="stats-grid" id="bmiOut">
            <div class="stat-box"><div class="value" id="bmiVal">—</div><div class="label">Your BMI</div></div>
            <div class="stat-box"><div class="value" id="bmiCat" style="font-size:1rem">—</div><div class="label">Category</div></div>
        </div>
    `;
};
window.toggleBMIUnits = function() {
    const imperial = document.querySelector('input[name="bmiUnit"]:checked').value === 'imperial';
    document.getElementById('bmiImperial').style.display = imperial ? '' : 'none';
    document.getElementById('bmiMetric').style.display = imperial ? 'none' : '';
};
window.calcBMI = function() {
    const imperial = document.querySelector('input[name="bmiUnit"]:checked').value === 'imperial';
    let bmi;
    if (imperial) {
        const lbs = parseFloat(document.getElementById('bmiLbs').value);
        const inches = parseFloat(document.getElementById('bmiFt').value) * 12 + parseFloat(document.getElementById('bmiIn').value);
        bmi = (lbs / (inches * inches)) * 703;
    } else {
        const kg = parseFloat(document.getElementById('bmiKg').value);
        const m = parseFloat(document.getElementById('bmiCm').value) / 100;
        bmi = kg / (m * m);
    }
    document.getElementById('bmiVal').textContent = bmi.toFixed(1);
    let cat;
    if (bmi < 18.5) cat = 'Underweight';
    else if (bmi < 25) cat = '✅ Normal';
    else if (bmi < 30) cat = '⚠️ Overweight';
    else cat = '🔴 Obese';
    document.getElementById('bmiCat').textContent = cat;
};

// 24. Number Base Converter
window.render_number_base_converter = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">Input Number</label><input type="text" id="baseIn" value="255" placeholder="Enter a number..."></div>
        <div class="field"><label class="label">Input Base</label>
            <select id="baseFrom"><option value="10" selected>Decimal (10)</option><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="16">Hexadecimal (16)</option></select>
        </div>
        <div class="btn-row"><button class="btn" onclick="convertBase()">Convert</button></div>
        <div class="stats-grid">
            <div class="stat-box"><div class="value" id="baseBin" style="font-size:1rem;word-break:break-all">—</div><div class="label">Binary (2)</div></div>
            <div class="stat-box"><div class="value" id="baseOct" style="font-size:1rem">—</div><div class="label">Octal (8)</div></div>
            <div class="stat-box"><div class="value" id="baseDec" style="font-size:1rem">—</div><div class="label">Decimal (10)</div></div>
            <div class="stat-box"><div class="value" id="baseHex" style="font-size:1rem">—</div><div class="label">Hex (16)</div></div>
        </div>
    `;
};
window.convertBase = function() {
    const input = document.getElementById('baseIn').value.trim();
    const base = parseInt(document.getElementById('baseFrom').value);
    const num = parseInt(input, base);
    if (isNaN(num)) { document.getElementById('baseDec').textContent = '❌ Invalid'; return; }
    document.getElementById('baseBin').textContent = num.toString(2);
    document.getElementById('baseOct').textContent = num.toString(8);
    document.getElementById('baseDec').textContent = num.toString(10);
    document.getElementById('baseHex').textContent = num.toString(16).toUpperCase();
};

// 25. JSON to CSV
window.render_json_to_csv = function(container) {
    container.innerHTML = `
        <div class="field"><label class="label">JSON Array</label>
            <textarea id="j2cIn" rows="8" placeholder='[{"name":"Alice","age":30},{"name":"Bob","age":25}]'></textarea>
        </div>
        <div class="btn-row">
            <button class="btn" onclick="jsonToCsv()">Convert to CSV</button>
            <button class="btn btn-secondary" onclick="downloadCsv()">Download CSV</button>
        </div>
        <div class="output-area" id="j2cOut"><button class="copy-btn" onclick="copyText(document.getElementById('j2cOut').innerText, this)">Copy</button>CSV output here</div>
    `;
};
window.jsonToCsv = function() {
    try {
        const data = JSON.parse(document.getElementById('j2cIn').value);
        if (!Array.isArray(data) || data.length === 0) { document.getElementById('j2cOut').textContent = '❌ Input must be a non-empty JSON array'; return; }
        const headers = Object.keys(data[0]);
        let csv = headers.join(',') + '\n';
        data.forEach(row => {
            csv += headers.map(h => {
                let val = row[h] !== undefined ? String(row[h]) : '';
                if (val.includes(',') || val.includes('"') || val.includes('\n')) val = '"' + val.replace(/"/g, '""') + '"';
                return val;
            }).join(',') + '\n';
        });
        document.getElementById('j2cOut').textContent = csv;
    } catch (e) { document.getElementById('j2cOut').textContent = '❌ Invalid JSON: ' + e.message; }
};
window.downloadCsv = function() {
    const csv = document.getElementById('j2cOut').innerText;
    if (!csv || csv.startsWith('❌')) return;
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.csv';
    a.click();
};

// ── Init ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
