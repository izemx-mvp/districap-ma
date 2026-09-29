import camera from "@/assets/prod-camera.jpg";
import alarme from "@/assets/prod-alarme.jpg";
import incendie from "@/assets/prod-incendie.jpg";
import acces from "@/assets/prod-acces.jpg";
import sono from "@/assets/prod-sono.jpg";
import av from "@/assets/prod-av.jpg";
import reseau from "@/assets/prod-reseau.jpg";
import heroVideo from "@/assets/hero-videosurveillance.jpg";
import heroSono from "@/assets/hero-sonorisation.jpg";
import heroSecurite from "@/assets/hero-securite.jpg";

const MAP: Record<string, string> = {
  camera,
  alarme,
  incendie,
  acces,
  sono,
  av,
  reseau,
};

export function productImage(key: string | null | undefined) {
  return (key && MAP[key]) || camera;
}

export const AMBIANCE = {
  videosurveillance: heroVideo,
  sonorisation: heroSono,
  securite: heroSecurite,
};
