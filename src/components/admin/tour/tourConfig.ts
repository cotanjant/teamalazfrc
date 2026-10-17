import type { Config, DriveStep } from "driver.js";

export const TOUR_STORAGE_KEY = "alaz_admin_tour_completed";

export const TOUR_STEPS: DriveStep[] = [
  {
    popover: {
      title: "Hoş Geldiniz: ALAZ #12368 Yönetim Paneli",
      description:
        "Team ALAZ web sitesinin tüm dinamik verilerini, içeriklerini, teknik robot verilerini ve kurumsal kimlik ayarlarını bu panel üzerinden yönetebilirsiniz. Değişiklikleriniz siz onaylayıp 'Değişiklikleri Kaydet' butonuna basana kadar güvenle yerel hafızada tutulur.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#admin-sidebar",
    popover: {
      title: "Sol Menü ve 7 Ana Bölüm Navigasyonu",
      description:
        "Sitenin 7 temel bileşenine (Genel & İstatistikler, Takım & Departmanlar, Misyon & Vizyon, Robotik Sistemler, Sosyal Sorumluluk, Destekçiler & Sponsorlar, İletişim & Sosyal Medya) buradan tek tıkla ulaşabilirsiniz.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#admin-active-section",
    popover: {
      title: "Çalışma Alanı ve Veri Formları",
      description:
        "Seçili bölümün metin, bağlantı ve durum alanlarını buradan düzenleyebilirsiniz. Başlıklar, mottolar, sayfa açıklamaları ve teknik değerler doğrudan canlı site ile senkronizedir.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#admin-data-table",
    popover: {
      title: "Tablo Yönetimi, Düzenleme ve Sıralama",
      description:
        "Menü bağlantıları, departmanlar, robot teknik özellikleri ve sponsorlar gibi dinamik listeleri tablolardan yönetin. Satır içi kalem butonuyla anında düzenleyebilir, yukarı ve aşağı oklarla site içi sıralamayı değiştirebilir, çöp kutusu butonuyla güvenli silme yapabilirsiniz.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#admin-dirty-badge",
    popover: {
      title: "Değişiklik Takibi ve Geri Alma",
      description:
        "Yapılan tüm düzenlemeler anlık olarak izlenir ve değişen alan sayısı bu rozette gösterilir. İhtiyaç halinde tek tıkla önceki haline geri alabilirsiniz.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#admin-save-button",
    popover: {
      title: "Değişiklikleri Yayınlama ve Kaydetme",
      description:
        "Tüm güncellemelerinizi tamamladığınızda bu butona basarak verileri GitHub Proxy API aracılığıyla depoya kaydedebilirsiniz. Başarılı kayıt sonrası site otomatik olarak güncellenir.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#admin-tour-restart-button",
    popover: {
      title: "İnteraktif Rehber ve Kılavuz",
      description:
        "Panelin kullanımına dair bu interaktif turu dilediğiniz an bu butona tıklayarak baştan başlatabilirsiniz. Klavyenizden ESC tuşuna basarak istediğiniz zaman rehberden çıkabilirsiniz.",
      side: "bottom",
      align: "end",
    },
  },
];

export const TOUR_CONFIG: Config = {
  animate: true,
  overlayColor: "#000000",
  overlayOpacity: 0.82,
  stagePadding: 6,
  stageRadius: 0,
  allowClose: true,
  allowKeyboardControl: true,
  skipMissingElement: true,
  popoverClass: "alaz-tour-popover",
  nextBtnText: "İleri",
  prevBtnText: "Geri",
  doneBtnText: "Tamamla",
  closeBtnLabel: "Rehberi Kapat",
  showProgress: true,
  progressText: "{{current}} / {{total}}",
};
