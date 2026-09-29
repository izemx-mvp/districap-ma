import {
  Cctv,
  Fingerprint,
  Flame,
  Network,
  Projector,
  Siren,
  Speaker,
  Video,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  videosurveillance: Cctv,
  "alarme-intrusion": Siren,
  "detection-incendie": Flame,
  "controle-acces": Fingerprint,
  sonorisation: Speaker,
  "videoprojection-affichage": Projector,
  "audio-visioconference": Video,
  "informatique-reseau": Network,
};

export function categoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Cctv;
}
