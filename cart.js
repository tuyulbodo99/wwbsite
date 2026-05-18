/* 
 * cart.js - Logika Keranjang Belanja Warceh Subang (Versi InfinityFree Optimized)
 * Tema: Tetap konsisten dengan index.html
 * Perbaikan: Kompatibel dengan InfinityFree, tanpa error JavaScript
 */

// Fungsi utilitas untuk format Rupiah (tanpa mengandalkan toLocaleString)
function formatRupiah(angka) {
    try {
        // Coba gunakan toLocaleString jika tersedia
        return angka.toLocaleString('id-ID');
    } catch (e) {
        // Fallback ke fungsi manual jika toLocaleString tidak didukung
        return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

// Fungsi utilitas untuk cek dukungan localStorage
function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Inisialisasi cart dengan fallback ke array kosong jika localStorage tidak tersedia
let cart = [];
const adminPhone = "6283195664588"; // Nomor WA Admin

// Coba muat dari localStorage jika tersedia
if (isLocalStorageAvailable()) {
    try {
        const savedCart = localStorage.getItem('warcehCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    } catch (e) {
        // Jika ada error parsing, reset cart
        cart = [];
        if (isLocalStorageAvailable()) {
            localStorage.removeItem('warcehCart');
        }
    }
}

// Fungsi untuk menyimpan cart dengan error handling
function saveCart() {
    if (!isLocalStorageAvailable()) return;
    
    try {
        localStorage.setItem('warcehCart', JSON.stringify(cart));
    } catch (e) {
        // Jika error saat menyimpan, coba hapus dan simpan ulang
        try {
            localStorage.removeItem('warcehCart');
            localStorage.setItem('warcehCart', JSON.stringify(cart));
        } catch (e2) {
            // Tetap lanjutkan tanpa localStorage
        }
    }
}

// Fungsi untuk mengupdate badge jumlah di navbar dengan error handling
function updateCartCount() {
    try {
        const badge = document.getElementById('cart-count');
        if (!badge) return;
        
        const total = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'block' : 'none';
    } catch (e) {
        // Tetap lanjutkan jika ada error
    }
}

// Fungsi untuk render modal keranjang dengan fallback gambar
function renderCartModal() {
    try {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        if (!container || !totalEl) return;

        container.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-basket fa-3x text-muted mb-3"></i>
                    <p class="text-muted mb-0">Keranjang Anda masih kosong.</p>
                    <a href="https://warcehsubang.xyz/produk.html" class="btn btn-sm btn-primary mt-3">Belanja Sekarang</a>
                </div>`;
            totalEl.textContent = 'Rp 0';
            return;
        }

        cart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            
            // Pastikan URL gambar valid dengan fallback
            let validImage = item.image;
            if (!validImage || validImage.includes("Dobel Y") || validImage.includes("https://i.ibb.co.com")) {
                // Fallback ke placeholder jika URL tidak valid
                validImage = "https://via.placeholder.com/50x50/eef2ff/0d6efd?text=Product";
            }
            
            container.innerHTML += `
                <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src="${validImage}" class="rounded me-3" style="width:50px;height:50px;object-fit:cover" 
                         alt="${item.name}" onerror="this.onerror=null;this.src='https://via.placeholder.com/50x50/eef2ff/0d6efd?text=Product';">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 fw-bold small">${item.name}</h6>
                        <small class="text-muted">Rp ${formatRupiah(item.price)} × ${item.qty}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
        });

        totalEl.textContent = 'Rp ' + formatRupiah(total);
    } catch (e) {
        // Tetap lanjutkan jika ada error
    }
}

// Fungsi: Tambah ke Keranjang dengan error handling
function addToCart(id, name, price, image) {
    try {
        // Pastikan harga valid
        const validPrice = isNaN(price) ? 0 : parseInt(price);
        
        // Pastikan URL gambar valid
        let validImage = image;
        if (!validImage || validImage.includes("Dobel Y") || validImage.includes("https://i.ibb.co.com")) {
            validImage = "https://via.placeholder.com/180x180/eef2ff/0d6efd?text=Product";
        }
        
        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id, name, price: validPrice, image: validImage, qty: 1 });
        }
        
        saveCart();
        updateCartCount();
        renderCartModal();
        
        // Feedback visual kecil
        if (event && event.currentTarget) {
            const btn = event.currentTarget;
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.classList.replace('btn-outline-primary', 'btn-success');
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.classList.replace('btn-success', 'btn-outline-primary');
            }, 1000);
        }
    } catch (e) {
        // Tampilkan pesan kesalahan ke pengguna jika debug mode aktif
        console.error("Error adding to cart:", e);
        alert("Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.");
    }
}

// Fungsi: Hapus Item dengan error handling
function removeFromCart(index) {
    try {
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            saveCart();
            updateCartCount();
            renderCartModal();
        }
    } catch (e) {
        console.error("Error removing from cart:", e);
    }
}

// Checkout ke WhatsApp dengan error handling
function checkoutWhatsApp() {
    try {
        if (cart.length === 0) {
            alert("Keranjang kosong!");
            return;
        }

        let msg = "Halo Warceh Subang, saya ingin memesan:%0A%0A";
        let total = 0;

        cart.forEach((item, i) => {
            const sub = item.price * item.qty;
            total += sub;
            msg += `${i+1}. ${item.name} (${item.qty}x) - Rp ${formatRupiah(sub)}%0A`;
        });

        msg += `%0A*Total: Rp ${formatRupiah(total)}*`;
        msg += "%0A%0AMohon info ongkir & pembayaran. Terima kasih!";

        window.open(`https://wa.me/${adminPhone}?text=${msg}`, '_blank');
    } catch (e) {
        console.error("Error during checkout:", e);
        alert("Terjadi kesalahan saat checkout. Silakan coba lagi atau hubungi kami langsung via WhatsApp.");
    }
}

// Inisialisasi keranjang dengan error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Pastikan DOM sepenuhnya dimuat sebelum memproses
        setTimeout(() => {
            updateCartCount();
            renderCartModal();
            
            // Tambahkan event listener untuk semua tombol addToCart
            document.querySelectorAll('[onclick^="addToCart"]').forEach(button => {
                button.addEventListener('click', function(e) {
                    try {
                        // Ekstrak parameter dari atribut onclick
                        const onclick = this.getAttribute('onclick');
                        const match = onclick.match(/addToCart\('(.*?)','(.*?)',(\d+),'(.*?)'\)/);
                        if (match) {
                            addToCart(match[1], match[2], parseInt(match[3]), match[4]);
                            e.preventDefault();
                        }
                    } catch (ex) {
                        console.error("Error processing addToCart:", ex);
                    }
                });
            });
        }, 50);
    } catch (e) {
        console.error("Error initializing cart:", e);
    }
});

// Fallback untuk browser tanpa JavaScript
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Tambahkan kelas untuk menandai JavaScript aktif
        document.documentElement.classList.add('js-enabled');
        
        // Tambahkan warning jika JavaScript dinonaktifkan
        const noscript = document.createElement('div');
        noscript.id = 'js-warning';
        noscript.style.display = 'none';
        noscript.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; background: #fff3cd; 
                         color: #856404; padding: 10px; text-align: center; z-index: 9999; 
                         border-bottom: 1px solid #ffeeba;">
                <i class="fas fa-exclamation-triangle"></i> Website ini memerlukan JavaScript untuk 
                fitur keranjang belanja. Beberapa gambar mungkin tidak muncul tanpa JavaScript.
            </div>
        `;
        document.body.appendChild(noscript);
        
        // Tampilkan warning setelah 2 detik jika JavaScript tidak memproses dengan benar
        setTimeout(() => {
            if (!document.getElementById('cart-count')) {
                noscript.style.display = 'block';
            }
        }, 2000);
    } catch (e) {
        // Tetap lanjutkan
    }
});