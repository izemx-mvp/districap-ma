import { CATEGORY_COVERS, PRODUCT_IMAGES, type ImageKey } from "@/lib/images";

export type Category = {
  slug: string;
  name: string;
  /** Parent category slug, `null` for top-level categories. */
  parent: string | null;
  intro: string | null;
  image: string;
  position: number;
};

type CategorySeed = Omit<Category, "image"> & { imageKey: ImageKey };

const SEED: CategorySeed[] = [
  {
    slug: "videosurveillance",
    name: "Vidéosurveillance",
    parent: null,
    imageKey: "camera",
    intro:
      "Caméras IP, kits complets et enregistreurs pour sécuriser vos locaux professionnels et résidentiels partout au Maroc.",
    position: 1,
  },
  {
    slug: "cameras-ip",
    name: "Caméras IP",
    parent: "videosurveillance",
    imageKey: "camera",
    intro: null,
    position: 1,
  },
  {
    slug: "cameras-wifi",
    name: "Caméras WiFi",
    parent: "videosurveillance",
    imageKey: "camera",
    intro: null,
    position: 2,
  },
  {
    slug: "kits-complets",
    name: "Kits complets",
    parent: "videosurveillance",
    imageKey: "camera",
    intro: null,
    position: 3,
  },
  {
    slug: "enregistreurs",
    name: "Enregistreurs NVR/DVR",
    parent: "videosurveillance",
    imageKey: "camera",
    intro: null,
    position: 4,
  },
  {
    slug: "accessoires-video",
    name: "Accessoires",
    parent: "videosurveillance",
    imageKey: "camera",
    intro: null,
    position: 5,
  },

  {
    slug: "alarme-intrusion",
    name: "Alarme & Intrusion",
    parent: null,
    imageKey: "alarme",
    intro: "Centrales, détecteurs et sirènes pour une protection anti-intrusion fiable.",
    position: 2,
  },
  {
    slug: "centrales-alarme",
    name: "Centrales",
    parent: "alarme-intrusion",
    imageKey: "alarme",
    intro: null,
    position: 1,
  },
  {
    slug: "detecteurs-intrusion",
    name: "Détecteurs",
    parent: "alarme-intrusion",
    imageKey: "alarme",
    intro: null,
    position: 2,
  },
  {
    slug: "sirenes",
    name: "Sirènes",
    parent: "alarme-intrusion",
    imageKey: "alarme",
    intro: null,
    position: 3,
  },
  {
    slug: "claviers",
    name: "Claviers",
    parent: "alarme-intrusion",
    imageKey: "alarme",
    intro: null,
    position: 4,
  },

  {
    slug: "detection-incendie",
    name: "Détection incendie",
    parent: null,
    imageKey: "incendie",
    intro:
      "Centrales de détection, détecteurs, câbles et accessoires pour vos installations de sécurité incendie.",
    position: 3,
  },
  {
    slug: "centrales-cmsi",
    name: "Centrales CMSI",
    parent: "detection-incendie",
    imageKey: "incendie",
    intro: null,
    position: 1,
  },
  {
    slug: "detecteurs-incendie",
    name: "Détecteurs",
    parent: "detection-incendie",
    imageKey: "incendie",
    intro: null,
    position: 2,
  },
  {
    slug: "cables-incendie",
    name: "Câbles",
    parent: "detection-incendie",
    imageKey: "incendie",
    intro: null,
    position: 3,
  },
  {
    slug: "accessoires-incendie",
    name: "Accessoires",
    parent: "detection-incendie",
    imageKey: "incendie",
    intro: null,
    position: 4,
  },

  {
    slug: "controle-acces",
    name: "Contrôle d'accès",
    parent: null,
    imageKey: "acces",
    intro: "Lecteurs, contrôleurs, badges et serrures pour maîtriser les accès de vos sites.",
    position: 4,
  },
  {
    slug: "lecteurs",
    name: "Lecteurs",
    parent: "controle-acces",
    imageKey: "acces",
    intro: null,
    position: 1,
  },
  {
    slug: "controleurs",
    name: "Contrôleurs",
    parent: "controle-acces",
    imageKey: "acces",
    intro: null,
    position: 2,
  },
  {
    slug: "badges",
    name: "Badges",
    parent: "controle-acces",
    imageKey: "acces",
    intro: null,
    position: 3,
  },
  {
    slug: "serrures",
    name: "Serrures",
    parent: "controle-acces",
    imageKey: "acces",
    intro: null,
    position: 4,
  },

  {
    slug: "sonorisation",
    name: "Sonorisation",
    parent: null,
    imageKey: "sono",
    intro:
      "Haut-parleurs, projecteurs de son, amplificateurs et tables de mixage pour tous vos espaces.",
    position: 5,
  },
  {
    slug: "haut-parleurs",
    name: "Haut-parleurs",
    parent: "sonorisation",
    imageKey: "sono",
    intro: null,
    position: 1,
  },
  {
    slug: "projecteurs-de-son",
    name: "Projecteurs de son",
    parent: "sonorisation",
    imageKey: "sono",
    intro: null,
    position: 2,
  },
  {
    slug: "amplificateurs",
    name: "Amplificateurs",
    parent: "sonorisation",
    imageKey: "sono",
    intro: null,
    position: 3,
  },
  {
    slug: "tables-de-mixage",
    name: "Tables de mixage",
    parent: "sonorisation",
    imageKey: "sono",
    intro: null,
    position: 4,
  },
  {
    slug: "racks",
    name: "Racks",
    parent: "sonorisation",
    imageKey: "sono",
    intro: null,
    position: 5,
  },

  {
    slug: "videoprojection-affichage",
    name: "Vidéoprojection & Affichage",
    parent: null,
    imageKey: "av",
    intro: "Vidéoprojecteurs laser, écrans interactifs et solutions de présentation sans fil.",
    position: 6,
  },
  {
    slug: "videoprojecteurs",
    name: "Vidéoprojecteurs",
    parent: "videoprojection-affichage",
    imageKey: "av",
    intro: null,
    position: 1,
  },
  {
    slug: "ecrans-interactifs",
    name: "Écrans interactifs",
    parent: "videoprojection-affichage",
    imageKey: "av",
    intro: null,
    position: 2,
  },
  {
    slug: "presentation-sans-fil",
    name: "Présentation sans fil",
    parent: "videoprojection-affichage",
    imageKey: "av",
    intro: null,
    position: 3,
  },

  {
    slug: "audio-visioconference",
    name: "Audioconférence & Visioconférence",
    parent: null,
    imageKey: "av",
    intro:
      "Systèmes de discussion, caméras PTZ et barres de conférence pour vos salles de réunion.",
    position: 7,
  },
  {
    slug: "systemes-discussion",
    name: "Systèmes de discussion",
    parent: "audio-visioconference",
    imageKey: "av",
    intro: null,
    position: 1,
  },
  {
    slug: "cameras-conference",
    name: "Caméras",
    parent: "audio-visioconference",
    imageKey: "av",
    intro: null,
    position: 2,
  },
  {
    slug: "barres-conference",
    name: "Barres de conférence",
    parent: "audio-visioconference",
    imageKey: "av",
    intro: null,
    position: 3,
  },

  {
    slug: "informatique-reseau",
    name: "Informatique & Réseau",
    parent: null,
    imageKey: "reseau",
    intro: "KVM, précâblage cuivre et fibre, coffrets et baies pour vos infrastructures réseau.",
    position: 8,
  },
  {
    slug: "kvm",
    name: "KVM",
    parent: "informatique-reseau",
    imageKey: "reseau",
    intro: null,
    position: 1,
  },
  {
    slug: "precablage",
    name: "Précâblage cuivre/fibre",
    parent: "informatique-reseau",
    imageKey: "reseau",
    intro: null,
    position: 2,
  },
  {
    slug: "coffrets-baies",
    name: "Coffrets et baies",
    parent: "informatique-reseau",
    imageKey: "reseau",
    intro: null,
    position: 3,
  },
];

export const CATEGORIES: Category[] = SEED.map(({ imageKey, ...rest }) => ({
  ...rest,
  image: CATEGORY_COVERS[rest.parent ?? rest.slug] ?? PRODUCT_IMAGES[imageKey],
}));
