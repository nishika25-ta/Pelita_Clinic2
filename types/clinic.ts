export interface ClinicInfo {
  name: string;
  type: string;
  established: string;
  address: string;
  area: string;
  mapsLink: string;
  hours: string[];
  days: string;
  holidays: string;
  phone: string;
  email: string;
  brandColors: { primary: string; secondary: string };
  amenities: string[];
  paymentMethods: string[];
  appointmentPolicy: string;
}

export interface DoctorProfile {
  name: string;
  designation: string;
  qualifications: string[];
  experience: string;
  languages: string;
  /** Served from `public/` (e.g. `/doctor.mp4`). */
  introVideoSrc: string;
}

export interface ServiceItem {
  category: string;
  iconName: string;
  items: string[];
}

export interface Testimonial {
  name: string;
  date: string;
  platform: string;
  text: string;
  rating: 5;
}
