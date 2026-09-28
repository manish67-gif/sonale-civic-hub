import office from '@/assets/panchayat-office.jpg';
import road from '@/assets/village-road.jpg';
import sabha from '@/assets/gram-sabha.jpg';
import water from '@/assets/water-project.jpg';
import cleanliness from '@/assets/cleanliness.jpg';
import community from '@/assets/community.jpg';
import event from '@/assets/local-event.jpg';
import infrastructure from '@/assets/infrastructure.jpg';

export const tagline = 'ग्रुप ग्रामपंचायत सोनाळे, भिवंडी हि ग्रामपंचायत पारदर्शक कारभार आणि सर्वांगीण विकासासाठी कटिबद्ध आहे.';
export const contact = { phone: '+91 9890417095', email: 'sagysonale@gmail.com', address: 'Gram Panchayat Bhavan, Sonale Village, Bhiwandi, Thane District, Maharashtra - 421302', hours: 'Mon–Sat: 10:00 AM – 5:30 PM' };
export const navItems = [
  { to: '/', en: 'Home', mr: 'मुख्यपृष्ठ' },
  { to: '/about', en: 'About Us', mr: 'आमच्याबद्दल' },
  { to: '/gallery', en: 'Gallery', mr: 'दालन' },
  { to: '/announcements', en: 'Announcements', mr: 'सूचना' },
  { to: '/contact', en: 'Contact', mr: 'संपर्क' },
  { to: '/feedback', en: 'Feedback', mr: 'अभिप्राय' },
] as const;
export const portals = [
  { name: 'Maharashtra Gram Panchayat Portal', short: 'Maharashtra GP Portal', url: 'https://rdd.maharashtra.gov.in/en/grampanchayat/' },
  { name: 'eGramSwaraj', short: 'eGramSwaraj', url: 'https://egramswaraj.gov.in/' },
  { name: 'National Portal of India', short: 'National Portal of India', url: 'https://www.india.gov.in/' },
  { name: 'PM India', short: 'PM India', url: 'https://www.pmindia.gov.in/' },
  { name: 'Thane District', short: 'Thane District', url: 'https://thane.nic.in/' },
];
export type Announcement = { id: number; date: string; category: 'General' | 'Gram Sabha' | 'Development' | 'Public Notice'; title: string; english: string; description: string };
export const announcements: Announcement[] = [
  { id: 1, date: '18 Sep 2026', category: 'Gram Sabha', title: 'ग्रामसभा बैठकीची सूचना', english: 'Gram Sabha Meeting Notice', description: 'ग्रामपंचायत सोनाळेच्या आगामी ग्रामसभेसाठी सर्व ग्रामस्थांना उपस्थित राहण्याचे आवाहन. बैठकीत गावाच्या विकासकामांवर चर्चा करण्यात येईल.' },
  { id: 2, date: '12 Sep 2026', category: 'Public Notice', title: 'पाणीपुरवठा देखभाल सूचना', english: 'Water Supply Maintenance', description: 'पाणीपुरवठा व्यवस्थेच्या नियोजित देखभालीबाबत नागरिकांनी सहकार्य करावे. अद्ययावत माहितीसाठी ग्रामपंचायत कार्यालयाशी संपर्क साधावा.' },
  { id: 3, date: '05 Sep 2026', category: 'Development', title: 'गावातील रस्ता विकासकामांची माहिती', english: 'Village Road Development', description: 'गावातील पायाभूत सुविधांच्या सुधारणेसाठी प्रस्तावित रस्ता विकासकामांबाबत माहिती.' },
  { id: 4, date: '28 Aug 2026', category: 'General', title: 'स्वच्छता मोहिमेत सहभागी व्हा', english: 'Village Cleanliness Drive', description: 'स्वच्छ आणि सुंदर सोनाळेसाठी आयोजित स्वच्छता मोहिमेत सर्व नागरिकांनी सहभाग नोंदवावा.' },
  { id: 5, date: '20 Aug 2026', category: 'Public Notice', title: 'नागरिक सेवा व अर्ज सूचना', english: 'Citizen Services and Applications', description: 'ग्रामपंचायत कार्यालयात उपलब्ध नागरिक सेवा आणि अर्ज प्रक्रियेबाबत सर्वसाधारण माहिती.' },
  { id: 6, date: '14 Aug 2026', category: 'Development', title: 'जलसंवर्धन उपक्रम', english: 'Water Conservation Initiative', description: 'पाणी बचत आणि जलसंवर्धनासाठी गावपातळीवरील उपक्रमांमध्ये सहभागी व्हा.' },
];
export const gallery = [
  { id: 1, title: 'Gram Panchayat Office', mr: 'ग्रामपंचायत कार्यालय', category: 'Village', image: office },
  { id: 2, title: 'Village Road', mr: 'गावातील रस्ता', category: 'Development', image: road },
  { id: 3, title: 'Gram Sabha', mr: 'ग्रामसभा', category: 'Community', image: sabha },
  { id: 4, title: 'Water Supply', mr: 'पाणीपुरवठा', category: 'Development', image: water },
  { id: 5, title: 'Cleanliness Drive', mr: 'स्वच्छता मोहीम', category: 'Community', image: cleanliness },
  { id: 6, title: 'Community Activities', mr: 'सामुदायिक उपक्रम', category: 'Community', image: community },
  { id: 7, title: 'Local Celebration', mr: 'स्थानिक कार्यक्रम', category: 'Events', image: event },
  { id: 8, title: 'Road Infrastructure', mr: 'रस्ता विकास', category: 'Development', image: infrastructure },
];
