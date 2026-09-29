export const SITE = {
  name: "DISTRICAP",
  tagline: "Communication & Sécurité",
  email: "contact@districap.ma",
  phones: ["05 22 34 36 30", "06 68 49 93 59"],
  whatsapp: "212668499359",
  address:
    "Quartier industriel polygone EST lot 114, Route côtière, Ain Harrouda, Casablanca, Maroc",
  hours: [
    "Lundi – Vendredi : 08h30 – 12h30 / 14h30 – 18h30",
    "Samedi : 08h30 – 12h30",
  ],
  social: {
    facebook: "https://www.facebook.com/",
    linkedin: "https://www.linkedin.com/",
    instagram: "https://www.instagram.com/",
  },
  promise: "Livraison partout au Maroc – Paiement à la livraison",
} as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "El Jadida",
  "Mohammedia",
  "Béni Mellal",
  "Nador",
  "Laâyoune",
  "Khouribga",
  "Settat",
  "Berrechid",
  "Essaouira",
];

export const PROJECT_TYPES = [
  "Vidéosurveillance",
  "Détection incendie",
  "Alarme & Intrusion",
  "Sonorisation",
  "Audiovisuel",
  "Informatique & Réseau",
  "Autre",
];

export const BUDGET_RANGES = [
  "Moins de 10 000 MAD",
  "10 000 – 50 000 MAD",
  "50 000 – 150 000 MAD",
  "Plus de 150 000 MAD",
  "À définir",
];

export const ORDER_STATUSES = [
  "Nouvelle",
  "Confirmée",
  "Expédiée",
  "Livrée",
  "Annulée",
];
