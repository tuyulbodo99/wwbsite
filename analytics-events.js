// Warceh Subang - Google Analytics Event Tracking
// Tracks: WhatsApp clicks, cart, payment, share, product views

(function () {
  if (typeof gtag !== 'function') return;

  function getPageName() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button, [data-track]');
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var text = (el.innerText || el.getAttribute('aria-label') || '').trim().substring(0, 50);
    var page = getPageName();

    // --- WhatsApp Konsultasi (navbar & sidebar) ---
    if (href.indexOf('wa.me') !== -1 && href.indexOf('konsultasi') !== -1) {
      gtag('event', 'whatsapp_konsultasi', {
        event_category: 'engagement',
        event_label: page,
        value: 1
      });
      return;
    }

    // --- WhatsApp Order Produk ---
    if (href.indexOf('wa.me') !== -1 && (href.indexOf('pesan') !== -1 || href.indexOf('order') !== -1 || href.indexOf('beli') !== -1 || href.indexOf('ingin%20membeli') !== -1 || href.indexOf('ingin%20memesan') !== -1)) {
      gtag('event', 'whatsapp_order', {
        event_category: 'ecommerce',
        event_label: text || page,
        value: 1
      });
      return;
    }

    // --- WhatsApp Umum (selain order & konsultasi) ---
    if (href.indexOf('wa.me') !== -1) {
      gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: text || page,
        value: 1
      });
      return;
    }

    // --- Tambah ke Keranjang ---
    if (el.classList.contains('btn-cart') || el.closest('.btn-cart') || (text && (text.toLowerCase().indexOf('keranjang') !== -1 || text.toLowerCase().indexOf('cart') !== -1 || text.toLowerCase().indexOf('tambah') !== -1))) {
      var productName = '';
      var card = el.closest('.product-card, .card');
      if (card) {
        var nameEl = card.querySelector('h5, h6, .product-name, .card-title');
        if (nameEl) productName = nameEl.innerText.trim().substring(0, 60);
      }
      gtag('event', 'add_to_cart', {
        event_category: 'ecommerce',
        event_label: productName || page,
        value: 1
      });
      return;
    }

    // --- Pembayaran DANA ---
    if (el.classList.contains('dana') || href.indexOf('dana') !== -1 || (text && text.toLowerCase().indexOf('dana') !== -1 && el.closest('.payment-btn, .modal'))) {
      gtag('event', 'payment_dana', {
        event_category: 'payment',
        event_label: page,
        value: 1
      });
      return;
    }

    // --- Pembayaran Saweria ---
    if (href.indexOf('saweria.co') !== -1 || el.classList.contains('saweria') || (text && text.toLowerCase().indexOf('saweria') !== -1)) {
      gtag('event', 'payment_saweria', {
        event_category: 'payment',
        event_label: page,
        value: 1
      });
      return;
    }

    // --- Share Artikel / Halaman ---
    if (el.classList.contains('share-btn') || el.closest('.share-btn') || (text && text.toLowerCase().indexOf('share') !== -1) || el.getAttribute('onclick') && el.getAttribute('onclick').indexOf('share') !== -1) {
      var platform = 'unknown';
      if (el.classList.contains('whatsapp') || (el.innerHTML && el.innerHTML.indexOf('whatsapp') !== -1)) platform = 'whatsapp';
      else if (el.classList.contains('facebook') || (el.innerHTML && el.innerHTML.indexOf('facebook') !== -1)) platform = 'facebook';
      else if (el.classList.contains('twitter') || (el.innerHTML && el.innerHTML.indexOf('twitter') !== -1)) platform = 'twitter';
      gtag('event', 'share', {
        event_category: 'engagement',
        event_label: platform + ' | ' + page,
        value: 1
      });
      return;
    }

    // --- Klik Produk (product card) ---
    var productCard = el.closest('.product-card');
    if (productCard && !el.classList.contains('btn-cart') && !el.classList.contains('btn-wishlist')) {
      var pName = '';
      var pEl = productCard.querySelector('h5, h6, .product-name, .card-title');
      if (pEl) pName = pEl.innerText.trim().substring(0, 60);
      gtag('event', 'product_click', {
        event_category: 'engagement',
        event_label: pName || page,
        value: 1
      });
    }
  });

  // --- Lacak scroll depth (25%, 50%, 75%, 100%) ---
  var scrollMarks = { 25: false, 50: false, 75: false, 100: false };
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    var pct = Math.round((scrollTop / docHeight) * 100);
    [25, 50, 75, 100].forEach(function (mark) {
      if (!scrollMarks[mark] && pct >= mark) {
        scrollMarks[mark] = true;
        gtag('event', 'scroll_depth', {
          event_category: 'engagement',
          event_label: mark + '% | ' + getPageName(),
          value: mark
        });
      }
    });
  }, { passive: true });

})();
