# Maison Aroma — Demo katalog parfum

Template statis untuk demo bisnis jasa pembuatan website katalog parfum.

## Fitur
- Responsive desktop dan mobile
- Katalog contoh, kategori, pencarian, urut harga
- Detail produk
- Keranjang belanja tersimpan di browser
- Pesanan dirangkum ke WhatsApp
- Halaman demo admin: tambah/edit/hapus produk dan atur nomor WhatsApp
- Tanpa build step atau dependensi JavaScript tambahan

## Menjalankan di komputer
1. Ekstrak ZIP.
2. Buka `index.html` di browser.
3. Buka `admin.html` untuk mengubah produk contoh.
4. Simpan nomor WhatsApp dengan kode negara, misalnya `62812xxxxxxxx`.
5. Kembali ke katalog dan uji tambah produk, keranjang, serta pesanan WhatsApp.

Disarankan menjalankan melalui server lokal sederhana agar perilaku browser konsisten:
- VS Code + ekstensi Live Server, atau
- Python: `python -m http.server 8000`, lalu buka `http://localhost:8000`.

## Peringatan penting
**Admin ini hanya demonstrasi.** Produk dan nomor WhatsApp disimpan di `localStorage` pada browser/perangkat yang sedang dipakai. Tidak ada login, otorisasi server, database bersama, sinkronisasi lintas perangkat, validasi stok server, atau pemrosesan pembayaran. Jangan deploy halaman admin ini sebagai sistem produksi yang dianggap aman.

Harga, nama produk, deskripsi aroma, dan foto botol adalah data contoh. Sebelum demo ke calon klien, tampilkan dengan jelas bahwa ini adalah konsep; jangan memberi kesan bahwa toko tersebut sudah menyetujui kerja sama. Untuk website klien, gunakan identitas, foto, harga, klaim aroma, dan informasi produk yang telah diverifikasi dan diizinkan pemiliknya.

## Publikasi demo statis
### Opsi A — GitHub Pages
1. Buat repositori baru di GitHub, misalnya `maison-aroma-demo`.
2. Unggah semua file dari folder ini (`index.html`, `styles.css`, `app.js`, `admin.html`, `admin.css`, `admin.js`, `README.md`) ke root repositori.
3. Buka Settings → Pages.
4. Pada Build and deployment, pilih Deploy from a branch.
5. Pilih branch `main`, folder `/ (root)`, lalu Save.
6. Tunggu deployment selesai; URL demo muncul di bagian Pages.

### Opsi B — Cloudflare Pages
1. Simpan file dalam repositori GitHub.
2. Di Cloudflare Dashboard, buka Workers & Pages dan buat Pages project yang terhubung ke repositori.
3. Untuk template statis ini, tidak diperlukan build command; output directory adalah root folder (`/` atau kosong sesuai instruksi UI).
4. Deploy dan uji URL yang diberikan.
5. Pastikan paket dan ketentuan yang dipilih mengizinkan penggunaan komersial yang Anda rencanakan.

## Sebelum dipakai untuk klien sungguhan
- Ganti nama, logo, konten, kontak, harga, foto, deskripsi, kebijakan pengiriman/retur, dan metadata.
- Minta persetujuan pemilik untuk memakai merek, foto, serta data toko.
- Tentukan siapa yang memiliki akun hosting/domain dan siapa yang membayar biaya tahunannya.
- Jika memakai dashboard admin online, migrasikan produk ke backend seperti Supabase dan aktifkan autentikasi serta Row Level Security (RLS). Jangan menyimpan password atau secret key di JavaScript frontend.
- Jika checkout berbayar dibutuhkan, gunakan payment gateway resmi dan validasi status transaksi di server/webhook. Demo ini tidak memproses pembayaran.
- Uji aksesibilitas, performa, tautan, tampilan mobile, dan alur pesanan sebelum peluncuran.
