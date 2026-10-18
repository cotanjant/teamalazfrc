import type { Config, DriveStep } from "driver.js";

export const TOUR_STORAGE_KEY = "alaz_admin_tour_completed";

export const TOUR_STEPS: DriveStep[] = [
  {
    popover: {
      title: "Hos Geldiniz: ALAZ #12368 Yonetim Paneli",
      description:
        "Team ALAZ web sitesinin tum dinamik verilerini, iceriklerini, teknik robot verilerini ve kurumsal kimlik ayarlarini bu panel uzerinden yonetebilirsiniz. Degisiklikleriniz siz onaylayip 'Degisiklikleri Kaydet' butonuna basana kadar guvenle yerel hafizada tutulur.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#admin-sidebar",
    popover: {
      title: "Sol Menu ve 7 Ana Bolum Navigasyonu",
      description:
        "Sitenin 7 temel bilesenine (Genel & Istatistikler, Takim & Departmanlar, Misyon & Vizyon, Robotik Sistemler, Sosyal Sorumluluk, Destekciler & Sponsorlar, Iletisim & Sosyal Medya) buradan tek tikla ulasabilirsiniz.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#admin-active-section",
    popover: {
      title: "Calisma Alani ve Veri Formlari",
      description:
        "Secili bolumun metin, baglanti ve durum alanlarini buradan duzenleyebilirsiniz. Basliklar, mottolar, sayfa aciklamalari ve teknik degerler dogrudan canli site ile senkronizedir.",
      side: "top",
      align: "start",
    },
  },
  {
    element: "#admin-data-table",
    popover: {
      title: "Tablo Yonetimi, Duzenleme ve Siralama",
      description:
        "Menu baglantilari, departmanlar, robot teknik ozellikleri ve sponsorlar gibi dinamik listeleri tablolardan yonetin. Satir ici kalem butonuyla aninda duzenleyebilir, yukari ve asagi oklarla site ici siralamayi degistirebilir, cop kutusu butonuyla guvenli silme yapabilirsiniz.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#admin-dirty-badge",
    popover: {
      title: "Degisiklik Takibi ve Geri Alma",
      description:
        "Yapilan tum duzenlemeler anlik olarak izlenir ve degisen alan sayisi bu rozette gosterilir. Ihtiyac halinde tek tikla onceki haline geri alabilirsiniz.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#admin-save-button",
    popover: {
      title: "Degisiklikleri Yayinlama ve Kaydetme",
      description:
        "Tum guncellemelerinizi tamamladiginizda bu butona basarak verileri GitHub Proxy API araciligiyla depoya kaydedebilirsiniz. Basarili kayit sonrasi site otomatik olarak guncellenir.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#admin-tour-restart-button",
    popover: {
      title: "Interaktif Rehber ve Kilavuz",
      description:
        "Panelin kullanimina dair bu interaktif turu dilediginiz an bu butona tiklayarak bastan baslatabilirsiniz. Klavyenizden ESC tusuna basarak istediginiz zaman rehberden cikabilirsiniz.",
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
  nextBtnText: "Ileri",
  prevBtnText: "Geri",
  doneBtnText: "Tamamla",
  closeBtnLabel: "Rehberi Kapat",
  showProgress: true,
  progressText: "{{current}} / {{total}}",
};
