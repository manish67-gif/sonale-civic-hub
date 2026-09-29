export const tagline = 'Ovali Gram Panchayat serves the village of Ovali in Bhiwandi, Thane, Maharashtra. This site shares village information, public resources and updates as they become available.';
export const marathiTagline = 'ग्रामपंचायत ओवळीच्या डिजिटल व्यासपीठावर आपले स्वागत आहे. येथे गाव, ग्रामपंचायत सेवा, सूचना आणि नागरिकांसाठी उपयुक्त माहिती उपलब्ध करून देण्यात येते.';

export const contact = {
  phone: 'To be updated',
  email: 'To be updated',
  address: 'Ovali, Bhiwandi, Thane, Maharashtra – 421302',
  hours: 'To be updated',
};

export const navItems = [
  { to: '/', en: 'Home', mr: 'मुख्यपृष्ठ' },
  { to: '/about', en: 'About Us', mr: 'आमच्याबद्दल' },
  { to: '/gallery', en: 'Gallery', mr: 'दालन' },
  { to: '/announcements', en: 'Announcements', mr: 'सूचना' },
  { to: '/contact', en: 'Contact', mr: 'संपर्क' },
  { to: '/feedback', en: 'Feedback', mr: 'अभिप्राय' },
] as const;

export const portals = [
  { name: 'Maharashtra Rural Development and Panchayat Raj Department', short: 'Maharashtra Rural Development', url: 'https://rdd.maharashtra.gov.in/' },
  { name: 'eGramSwaraj', short: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
  { name: 'National Portal of India', short: 'National Portal of India', url: 'https://www.india.gov.in/' },
  { name: 'Thane District', short: 'Thane District', url: 'https://thane.nic.in/' },
];

export type Announcement = { id: number; date: string; category: 'General' | 'Gram Sabha' | 'Development' | 'Public Notice'; title: string; english: string; description: string };
// No Ovali notices have been provided or verified yet.
export const announcements: Announcement[] = [];

export const gallery = [
  { id: 1, title: 'Ovali Village', mr: 'ओवळी गाव', category: 'Village', description: 'Village photographs will be added when authentic Ovali images are available.' },
  { id: 2, title: 'Ovali Gram Panchayat', mr: 'ग्रामपंचायत ओवळी', category: 'Panchayat', description: 'Authentic Panchayat photographs will be added when available.' },
  { id: 3, title: 'Village Development', mr: 'गावाचा विकास', category: 'Development', description: 'Verified development activity photographs will be added when available.' },
  { id: 4, title: 'Community Activities', mr: 'सामुदायिक उपक्रम', category: 'Community', description: 'Community photographs will be added when authentic Ovali images are available.' },
];

export const villageFacts = {
  code: '552662',
  area: '202 hectares (2.02 km²)',
  nearestTown: 'Bhiwandi Nizampur, approximately 5 km',
  districtDistance: 'Thane, approximately 18 km',
  panchayatSamiti: 'Bhiwandi Panchayat Samiti',
  districtPanchayat: 'Thane Zila Parishad',
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

export const nearbyVillages = ['Pimpalgaon', 'Ranjnoli', 'Pimpalghar', 'Gove', 'Pimpalas', 'Pimpalner', 'Val', 'Kailasnagar', 'Gundavali', 'Dapode', 'Mankoli', 'Vehele'];

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