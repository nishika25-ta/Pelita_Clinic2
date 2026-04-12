import type { Locale } from "./types";

export type FaqItem = { q: string; a: string };
export type FaqCategory = { title: string; items: FaqItem[] };

const en: FaqCategory[] = [
  {
    title: "General Services",
    items: [
      {
        q: "What services does Pelita Clinic provide?",
        a: "We provide general medical consultations, acute illness treatment, chronic disease follow-up, and health screening including blood tests.",
      },
      {
        q: "Do I need an appointment?",
        a: "Walk-ins are welcome. However, appointments are recommended during peak hours to reduce waiting time.",
      },
      {
        q: "What are your operating hours?",
        a: "Please contact the clinic or check our latest hours via WhatsApp or social media, as timings may vary.",
      },
    ],
  },
  {
    title: "Blood Tests & Health Screening",
    items: [
      {
        q: "Do I need to fast before a blood test?",
        a: "Some tests (e.g. glucose, cholesterol) require 6–8 hours fasting. Our staff will advise you based on your selected test.",
      },
      {
        q: "How long does it take to get results?",
        a: "Most results are ready within 1–3 working days, depending on the test. Please check with staff for your selected tests, as availability may vary.",
      },
      {
        q: "Can I just do a blood test without seeing the doctor?",
        a: "Yes. We offer blood taking and result review only, without full consultation or medical certification. You can choose to see the doctor if you change your mind.",
      },
      {
        q: "Will the doctor explain my results?",
        a: "Yes, result review is provided. Full consultation is optional if you require detailed management.",
      },
      {
        q: "What tests are included in your health screening?",
        a: "Common packages include Full Blood Count (FBC), cholesterol, kidney, liver, and diabetes screening. Custom tests are available. See our latest health screening packages on our website or social media.",
      },
    ],
  },
  {
    title: "Payments & Insurance",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, card, QR code transfer, Sarawak Pay, and online transfer.",
      },
      {
        q: "Can I use insurance or company panel?",
        a: "Please check with our staff to confirm panel availability.",
      },
    ],
  },
  {
    title: "Common Patient Concerns",
    items: [
      {
        q: "What should I do if I have a high fever?",
        a: "If your fever is above 38.5°C, persistent, or associated with symptoms like diarrhoea, severe pain, or weakness, please seek medical attention.",
      },
      {
        q: "Can I come for minor issues like cough, flu, or stomach discomfort?",
        a: "Yes. We treat all common acute illnesses.",
      },
      {
        q: "Do you provide medical certificates (MC)?",
        a: "Yes, after doctor consultation if medically indicated.",
      },
    ],
  },
  {
    title: "Procedures & Safety",
    items: [
      {
        q: "Is blood taking painful?",
        a: "Our staff are trained to perform blood collection with minimal discomfort.",
      },
      {
        q: "Is your equipment safe and sterile?",
        a: "Yes. We follow strict medical hygiene and sterilisation protocols.",
      },
    ],
  },
  {
    title: "Contact & Location",
    items: [
      {
        q: "Where are you located?",
        a: "Pelita Clinic is located in Miri, Sarawak. Contact us for directions or use Google Maps.",
      },
      {
        q: "How can I contact the clinic?",
        a: "You can reach us via WhatsApp or phone for enquiries and bookings.",
      },
    ],
  },
];

const ms: FaqCategory[] = [
  {
    title: "Perkhidmatan Am",
    items: [
      {
        q: "Apakah perkhidmatan yang disediakan oleh Pelita Clinic?",
        a: "Kami menyediakan konsultasi perubatan am, rawatan penyakit akut, susulan penyakit kronik, serta saringan kesihatan termasuk ujian darah.",
      },
      {
        q: "Adakah saya perlu membuat temu janji?",
        a: "Walk-in dialu-alukan. Walau bagaimanapun, temu janji disyorkan pada waktu puncak untuk mengurangkan masa menunggu.",
      },
      {
        q: "Apakah waktu operasi klinik?",
        a: "Sila hubungi klinik atau semak waktu terkini melalui WhatsApp atau media sosial, kerana waktu operasi mungkin berubah.",
      },
    ],
  },
  {
    title: "Ujian Darah & Saringan Kesihatan",
    items: [
      {
        q: "Adakah saya perlu berpuasa sebelum ujian darah?",
        a: "Sesetengah ujian (contohnya glukosa, kolesterol) memerlukan puasa 6–8 jam. Kakitangan kami akan menasihatkan anda berdasarkan ujian yang dipilih.",
      },
      {
        q: "Berapa lama untuk mendapat keputusan?",
        a: "Kebanyakan keputusan siap dalam 1–3 hari bekerja, bergantung pada ujian. Sila semak dengan kakitangan untuk ujian yang dipilih kerana masa keputusan mungkin berbeza.",
      },
      {
        q: "Bolehkah saya hanya buat ujian darah tanpa jumpa doktor?",
        a: "Ya. Kami menawarkan pengambilan darah dan semakan keputusan sahaja, tanpa konsultasi penuh atau sijil perubatan. Anda boleh memilih untuk berjumpa doktor jika berubah fikiran.",
      },
      {
        q: "Adakah doktor akan terangkan keputusan saya?",
        a: "Ya, semakan keputusan disediakan. Konsultasi penuh adalah pilihan jika anda memerlukan pengurusan terperinci.",
      },
      {
        q: "Apakah ujian yang termasuk dalam saringan kesihatan?",
        a: "Pakej biasa termasuk Full Blood Count (FBC), kolesterol, buah pinggang, hati, dan saringan diabetes. Ujian khas juga tersedia. Lihat pakej saringan kesihatan terkini di laman web atau media sosial kami.",
      },
    ],
  },
  {
    title: "Bayaran & Insurans",
    items: [
      {
        q: "Apakah kaedah bayaran yang diterima?",
        a: "Kami menerima tunai, kad, pemindahan QR, Sarawak Pay, dan pemindahan dalam talian.",
      },
      {
        q: "Bolehkah saya guna insurans atau panel syarikat?",
        a: "Sila semak dengan kakitangan kami untuk mengesahkan ketersediaan panel.",
      },
    ],
  },
  {
    title: "Kebimbangan Pesakit Lazim",
    items: [
      {
        q: "Apa yang perlu saya lakukan jika demam tinggi?",
        a: "Jika demam melebihi 38.5°C, berpanjangan, atau disertai simptom seperti cirit-birit, sakit teruk, atau kelemahan, sila dapatkan rawatan perubatan.",
      },
      {
        q: "Bolehkah saya datang untuk masalah ringan seperti batuk, selesema, atau sakit perut?",
        a: "Ya. Kami merawat semua penyakit akut biasa.",
      },
      {
        q: "Adakah klinik mengeluarkan sijil cuti sakit (MC)?",
        a: "Ya, selepas konsultasi doktor jika secara perubatan wajar.",
      },
    ],
  },
  {
    title: "Prosedur & Keselamatan",
    items: [
      {
        q: "Adakah pengambilan darah menyakitkan?",
        a: "Kakitangan kami dilatih untuk melakukan pengambilan darah dengan ketidakselesaan yang minimum.",
      },
      {
        q: "Adakah peralatan selamat dan steril?",
        a: "Ya. Kami mengikut protokol kebersihan perubatan dan pensanitanan yang ketat.",
      },
    ],
  },
  {
    title: "Hubungi & Lokasi",
    items: [
      {
        q: "Di manakah lokasi klinik?",
        a: "Pelita Clinic terletak di Miri, Sarawak. Hubungi kami untuk arah atau gunakan Google Maps.",
      },
      {
        q: "Bagaimana saya boleh menghubungi klinik?",
        a: "Anda boleh menghubungi kami melalui WhatsApp atau telefon untuk pertanyaan dan tempahan.",
      },
    ],
  },
];

const zh: FaqCategory[] = [
  {
    title: "综合服务",
    items: [
      {
        q: "Pelita Clinic 提供哪些服务？",
        a: "我们提供全科医疗咨询、急性病治疗、慢性病随访，以及包含抽血在内的健康体检。",
      },
      {
        q: "需要预约吗？",
        a: "欢迎 walk-in。不过在高峰时段建议先预约，以减少等候时间。",
      },
      {
        q: "诊所的营业时间是什么？",
        a: "请致电诊所或通过 WhatsApp、社交媒体查询最新营业时间，实际时间可能有所调整。",
      },
    ],
  },
  {
    title: "抽血与健康筛查",
    items: [
      {
        q: "抽血前需要空腹吗？",
        a: "部分项目（如血糖、胆固醇）需空腹 6–8 小时。工作人员会根据您选择的项目给予说明。",
      },
      {
        q: "多久可以拿到报告？",
        a: "多数结果在 1–3 个工作日内可取，视检验项目而定。请向工作人员确认您所做项目的出报告时间。",
      },
      {
        q: "可以只抽血、不看医生吗？",
        a: "可以。我们提供抽血与结果解读，不含完整问诊或医疗证明。若您改变主意，也可以选择看诊。",
      },
      {
        q: "医生会解释检验结果吗？",
        a: "会，我们提供结果解读。若需要更详细的诊疗方案，完整问诊为可选项。",
      },
      {
        q: "健康体检包含哪些项目？",
        a: "常见套餐包括全血细胞计数（FBC）、胆固醇、肾功能、肝功能及糖尿病筛查等，亦可按需加项。最新套餐请查看网站或社交媒体。",
      },
    ],
  },
  {
    title: "付款与保险",
    items: [
      {
        q: "接受哪些付款方式？",
        a: "我们接受现金、银行卡、二维码转账、Sarawak Pay 及网上转账。",
      },
      {
        q: "可以使用保险或公司 panel 吗？",
        a: "请向工作人员确认 panel 是否可用。",
      },
    ],
  },
  {
    title: "常见就诊问题",
    items: [
      {
        q: "发高烧该怎么办？",
        a: "若体温超过 38.5°C、持续不退，或伴有腹泻、剧痛、明显乏力等症状，请及时就医。",
      },
      {
        q: "咳嗽、感冒、肠胃不适等小问题可以来看吗？",
        a: "可以。我们处理各类常见急性病症。",
      },
      {
        q: "是否提供病假单（MC）？",
        a: "提供。在医生看诊且医学上认为有需要时签发。",
      },
    ],
  },
  {
    title: "操作与安全",
    items: [
      {
        q: "抽血会很痛吗？",
        a: "工作人员经过培训，会尽量减轻不适。",
      },
      {
        q: "设备是否安全、无菌？",
        a: "是的。我们严格执行医疗消毒与无菌操作规范。",
      },
    ],
  },
  {
    title: "联系与地址",
    items: [
      {
        q: "诊所地址在哪里？",
        a: "Pelita Clinic 位于砂拉越美里。需要路线指引请联系我们，或使用 Google Maps。",
      },
      {
        q: "如何联系诊所？",
        a: "您可通过 WhatsApp 或电话进行咨询与预约。",
      },
    ],
  },
];

export const FAQ_BY_LOCALE: Record<Locale, FaqCategory[]> = {
  en,
  ms,
  zh,
};
