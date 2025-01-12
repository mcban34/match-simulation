# Match Simulation (Maç Simülasyonu)

Bu proje, futbol maçlarını simüle eden interaktif bir web uygulamasıdır. Kullanıcılar takımları seçebilir, maç simülasyonunu başlatabilir ve gerçek zamanlı olarak maç olaylarını takip edebilirler.

## 🚀 Özellikler

- Gerçek zamanlı maç simülasyonu
- Detaylı maç olayları
- Responsive tasarım
- Maç istatistikleri

## 🛠️ Teknolojiler

- React.js (vite)
- Node.js
- Express
- Axios
- Cherrio
- ApexChart
- Tailwind.css

## ⚙️ Kurulum

1. Projeyi klonlayın ve kurulumu yapın:
    ```bash
    git clone https://github.com/mcban34/match-simulation.git
    cd match-simulation
    npm install --prefix front-end
    npm install --prefix back-end
    ```

2. Uygulamayı başlatın:
    ```bash
    npm run dev --prefix front-end & nodemon back-end/src/server.js
    ```

## 📁 Proje Yapısı

```plaintext
match-simulation/
│
├── front-end/               # Front-end projesi
│   ├── public/              # Statik dosyalar
│   ├── src/                 # React bileşenleri
│   ├── package.json         # Front-end bağımlılıkları
│   └── vite.config.js       # Vite yapılandırması
│
├── back-end/                # Back-end projesi
│   ├── src/                 # Node.js ve Express dosyaları
│   │   └── server.js        # Back-end ana dosyası
│   ├── package.json         # Back-end bağımlılıkları
│   └── .env                 # Ortam değişkenleri (opsiyonel)
│
└── README.md                # Proje dokümantasyonu
```

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Yeni bir feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Bir Pull Request oluşturun