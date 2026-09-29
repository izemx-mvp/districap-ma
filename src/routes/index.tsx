import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Banknote, Headset, Truck } from "lucide-react";
import { getParentCategories, newProducts, productsByCategory, promoProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CountUp, Reveal } from "@/components/Reveal";
import { HeroSlider } from "@/components/home/HeroSlider";
import {
  BrandsMarquee,
  CtaBanner,
  SectorsSection,
  WhySection,
} from "@/components/home/HomeSections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DISTRICAP – Vidéosurveillance, sécurité et audiovisuel au Maroc" },
      {
        name: "description",
        content:
          "Achetez en ligne caméras IP, kits de vidéosurveillance, alarmes, détection incendie, sonorisation et vidéoprojection. Livraison partout au Maroc, paiement à la livraison.",
      },
      {
        property: "og:title",
        content: "DISTRICAP – Vidéosurveillance, sécurité et audiovisuel au Maroc",
      },
      {
        property: "og:description",
        content:
          "Distributeur à Casablanca depuis 2009 : vidéosurveillance, alarme, incendie, sonorisation, audiovisuel et réseau.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const FOUNDED = 2009;

const REASSURANCE = [
  { icon: Truck, title: "Livraison partout au Maroc", text: "Depuis notre dépôt de Casablanca" },
  { icon: Banknote, title: "Paiement à la livraison", text: "Vous réglez à la réception" },
  {
    icon: BadgeCheck,
    title: "ans d'expérience",
    text: `Distributeur actif depuis ${FOUNDED}`,
    count: new Date().getFullYear() - FOUNDED,
  },
  { icon: Headset, title: "Conseil technique", text: "Aide au choix de vos équipements" },
];

function SectionHeading({
  title,
  text,
  link,
}: {
  title: string;
  text: string;
  link?: { to: "/nouveautes"; label: string };
}) {
  return (
    <Reveal className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-3xl">{title}</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{text}</p>
      </div>
      {link && (
        <Link
          to={link.to}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        >
          {link.label}
          <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}

function Home() {
  const parents = getParentCategories();
  const promos = promoProducts().slice(0, 10);
  const nouveautes = newProducts().slice(0, 4);

  return (
    <>
      <HeroSlider />

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASSURANCE.map((item, i) => (
            <Reveal key={item.title} delay={i * 70} className="group flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <item.icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold">
                  {item.count ? (
                    <>
                      <CountUp to={item.count} /> {item.title}
                    </>
                  ) : (
                    item.title
                  )}
                </p>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <SectionHeading
          title="Nos univers produits"
          text="Huit familles de produits pour équiper vos bâtiments, de la caméra IP à la salle de conférence."
        />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {parents.map((cat, i) => {
            const count = productsByCategory(cat.slug).length;
            return (
              <Reveal as="li" key={cat.slug} delay={i * 70}>
                <Link
                  to="/categorie/$slug"
                  params={{ slug: cat.slug }}
                  className="group relative block h-48 overflow-hidden rounded-xl bg-ink"
                >
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    width={600}
                    height={400}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/5 transition-opacity duration-250 group-hover:from-ink" />
                  <span className="absolute top-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-foreground backdrop-blur">
                    {count} produit{count > 1 ? "s" : ""}
                  </span>
                  <span className="absolute inset-x-4 bottom-4 flex items-center gap-2 text-ink-foreground transition-transform duration-250 group-hover:-translate-y-1.5">
                    <ArrowRight className="size-4 -translate-x-3 text-primary opacity-0 transition-all duration-250 group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="font-semibold">{cat.name}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <section className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            title="Produits en promotion"
            text="Des références sélectionnées à prix réduit, dans la limite des stocks disponibles."
          />
          <Reveal className="mt-8">
            <ProductCarousel products={promos} label="Produits en promotion" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <SectionHeading
          title="Nouveautés"
          text="Les dernières références entrées à notre catalogue."
          link={{ to: "/nouveautes", label: "Voir tout" }}
        />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {nouveautes.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </ul>
      </section>

      <BrandsMarquee />
      <WhySection />
      <SectorsSection />
      <CtaBanner />
    </>
  );
}
