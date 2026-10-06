import { Utensils, Martini, Briefcase, Mail, Store } from 'lucide-react';

export const SITE = {
  name: 'Alexis Restaurant & Winebar – Cana Cocktailbar & Fumoir',
  street: 'Niederdorfstrasse 40',
  city: '8001 Zürich',
  phone: '044 252 37 88',
  phoneHref: 'tel:+41442523788',
  email: 'zuerich@alexis-cana.ch',
  kitchen: 'Durchgehend warme Küche von 11.00 bis 22.45 Uhr',
  links: [
    { label: 'Hotel Alexander', href: 'https://www.hotel-alexander.ch' },
    { label: 'Luwedos Zigarren', href: 'http://www.luwe.ch/?a=1' },
    { label: 'GenussHirsch', href: 'https://www.genusshirsch.at' },
    { label: 'Bad Blumau', href: 'https://www.blumau.com' },
    { label: 'Distillerie Seetal', href: 'https://www.distillerie-seetal.ch' }
  ],
  reviews: [
    {
      label: 'Tripadvisor',
      href: 'https://www.tripadvisor.ch/UserReviewEdit-g188113-d4793838-a_referredFromLocationSearch.true-a_ReviewName.-a_type.-e-wpage1-Alexis_Restaurant_Winebar-Zurich.html'
    },
    { label: 'Restaurant Guru', href: 'https://de.restaurantguru.com/Alexis-Zurich' }
  ]
};

// Öffnungszeiten laut aktuellem Mittagsmenü (Okt. 2026). Schliesst die Zeit
// nach 24 Uhr, wird sie als 24 + Stunde angegeben (Fr/Sa bis 02.00 Uhr = 26).
// Schlüssel = Wochentag nach Date.getDay() (0 = Sonntag).
export const HOURS = {
  1: [11, 24],
  2: [11, 24],
  3: [11, 24],
  4: [11, 24],
  5: [11, 26],
  6: [11, 26],
  0: [16, 22]
};

export const HOURS_DISPLAY = [
  { days: 'Montag bis Donnerstag', time: '11.00 – 24.00 Uhr' },
  { days: 'Freitag und Samstag', time: '11.00 – 02.00 Uhr' },
  { days: 'Sonntag und Feiertage', time: '16.00 – 22.00 Uhr' }
];

export const NAV = [
  {
    label: 'Alexi’s Restaurant',
    icon: Utensils,
    children: [
      { group: 'Speisen' },
      { label: 'Tagesmenu', to: '/tagesmenu', badge: 'Aktuell' },
      { label: 'Spezialitäten', to: '/spezialitaeten' },
      { label: 'Speisekarte', to: '/speisekarte' },
      { group: 'Getränke' },
      { label: 'Monatsweine', to: '/monatsweine' },
      { label: 'Weine', to: '/weine' },
      { label: 'A Gin', to: '/a-gin' },
      { label: 'Getränkekarte', to: '/getraenkekarte' }
    ]
  },
  {
    label: 'Cana-Bar',
    icon: Martini,
    children: [
      { label: 'Luwedos Cigars', to: '/luwedos-cigars' },
      { label: 'A Gin', to: '/a-gin' },
      { label: 'Cocktails', to: '/cocktails' },
      { label: 'Getränkekarte', to: '/getraenkekarte' }
    ]
  },
  { label: 'Jobs', icon: Briefcase, to: '/jobs' },
  {
    label: 'Kontakt',
    icon: Mail,
    to: '/kontakt',
    children: [
      { label: 'Kontaktinfos', to: '/kontakt' },
      { label: '360° View', to: '/360' }
    ]
  },
  { label: 'A-Shop', icon: Store, to: '/shop' }
];

const fmt = (h) => `${h === 24 ? 24 : String(h % 24).padStart(2, '0')}.00 Uhr`;

// Aktueller Status in Zürcher Zeit, unabhängig von der Zeitzone des Geräts.
export function getOpenStatus(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zurich',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));

  const [open, close] = HOURS[day];
  if (minutes >= open * 60 && minutes < close * 60) {
    return { open: true, label: `Jetzt geöffnet · bis ${fmt(close)}` };
  }
  const prevClose = HOURS[(day + 6) % 7][1];
  if (prevClose > 24 && minutes < (prevClose - 24) * 60) {
    return { open: true, label: `Jetzt geöffnet · bis ${fmt(prevClose)}` };
  }
  if (minutes < open * 60) {
    return { open: false, label: `Geschlossen · öffnet heute um ${fmt(open)}` };
  }
  const next = HOURS[(day + 1) % 7][0];
  return { open: false, label: `Geschlossen · öffnet morgen um ${fmt(next)}` };
}
