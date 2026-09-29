export type Sector = {
  slug: string;
  name: string;
  text: string;
  /** Top-level category slugs relevant to this sector, most relevant first. */
  categories: string[];
  /** Category whose cover illustrates the card (kept distinct across sectors). */
  cover: string;
  /** Optional dedicated photo, takes precedence over `cover`. */
  image?: string;
};

export const SECTORS: Sector[] = [
  {
    slug: "commerces",
    cover: "videosurveillance",
    name: "Commerces",
    text: "Vidéosurveillance, anti-intrusion et sonorisation d'ambiance pour vos points de vente.",
    categories: ["videosurveillance", "alarme-intrusion", "sonorisation"],
  },
  {
    slug: "bureaux",
    cover: "audio-visioconference",
    name: "Bureaux",
    text: "Contrôle d'accès, salles de réunion équipées et infrastructure réseau.",
    categories: ["controle-acces", "audio-visioconference", "informatique-reseau"],
  },
  {
    slug: "industrie",
    cover: "detection-incendie",
    name: "Industrie",
    text: "Détection incendie, surveillance périmétrique et sonorisation de grands espaces.",
    categories: ["detection-incendie", "videosurveillance", "sonorisation"],
  },
  {
    slug: "hotellerie",
    cover: "sonorisation",
    name: "Hôtellerie",
    text: "Sécurité des accès, sonorisation des espaces communs et affichage.",
    categories: ["controle-acces", "sonorisation", "videoprojection-affichage"],
  },
  {
    slug: "education",
    cover: "videoprojection-affichage",
    name: "Éducation",
    text: "Écrans interactifs, vidéoprojection et sonorisation pour les salles de classe.",
    categories: ["videoprojection-affichage", "sonorisation", "informatique-reseau"],
  },
  {
    slug: "sante",
    cover: "controle-acces",
    name: "Santé",
    text: "Détection incendie, contrôle d'accès et vidéosurveillance des établissements.",
    categories: ["detection-incendie", "controle-acces", "videosurveillance"],
  },
];
