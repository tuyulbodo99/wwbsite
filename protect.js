// Warceh Subang Pharmacy - Website Protection
// Copyright (c) 2025 Warceh Subang. All rights reserved.
// Unauthorized copying, inspection, or duplication is prohibited.

(function () {
    'use strict';

    var OWNER = 'Warceh Subang Pharmacy';
    var SITE  = 'warcehsubang.xyz';

    // ─── 1. Nonaktifkan klik kanan ───────────────────────────────────────────
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showWarning();
        return false;
    });

    // ─── 2. Nonaktifkan keyboard shortcut inspect & view-source ─────────────
    document.addEventListener('keydown', function (e) {
        var key = e.key || e.keyCode;
        var ctrl = e.ctrlKey || e.metaKey;
        var shift = e.shiftKey;

        // F12
        if (key === 'F12' || e.keyCode === 123) {
            e.preventDefault(); showWarning(); return false;
        }
        // Ctrl+Shift+I (Inspect)
        if (ctrl && shift && (key === 'I' || key === 'i' || e.keyCode === 73)) {
            e.preventDefault(); showWarning(); return false;
        }
        // Ctrl+Shift+J (Console)
        if (ctrl && shift && (key === 'J' || key === 'j' || e.keyCode === 74)) {
            e.preventDefault(); showWarning(); return false;
        }
        // Ctrl+Shift+C (Element picker)
        if (ctrl && shift && (key === 'C' || key === 'c' || e.keyCode === 67)) {
            e.preventDefault(); showWarning(); return false;
        }
        // Ctrl+U (View source)
        if (ctrl && (key === 'U' || key === 'u' || e.keyCode === 85)) {
            e.preventDefault(); showWarning(); return false;
        }
        // Ctrl+S (Save page)
        if (ctrl && (key === 'S' || key === 's' || e.keyCode === 83)) {
            e.preventDefault(); return false;
        }
        // Ctrl+A (Select all) - hanya di area teks biasa
        if (ctrl && (key === 'A' || key === 'a' || e.keyCode === 65)) {
            var tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
                e.preventDefault(); return false;
            }
        }
        // Ctrl+P (Print)
        if (ctrl && (key === 'P' || key === 'p' || e.keyCode === 80)) {
            e.preventDefault(); return false;
        }
    });

    // ─── 3. Nonaktifkan drag & drop gambar ──────────────────────────────────
    document.addEventListener('dragstart', function (e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    // ─── 4. Nonaktifkan seleksi teks (kecuali input/textarea) ───────────────
    document.addEventListener('selectstart', function (e) {
        var tag = e.target ? e.target.tagName : '';
        if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });

    // ─── 5. CSS anti-select & anti-copy ─────────────────────────────────────
    var style = document.createElement('style');
    style.textContent = [
        'body, img, p, h1, h2, h3, h4, h5, h6, span, div, a, li, td, th {',
        '  -webkit-user-select: none !important;',
        '  -moz-user-select: none !important;',
        '  -ms-user-select: none !important;',
        '  user-select: none !important;',
        '}',
        'input, textarea, [contenteditable] {',
        '  -webkit-user-select: text !important;',
        '  user-select: text !important;',
        '}',
        'img {',
        '  -webkit-user-drag: none !important;',
        '  pointer-events: none !important;',
        '}',
        '@media print { body { display: none !important; } }'
    ].join('\n');
    document.head.appendChild(style);

    // ─── 6. Deteksi DevTools terbuka (teknik resize + debugger timing) ───────
    var devToolsOpen = false;
    var threshold = 160;

    function checkDevTools() {
        var widthDiff  = window.outerWidth  - window.innerWidth;
        var heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > threshold || heightDiff > threshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                onDevToolsOpen();
            }
        } else {
            devToolsOpen = false;
        }
    }

    // Teknik debugger timing
    var devToolsTimer = setInterval(function () {
        var start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        var end = performance.now();
        if (end - start > 100) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                onDevToolsOpen();
            }
        }
    }, 1000);

    window.addEventListener('resize', checkDevTools);
    setInterval(checkDevTools, 1500);

    function onDevToolsOpen() {
        document.body.innerHTML = [
            '<div style="position:fixed;top:0;left:0;width:100%;height:100%;',
            'background:#0d6efd;color:#fff;display:flex;flex-direction:column;',
            'align-items:center;justify-content:center;z-index:999999;',
            'font-family:Poppins,sans-serif;text-align:center;padding:2rem">',
            '<div style="font-size:4rem;margin-bottom:1rem">🔒</div>',
            '<h1 style="font-size:2rem;margin-bottom:.5rem">Akses Ditolak</h1>',
            '<p style="font-size:1rem;opacity:.85;max-width:400px;margin-bottom:1.5rem">',
            'Website <strong>' + SITE + '</strong> dilindungi hak cipta.<br>',
            'Inspeksi, duplikasi, atau penyalinan konten dilarang keras.</p>',
            '<p style="font-size:.85rem;opacity:.6">&copy; 2025 ' + OWNER + '</p>',
            '<button onclick="window.location.reload()" ',
            'style="margin-top:1.5rem;padding:.6rem 1.8rem;border:2px solid #fff;',
            'background:transparent;color:#fff;border-radius:50px;font-size:.9rem;',
            'cursor:pointer;font-family:Poppins,sans-serif">',
            'Tutup DevTools & Muat Ulang</button>',
            '</div>'
        ].join('');
        clearInterval(devToolsTimer);
    }

    // ─── 7. Pesan peringatan di console ─────────────────────────────────────
    var msg1 = '%c🔒 PERINGATAN - ' + OWNER;
    var msg2 = '%cWebsite ini dilindungi hak cipta.\nInspeksi atau duplikasi konten dilarang.\n\n© 2025 ' + SITE;
    var s1 = 'color:#0d6efd;font-size:18px;font-weight:bold;font-family:Poppins,sans-serif';
    var s2 = 'color:#dc3545;font-size:13px;font-family:Poppins,sans-serif';
    setTimeout(function () {
        console.clear();
        console.log(msg1, s1);
        console.log(msg2, s2);
    }, 500);

    // ─── 8. Tampilan peringatan klik kanan ──────────────────────────────────
    function showWarning() {
        var existing = document.getElementById('_warceh_warn');
        if (existing) return;
        var el = document.createElement('div');
        el.id = '_warceh_warn';
        el.innerHTML = [
            '<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
            'background:#fff;border-radius:16px;padding:2rem 2.5rem;z-index:999999;',
            'box-shadow:0 20px 60px rgba(0,0,0,.25);text-align:center;',
            'font-family:Poppins,sans-serif;max-width:320px;width:90%">',
            '<div style="font-size:2.5rem;margin-bottom:.75rem">🔒</div>',
            '<h3 style="color:#0d6efd;margin-bottom:.5rem;font-size:1.1rem">Konten Dilindungi</h3>',
            '<p style="color:#555;font-size:.85rem;margin-bottom:1.25rem">',
            'Hak cipta &copy; 2025 ' + OWNER + '.<br>Tindakan ini tidak diizinkan.</p>',
            '<button id="_warceh_close" style="background:#0d6efd;color:#fff;border:none;',
            'padding:.5rem 1.5rem;border-radius:50px;cursor:pointer;font-size:.875rem;',
            'font-family:Poppins,sans-serif;font-weight:600">Tutup</button>',
            '</div>',
            '<div style="position:fixed;top:0;left:0;width:100%;height:100%;',
            'background:rgba(0,0,0,.5);z-index:999998" id="_warceh_overlay"></div>'
        ].join('');
        document.body.appendChild(el);
        document.getElementById('_warceh_close').addEventListener('click', removeWarning);
        document.getElementById('_warceh_overlay').addEventListener('click', removeWarning);
        setTimeout(removeWarning, 3000);
    }

    function removeWarning() {
        var el = document.getElementById('_warceh_warn');
        if (el) el.parentNode.removeChild(el);
    }

})();
