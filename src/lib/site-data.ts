export const tagline = 'Gram Panchayat Ovali serves the village of Ovali in Bhiwandi, Thane, Maharashtra. This site shares village information, public resources and updates as they become available.';
export const marathiTagline = 'ग्राम पंचायत ओवळीच्या डिजिटल व्यासपीठावर आपले स्वागत आहे. येथे गाव, ग्रामपंचायत सेवा, सूचना आणि नागरिकांसाठी उपयुक्त माहिती उपलब्ध करून देण्यात येते.';

export const TO_BE_UPDATED_EN = 'To be updated';
export const TO_BE_UPDATED_MR = 'माहिती लवकरच अद्ययावत केली जाईल';

export const contact = {
  phone: TO_BE_UPDATED_EN,
  phoneMarathi: TO_BE_UPDATED_MR,
  email: TO_BE_UPDATED_EN,
  emailMarathi: TO_BE_UPDATED_MR,
  address: 'Ovali, Bhiwandi, Thane, Maharashtra – 421302',
  addressMarathi: 'ओवळी, भिवंडी, ठाणे, महाराष्ट्र – 421302',
  hours: TO_BE_UPDATED_EN,
  hoursMarathi: TO_BE_UPDATED_MR,
  sarpanch: TO_BE_UPDATED_EN,
  sarpanchMarathi: TO_BE_UPDATED_MR,
  deputySarpanch: TO_BE_UPDATED_EN,
  deputySarpanchMarathi: TO_BE_UPDATED_MR,
  gramSevak: TO_BE_UPDATED_EN,
  gramSevakMarathi: TO_BE_UPDATED_MR,
};

export const navItems = [
  { to: '/', en: 'Home', mr: 'मुख्यपृष्ठ' },
  { to: '/about', en: 'About Us', mr: 'आमच्याबद्दल' },
  { to: '/gallery', en: 'Gallery', mr: 'फोटो गॅलरी' },
  { to: '/announcements', en: 'Announcements', mr: 'सूचना' },
  { to: '/documents', en: 'Documents', mr: 'कागदपत्रे' },
  { to: '/contact', en: 'Contact', mr: 'संपर्क' },
  { to: '/feedback', en: 'Feedback', mr: 'अभिप्राय' },
] as const;

export const portals = [
  { name: 'Maharashtra Rural Development and Panchayat Raj Department', short: 'Maharashtra Rural Development', url: 'https://rdd.maharashtra.gov.in/' },
  { name: 'eGramSwaraj', short: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
  { name: 'National Portal of India', short: 'National Portal of India', url: 'https://www.india.gov.in/' },
  { name: 'Thane District', short: 'Thane District', url: 'https://thane.nic.in/' },
];

export type Announcement = {
  id: string | number;
  date: string;
  category: 'General' | 'Gram Sabha' | 'Development' | 'Public Notice';
  title: string;
  titleMarathi?: string;
  english: string;
  description: string;
  descriptionMarathi?: string;
  isPinned?: boolean;
};

// No official notices provided yet; populated via Supabase or kept empty
export const announcements: Announcement[] = [];

export type GalleryItem = {
  id: string | number;
  title: string;
  mr: string;
  category: 'Village' | 'Panchayat' | 'Development' | 'Community';
  description?: string;
  image?: string;
};

// Official photos will be added when available or uploaded via Supabase
export const gallery: GalleryItem[] = [];

export type OfficialDocumentItem = {
  id: string | number;
  title: string;
  titleMarathi: string;
  category: 'Gram Sabha' | 'Budget & Finance' | 'Citizen Services' | 'Forms' | 'Tenders' | 'Government Schemes';
  documentNumber?: string;
  issueDate: string;
  fileUrl: string;
  fileSizeBytes?: number;
  fileExtension?: string;
};

// Official documents populated via Supabase or kept empty
export const documents: OfficialDocumentItem[] = [];

export const villageFacts = {
  village: 'Ovali',
  taluka: 'Bhiwandi',
  district: 'Thane',
  state: 'Maharashtra',
  pin: '421302',
  code: '552662',
  area: '202 hectares / 2.02 km²',
  nearestTown: 'Bhiwandi Nizampur, approximately 5 km',
  districtDistance: 'Thane, approximately 18 km',
  panchayatSamiti: 'Bhiwandi',
  districtPanchayat: 'Thane Zilla Parishad',
  censusLabel: 'Census 2011',
  census: {
    population: '1,566',
    males: '847',
    females: '719',
    households: '327',
    sexRatio: '849 females per 1,000 males',
    literacy: '82.68%',
    maleLiteracy: '89.47%',
    femaleLiteracy: '74.92%',
    children: '232',
  },
};

export const nearbyVillages = [
  'Pimpalgaon',
  'Ranjnoli',
  'Pimpalghar',
  'Gove',
  'Pimpalas',
  'Pimpalner',
  'Val',
  'Kailasnagar',
  'Gundavali',
  'Dapode',
  'Mankoli',
  'Vehele',
];

export const villageFacilities = [
  { name: 'Bank', status: 'Available within village' },
  { name: 'ATM', status: 'Available within village' },
  { name: 'Post Office', status: 'Available within village' },
  { name: 'Health Sub-Centre', status: 'Available within village' },
  { name: 'Primary Health Centre', status: 'Available within village' },
  { name: 'Community Health Centre', status: 'Available within village' },
];

export const connectivity = [
  'All-weather road connectivity',
  'Public bus availability within the village',
  'Railway station availability within the village',
  'Shared auto-rickshaw connectivity',
];