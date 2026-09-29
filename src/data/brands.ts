export type Brand = {
  slug: string;
  name: string;
  /** Path to a logo in /public, `null` until real logos are provided. */
  logo: string | null;
  /** TODO(districap): confirm which brands DISTRICAP distributes exclusively. */
  exclusive: boolean;
};

export const BRANDS: Brand[] = [
  { slug: "absen", name: "ABSEN", logo: null, exclusive: false },
  { slug: "aten", name: "ATEN", logo: null, exclusive: false },
  { slug: "bosch", name: "BOSCH", logo: null, exclusive: false },
  { slug: "finsecur", name: "FINSECUR", logo: null, exclusive: false },
  { slug: "hikvision", name: "HIKVISION", logo: null, exclusive: false },
  { slug: "lumens", name: "LUMENS", logo: null, exclusive: false },
  { slug: "optoma", name: "Optoma", logo: null, exclusive: false },
  { slug: "satel", name: "SATEL", logo: null, exclusive: false },
  { slug: "uniview", name: "UNIVIEW", logo: null, exclusive: false },
];
