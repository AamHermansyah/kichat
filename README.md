# Kichat

Kichat adalah aplikasi chatting real-time yang memungkinkan pengguna untuk menyisipkan pesan rahasia pada setiap pesan yang dikirim. Kami menggunakan metode ZWC (Zero-Width Characters) atau karakter tak terlihat yang digabungkan dengan enkripsi modern AES untuk memastikan keamanan pesan rahasia tersebut.

## Fitur

- **Real-time Chatting**: Mengirim dan menerima pesan secara instan.
- **Pesan Rahasia**: Menyisipkan pesan rahasia dalam setiap pesan yang dikirim menggunakan ZWC.
- **Enkripsi AES**: Mengamankan pesan rahasia dengan enkripsi AES.
- **Antarmuka User-friendly**: Desain antarmuka yang mudah digunakan.

## Instalasi

Untuk menjalankan Kichat di mesin lokal Anda, ikuti langkah-langkah berikut:

1. Clone repositori ini:

    ```bash
    git clone https://github.com/AamHermansyah/kichat.git
    cd kichat
    ```

2. Instal dependensi:

    ```bash
    npm install
    ```

3. Jalankan aplikasi:

    ```bash
    npm run dev
    ```

Aplikasi akan berjalan di `http://localhost:3000`.

## Penggunaan

### Mengirim Pesan

1. Buka aplikasi Kichat.
2. Pilih kontak atau grup yang ingin Anda ajak ngobrol.
3. Ketik pesan Anda di kotak teks.
4. (Opsional) Untuk menyisipkan pesan rahasia, klik tombol `Pesan Rahasia` dan masukkan pesan rahasia Anda.
5. Klik tombol kirim untuk mengirim pesan.

### Membaca Pesan Rahasia

1. Terima pesan dari kontak Anda.
2. Jika pesan tersebut memiliki pesan rahasia, pesan akan otomatis terdeteksi dan ditampilkan di bagian khusus untuk pesan rahasia.
3. Untuk mengekstrak pesan rahasia, klik tombol `Ekstrak` dan masukkan kata sandi jika diminta.

## Teknologi yang Digunakan

- **Fullstack**: Next.js 14
- **Realtime**: Pusher
- **Database**: PostgreSQL
- **Enkripsi**: AES (Advanced Encryption Standard)
- **ZWC**: Zero-Width Characters untuk penyisipan pesan rahasia

## Kontribusi

Kami menyambut kontribusi dari siapa saja. Untuk berkontribusi, ikuti langkah-langkah berikut:

1. Fork repositori ini.
2. Buat branch fitur baru: `git checkout -b fitur-anda`.
3. Commit perubahan Anda: `git commit -m 'Menambahkan fitur baru'`.
4. Push ke branch: `git push origin fitur-anda`.
5. Buat Pull Request.

## Lisensi

Kichat dilisensikan di bawah [MIT License](LICENSE).

## Lomba Gemastik 2024

Aplikasi ini dibuat untuk berpartisipasi dalam lomba Gemastik 2024. Gemastik (Pagelaran Mahasiswa Nasional bidang Teknologi Informasi dan Komunikasi) adalah kompetisi bergengsi di Indonesia yang bertujuan untuk meningkatkan kualitas mahasiswa dalam pengembangan teknologi informasi dan komunikasi.

## Kontak

Untuk pertanyaan lebih lanjut atau bantuan, silakan hubungi kami di [227006009@student.unsil.ac.id].

---

Terima kasih telah menggunakan Kichat! Kami berharap aplikasi ini dapat membantu komunikasi Anda menjadi lebih aman dan menyenangkan.
