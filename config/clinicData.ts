import type { ClinicInfo, DoctorProfile, ServiceItem, Testimonial } from "../types/clinic";

export const CLINIC_INFO: ClinicInfo = {
  name: "Pelita Clinic",
  type: "Family Medicine / General Practice Clinic",
  established: "2024",
  address: "Ground Floor, Lot 600, Block 7, Pelita Commercial Centre, 98000 Miri, Sarawak, Malaysia",
  area: "Downtown Miri - Pelita Commercial Centre",
  mapsLink: "https://maps.app.goo.gl/WmNHbG3qf2wj36Es9",
  hours: ["Mon - Thurs: 8:00am - 12:00pm, 1:30pm - 4:00pm, 6:30pm - 8:00pm", "Fri - Sat: 8:00am - 12:00pm, 1:30pm - 4:00pm"],
  days: "Mon - Sat",
  holidays: "Sunday/Selected Public Holiday : Closed",
  phone: "011-6745 0600",
  email: "pelitaclinicmiri@gmail.com",
  brandColors: { primary: "#c084fc", secondary: "#ffffff" },
  amenities: [
    "Disabled friendly",
    "Wheelchair accessible",
    "Waiting area / lounge",
    "WiFi",
    "Restaurant / cafeteria nearby",
    "Street parking nearby (confirm)",
    "Shopping mall nearby",
    "Bus Stop" , 
    "Hotel Nearby",
  ],
  paymentMethods: [
    "Cash",
    "Cheque",
    "Credit Card (Visa/Mastercard)",
    "Debit Card",
    "Boost",
    "GrabPay",
    "Touch n Go eWallet",
    "FavePay",
    "DuitNow",
    "Maybank QRPay",
    "MyDebit",
    "MCash",
    "UnionPay",
    "Internet Banking",
    "Sarawak Pay",
  ],
  appointmentPolicy: "Appointment recommended before visiting.",
};

export const DOCTOR_PROFILE: DoctorProfile = {
  name: "Dr. Jody Yii Sze Lin",
  designation: "General Practitioner (Resident)",
  qualifications: [
    "Doctor of Medicine (M.D.) - Universiti Malaysia Sarawak (UNIMAS)",
    "Fellowship - Royal Australian College of General Practitioners (RACGP), Australia",
  ],
  experience: "12+ years",
  languages: "English, Bahasa Melayu, Mandarin",
  doctorPhotoSrc: "/dr_image.jpg",
};

export const SERVICES: ServiceItem[] = [
  {
    category: "General & Common Illness",
    iconName: "stethoscope",
    items: ["GP Consultation", "Fever, Flu, Sore Throat, Cough", "Diarrhea, Vomiting", "Ear, Nose & Eye Treatment", "Infectious Diseases", "Urinary Tract Infection","Gastric", "Musculoskeletal pain", "Chest Pain"],
  },
  { category: "Screening & Health Checks", iconName: "activity", items: ["Pre-Employment Check Up", "Health Screening", "Sexually Transmitted Disease Screening", "Medical Check Up", "Vocational Driving License", "Food Handler Medical Screening"] },
  {
    category: "Other Services",
    iconName: "bug",
    items: ["Complete Blood Count (CBC/FBC)", "Blood Glucose Test","Electrocardiogram (ECG)", "Urine Testing", "Urea Breath Test", "Ultrasound Scan", "4 in 1 Swab (Covid-19,Influenza A+B,RSV)" ,"Dengue Combo Test", "HIV Rapid Test", "Modified Oral Glucose Tolerance Test (MOGTT)", "Nebulizer", "Referral"],
  },
  { category: "Vaccinations/Immunisations", iconName: "syringe", items: ["Hepatitis B Vaccine", "Hepatitis A Vaccine", "Influenza Vaccine", "Typhoid Vaccine", "Hepatitis A & B", "Human Papillomavirus (HPV)", "Shingles", "Dengue", "Tetanus"] },
  {
    category: "Women's Health",
    iconName: "baby",
    items: ["Pregnancy Test & Ultrasound Scan", "Pap Smear / Cervical Screening", "Gynaecological Ultrasound", "Menstruation Treatments", "Birth Control/Contraception", "Breast Examination"],
  },
  {
    category: "Children's Health",
    iconName: "baby",
    items: ["Acute Illness", "Immunsation/vaccination"],
  },
  {
    category: "Chronic Illness Management",
    iconName: "heartPulse",
    items: ["Diabetes", "Hypertension", "High Cholesterol", "Asthma Treatment", "Osteoarthritis Treatment", "Weight Management"],
  },
  {
    category: "Skin & Infections",
    iconName: "shieldAlert",
    items: ["Acne Treatment", "Eczema", "Fungal & Skin Infection", "Scabies Treatment"],
  },
  {
    category: "Minor Surgery & Procedure",
    iconName: "scissors",
    items: [
      "Toilet & Suturing",
      "Ear/Eye Irrigation",
      "Wound Dressing",
      "NG Tube Insertion",
      "Catheterisation",
    ],
  },
  { category: "Sexual Health", iconName: "heartPulse", items: ["STD/STI Treatment", "HIV Preventive Treatment/PrEP", "Gonorrhea,  Chlamydia Screening & Treatment"] },
];

export const PANELS = [
  "AIA",
  "EMAS (Eximius)",
  "PERKESO",
  "Health Connect / MediExpress",
  "PeKa B40",
  "PMCare",
  "Senior Citizen Health Benefit (SCHB)",
  "Kenyalang Gold Card",
  "WeCare",
  "Medkad",
  "Great Eastern",
  "Public Bank",
  "Grand Palace Hotel Miri",
  "SAFHIS",
];

export const TESTIMONIALS: Testimonial[] = [
  { name: "J", date: "April 2025", platform: "Google", rating: 5, text: "I came here for tetanus injection shot. Dr Jodie & the staffs were professional and friendly. Best thing is the clinic opens at night. Good and reasonably priced! Highly recommend!" },
  { name: "Sofie T ST", date: "June 2025", platform: "Facebook", rating: 5, text: "First time here. Brought my mom for constant bodyache (arthritis in the elderly). Dr. Jody is very helpful and friendly. She listened keenly and gave sound advice. Used my mom's Kenyalang Gold and did not need to pay from our own pocket." },
  {
    name: "blckyy chu",
    date: "a week ago",
    platform: "Google",
    rating: 5,
    text: "Did an ultrasound here and the doctor was amazing. Even when my placenta is anterior and the baby kept hiding her face, the doctor was still patient and kept trying to get the perfect picture. Overall a very good clinic for those who are looking forward to do a 3D/4D ultrasound. All the employees are kind and friendly.",
  },
  {
    name: "meesan hii",
    date: "a month ago",
    platform: "Google",
    rating: 5,
    text: "Nice doctor. Clear and detailed explanation.",
  },
  {
    name: "Daniel Kueh",
    date: "5 months ago",
    platform: "Google",
    rating: 5,
    text: "Great services, great doctor.",
  },
  { name: "Jessy Bungan", date: "July 2025", platform: "Google", rating: 5, text: "I had a wonderful experience at Pelita Clinic. The staff and doctor were friendly, professional, and attentive. I felt well cared for and confident in the treatment I received." },
  { name: "xiu ting", date: "July 2025", platform: "Google", rating: 5, text: "Brought my parents here. The doctor is friendly and attentive, and the staff are kind. My parents were able to use iSarawakCare here. Overall excellent experience." },
  { name: "Lu C", date: "July 2025", platform: "Google", rating: 5, text: "Professional and friendly doctor and staff. Comfortable and clean clinic. The prices are reasonable too." },
];

export const HERO_BADGES = ["Daily: Mon-Sun", "Night Session Available", "Panel Clinic"];
