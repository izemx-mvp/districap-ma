import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Cable,
  Check,
  ClipboardList,
  Flame,
  Headset,
  Landmark,
  LifeBuoy,
  MessageSquare,
  Mic,
  PackageCheck,
  Phone,
  Projector,
  ShieldCheck,
  Speaker,
  Store,
  Truck,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import { CountUp, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AMBIANCE } from "@/lib/images";
import { SITE, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services – étude, fourniture et accompagnement – DISTRICAP" },
      {
        name: "description",
        content:
          "Étude de projet, fourniture de matériel, conseil technique, livraison partout au Maroc, assistance à la mise en service et support après-vente : DISTRICAP vous accompagne depuis 2009.",
      },
      { property: "og:title", content: "Nos services – DISTRICAP" },
      {
        property: "og:description",
        content:
          "De l'étude technique au support après-vente, un seul interlocuteur pour vos projets de sécurité électronique et d'audiovisuel.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: 2009, label: "Année de création", plain: true },
  { value: 16, suffix: "+", label: "Années d'expertise" },
  { value: 8, label: "Univers de solutions" },
  { value: 5, label: "Marques en exclusivité" },
];

const SERVICES = [
  {
    icon: ClipboardList,
    title: "Étude & dimensionnement",
    text: "Nous analysons votre site et vos contraintes pour définir une solution cohérente, du bon nombre de caméras à la puissance de sonorisation.",
    points: ["Analyse du besoin et du site", "Schémas de principe", "Chiffrage détaillé"],
    featured: true,
  },
  {
    icon: PackageCheck,
    title: "Fourniture de matériel",
    text: "Des références professionnelles issues de grandes marques internationales, dont plusieurs distribuées en exclusivité au Maroc.",
    points: ["Stock à Casablanca", "Produits d'origine", "Grandes marques"],
  },
  {
    icon: Headset,
    title: "Conseil avant-vente",
    text: "Un accompagnement pour choisir les équipements adaptés à votre usage, à vos normes et à votre budget.",
    points: ["Comparatif de gammes", "Compatibilités vérifiées"],
  },
  {
    icon: Truck,
    title: "Livraison nationale",
    text: "Expédition partout au Maroc depuis notre dépôt de Casablanca, avec paiement à la livraison.",
    points: ["Toutes les villes du Maroc", "Paiement à la réception"],
  },
  {
    icon: Wrench,
    title: "Aide à la mise en service",
    text: "Assistance à la configuration et à la mise en route de vos équipements avec vos installateurs.",
    points: ["Paramétrage", "Accompagnement des équipes"],
  },
  {
    icon: LifeBuoy,
    title: "Support après-vente",
    text: "Un suivi après l'achat : garantie constructeur, gestion des retours et assistance technique.",
    points: ["Garantie constructeur", "Suivi des retours"],
  },
];

const STEPS = [
  {
    title: "Écoute du besoin",
    text: "Vous nous présentez votre projet : type de bâtiment, surface, usages, contraintes et calendrier. Nous posons les bonnes questions dès le départ.",
    deliverable: "Cahier des besoins clarifié",
  },
  {
    title: "Étude technique",
    text: "Nous évaluons les enjeux et dimensionnons la solution : choix des technologies, nombre et emplacement des équipements, architecture réseau.",
    deliverable: "Schéma de principe et liste de matériel",
  },
  {
    title: "Proposition chiffrée",
    text: "Vous recevez une offre détaillée, poste par poste, avec les références proposées et leurs alternatives si nécessaire.",
    deliverable: "Devis détaillé",
  },
  {
    title: "Fourniture & livraison",
    text: "Nous préparons votre commande et organisons la livraison sur site, partout au Maroc, en respectant votre planning de chantier.",
    deliverable: "Matériel livré sur site",
  },
  {
    title: "Mise en service & suivi",
    text: "Nous accompagnons la mise en route et restons disponibles après l'installation pour l'assistance et la garantie.",
    deliverable: "Installation opérationnelle",
  },
];

const EXPERTISES = [
  { icon: Flame, title: "Détection incendie", text: "CMSI, systèmes conventionnels et adressables" },
  { icon: Video, title: "Vidéosurveillance", text: "Caméras IP, enregistreurs et supervision" },
  { icon: ShieldCheck, title: "Intrusion & contrôle d'accès", text: "Centrales d'alarme, lecteurs et badges" },
  { icon: Speaker, title: "Sonorisation", text: "Sonorisation d'ambiance et de sécurité" },
  { icon: Mic, title: "Audioconférence", text: "Systèmes de discussion et d'interprétation" },
  { icon: Users, title: "Visioconférence", text: "Caméras, barres et visualiseurs" },
  { icon: Projector, title: "Affichage & Pro AV", text: "Écrans interactifs, vidéoprojecteurs, KVM" },
  { icon: Cable, title: "Précâblage informatique", text: "Cuivre, fibre, coffrets et baies" },
];

const AUDIENCES = [
  {
    icon: Wrench,
    title: "Installateurs & intégrateurs",
    text: "Un fournisseur fiable pour vos chantiers, avec des gammes professionnelles et un conseil technique.",
  },
  {
    icon: Building2,
    title: "Entreprises & industries",
    text: "Des solutions pour sécuriser vos sites et équiper vos salles de réunion.",
  },
  {
    icon: Landmark,
    title: "Administrations & grands comptes",
    text: "Un accompagnement structuré pour vos projets d'envergure et vos appels d'offres.",
  },
  {
    icon: Store,
    title: "Commerces & centres commerciaux",
    text: "Vidéosurveillance, sonorisation et détection incendie adaptées aux espaces recevant du public.",
  },
];

const REFERENCES = [
  {
    name: "Almazar Marrakech",
    sector: "Centre commercial",
    solutions: ["Détection incendie FINSECUR"],
    image: AMBIANCE.securite,
  },
  {
    name: "Marina Mall",
    sector: "Centre commercial",
    solutions: ["Sonorisation de sécurité BOSCH", "Alarme intrusion SATEL", "Détection incendie FINSECUR"],
    image: AMBIANCE.sonorisation,
  },
  {
    name: "Aeria Mall",
    sector: "Centre commercial",
    solutions: [
      "Sonorisation de sécurité BOSCH",
      "Détection incendie FINSECUR",
      "Vidéosurveillance UNIVIEW",
      "Alarme intrusion SATEL",
    ],
    image: AMBIANCE.videosurveillance,
  },
];

const COMMITMENTS = [
  "Des produits d'origine, issus de marques reconnues",
  "Des choix techniques argumentés et adaptés à votre site",
  "La maîtrise des délais de mise en œuvre",
  "Un interlocuteur unique, de l'étude au suivi",
  "La garantie constructeur sur le matériel fourni",
];

const FAQ = [
  {
    q: "Livrez-vous partout au Maroc ?",
    a: "Oui. Nous expédions depuis notre dépôt de Casablanca vers toutes les villes du Maroc. Les frais de livraison sont confirmés au moment de la validation de votre commande.",
  },
  {
    q: "Quels sont les moyens de paiement ?",
    a: "Pour les commandes en ligne, le règlement s'effectue à la livraison. Pour les projets sur devis, les modalités sont précisées dans notre proposition.",
  },
  {
    q: "Pouvez-vous étudier un projet à partir d'un cahier des charges ?",
    a: "Oui. Transmettez-nous votre cahier des charges ou vos plans via le formulaire de devis : nous l'analysons et revenons vers vous avec une proposition adaptée.",
  },
  {
    q: "Travaillez-vous avec les installateurs ?",
    a: "Oui, une grande partie de nos clients sont des installateurs et intégrateurs. Nous les accompagnons dans le choix du matériel et la préparation de leurs chantiers.",
  },
  {
    q: "Le matériel est-il garanti ?",
    a: "Le matériel fourni bénéficie de la garantie constructeur. Notre équipe vous accompagne en cas de retour ou de besoin d'assistance.",
  },
];

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const GRID_BG = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
  backgroundSize: "48px 48px",
};

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase",
        light ? "text-primary" : "text-primary",
      )}
    >
      <span className="h-px w-8 bg-primary" />
      {children}
    </p>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      <img
        src={AMBIANCE.securite}
        alt=""
        width={1600}
        height={912}
        className="ken-burns absolute inset-0 -z-20 size-full object-cover opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
      <div className="absolute inset-0 -z-10 opacity-60" style={GRID_BG} aria-hidden />

      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <nav className="rise-in text-sm opacity-70" aria-label="Fil d'ariane">
          <Link to="/" className="hover:text-primary">
            Accueil
          </Link>{" "}
          / <span>Nos services</span>
        </nav>

        <div className="mt-8 max-w-3xl">
          <div className="rise-in" style={{ animationDelay: "80ms" }}>
            <Eyebrow light>Nos services</Eyebrow>
          </div>
          <h1
            className="rise-in mt-4 text-4xl leading-[1.1] md:text-6xl"
            style={{ animationDelay: "160ms" }}
          >
            Bien plus qu'un distributeur,{" "}
            <span className="text-primary">un partenaire de vos projets.</span>
          </h1>
          <p
            className="rise-in mt-6 max-w-2xl text-base opacity-85 md:text-lg"
            style={{ animationDelay: "240ms" }}
          >
            Depuis 2009, DISTRICAP accompagne installateurs, entreprises et administrations à
            chaque étape : étude, choix du matériel, fourniture, livraison et suivi après-vente.
          </p>
          <div
            className="rise-in mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "320ms" }}
          >
            <Button asChild size="lg" className="press glow-pulse group">
              <Link to="/devis">
                Demander une étude
                <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="press border-white/30 bg-transparent text-ink-foreground hover:bg-white/10"
            >
              <a href="#methode">Découvrir notre méthode</a>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80} className="bg-ink/80 p-5 backdrop-blur md:p-6">
              <p className="text-3xl font-bold text-primary md:text-4xl">
                {stat.plain ? stat.value : <CountUp to={stat.value} suffix={stat.suffix ?? ""} />}
              </p>
              <p className="mt-1 text-sm opacity-75">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesBento() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>Ce que nous faisons</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Un accompagnement complet, de l'idée au suivi</h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          Six expertises complémentaires pour que votre projet soit bien conçu, bien équipé et bien
          suivi.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => (
          <Reveal
            key={service.title}
            delay={i * 70}
            className={cn(service.featured && "md:col-span-2 lg:col-span-1 lg:row-span-2")}
          >
            <article
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
                service.featured ? "ink-panel border-transparent" : "bg-background",
              )}
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
              <span className="pointer-events-none absolute -top-6 -right-2 text-8xl font-bold opacity-[0.06] select-none">
                0{i + 1}
              </span>

              <span
                className={cn(
                  "grid size-12 place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6",
                  service.featured
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
                )}
              >
                <service.icon className="size-6" />
              </span>

              <h3 className={cn("mt-6 text-xl", service.featured && "md:text-2xl")}>
                {service.title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  service.featured ? "opacity-80" : "text-muted-foreground",
                )}
              >
                {service.text}
              </p>

              <ul className="mt-6 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-2 text-sm">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="size-3" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              {service.featured && (
                <div className="mt-auto pt-10">
                  <Link
                    to="/devis"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Lancer une étude
                    <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Method() {
  const [active, setActive] = useState(0);
  const step = STEPS[active]!;

  return (
    <section id="methode" className="scroll-mt-32 bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal className="max-w-2xl">
          <Eyebrow>Notre méthode</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Cinq étapes pour un projet réussi</h2>
          <p className="mt-3 text-muted-foreground">
            Un projet réussi se prépare très en amont : des choix techniques pertinents et une
            gestion rigoureuse de chaque phase de déploiement.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[380px_1fr]">
          <ol className="relative space-y-2" role="tablist" aria-label="Étapes de la méthode">
            <span className="absolute top-6 bottom-6 left-[27px] w-px bg-border" aria-hidden />
            <span
              className="absolute top-6 left-[27px] w-px bg-primary transition-all duration-500"
              style={{ height: `calc(${(active / (STEPS.length - 1)) * 100}% - ${(active / (STEPS.length - 1)) * 48}px)` }}
              aria-hidden
            />
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    "relative flex w-full items-center gap-4 rounded-xl px-2 py-3 text-left transition-colors duration-250",
                    active === i ? "bg-background shadow-[var(--shadow-card)]" : "hover:bg-background/60",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition-all duration-300",
                      i <= active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground",
                      active === i && "scale-110",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "font-semibold transition-colors",
                      active === i ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative overflow-hidden rounded-2xl bg-ink p-8 text-ink-foreground md:p-12">
            <div className="absolute inset-0 opacity-50" style={GRID_BG} aria-hidden />
            <div key={active} className="rise-in relative">
              <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase">
                Étape {active + 1} / {STEPS.length}
              </p>
              <h3 className="mt-4 text-3xl md:text-4xl">{step.title}</h3>
              <p className="mt-5 max-w-xl text-base leading-relaxed opacity-85 md:text-lg">
                {step.text}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm">
                <BadgeCheck className="size-4 text-primary" />
                Livrable : <span className="font-semibold">{step.deliverable}</span>
              </div>
            </div>

            <div className="relative mt-10 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="press border-white/20 bg-transparent text-ink-foreground hover:bg-white/10"
                disabled={active === 0}
                onClick={() => setActive((a) => Math.max(0, a - 1))}
              >
                Précédent
              </Button>
              <Button
                size="sm"
                className="press"
                disabled={active === STEPS.length - 1}
                onClick={() => setActive((a) => Math.min(STEPS.length - 1, a + 1))}
              >
                Étape suivante <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Expertises() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="text-center">
        <Eyebrow>Domaines d'expertise</Eyebrow>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl md:text-4xl">
          Huit univers techniques maîtrisés
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {EXPERTISES.map((item, i) => (
          <Reveal key={item.title} delay={i * 50} className="bg-background">
            <div className="group relative h-full p-6 transition-colors duration-300 hover:bg-ink hover:text-ink-foreground">
              <item.icon className="size-7 text-primary transition-transform duration-300 group-hover:-translate-y-1" />
              <h3 className="mt-5 font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground transition-colors group-hover:text-ink-foreground/70">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 text-center">
        <Button asChild variant="outline" className="press group">
          <Link to="/">
            Parcourir le catalogue
            <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}

function Audiences() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <Reveal>
          <Eyebrow>Pour qui</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">
            Des solutions pensées pour chaque type de client
          </h2>
          <p className="mt-4 text-muted-foreground">
            Du chantier d'un installateur au projet multi-sites d'un grand compte, nous adaptons
            notre accompagnement à votre organisation.
          </p>
          <div className="relative mt-8 hidden overflow-hidden rounded-2xl lg:block">
            <img
              src={AMBIANCE.videosurveillance}
              alt="Équipements de vidéosurveillance professionnels"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.title} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <a.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function References() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>Références</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Ils nous ont fait confiance</h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          Quelques projets réalisés dans des centres commerciaux, parmi les nombreux chantiers
          accompagnés.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {REFERENCES.map((ref, i) => (
          <Reveal key={ref.name} delay={i * 100}>
            <article className="group relative h-[420px] overflow-hidden rounded-2xl bg-ink text-ink-foreground">
              <img
                src={ref.image}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  {ref.sector}
                </p>
                <h3 className="mt-2 text-2xl">{ref.name}</h3>
                <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
                  <ul className="overflow-hidden">
                    {ref.solutions.map((s) => (
                      <li key={s} className="mt-2 flex items-center gap-2 text-sm opacity-90">
                        <Check className="size-3.5 shrink-0 text-primary" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-3 text-xs opacity-60 transition-opacity group-hover:opacity-0">
                  {ref.solutions.length} solution{ref.solutions.length > 1 ? "s" : ""} installée
                  {ref.solutions.length > 1 ? "s" : ""}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Commitments() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <Reveal className="ink-panel relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 opacity-50" style={GRID_BG} aria-hidden />
        <div className="relative grid gap-10 p-8 md:p-14 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow light>Nos engagements</Eyebrow>
            <h2 className="mt-3 text-3xl text-ink-foreground md:text-4xl">
              La qualité, l'offre et le service comme références
            </h2>
            <p className="mt-4 opacity-80">
              Notre ambition : être la référence nationale de la sécurité électronique, en restant
              toujours à jour des évolutions technologiques.
            </p>
          </div>
          <ul className="space-y-3">
            {COMMITMENTS.map((c, i) => (
              <Reveal as="li" key={c} delay={i * 90}>
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-colors duration-250 hover:border-primary/50">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-4" />
                  </span>
                  <span className="text-sm md:text-base">{c}</span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

function Faq() {
  return (
    <section className="bg-surface py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <Eyebrow>Questions fréquentes</Eyebrow>
          <h2 className="mt-3 text-3xl md:text-4xl">Vous avez des questions ?</h2>
          <p className="mt-4 text-muted-foreground">
            Vous ne trouvez pas votre réponse ? Notre équipe vous répond par téléphone ou sur
            WhatsApp.
          </p>
          <Button asChild variant="outline" className="press mt-6">
            <Link to="/contact">
              <MessageSquare className="size-4" /> Nous contacter
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={100}>
          <Accordion type="single" collapsible defaultValue="faq-0" className="rounded-2xl bg-background px-6">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-base hover:text-primary hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  const phone = SITE.phones[0];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <Reveal className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-primary-foreground md:px-16">
        <div
          className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-16 size-80 rounded-full bg-black/10 blur-2xl"
          aria-hidden
        />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl">Parlons de votre projet</h2>
            <p className="mt-4 max-w-xl opacity-90">
              Envoyez-nous votre besoin ou votre cahier des charges : nous revenons vers vous avec
              une proposition complète et adaptée.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg" variant="secondary" className="press group">
              <Link to="/devis">
                Demander un devis
                <ArrowRight className="size-4 transition-transform duration-250 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="press border-white/40 bg-transparent text-primary-foreground hover:bg-white/10"
            >
              <a
                href={whatsappLink("Bonjour DISTRICAP, je souhaite échanger sur un projet.")}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquare className="size-4" /> Écrire sur WhatsApp
              </a>
            </Button>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium opacity-90 hover:opacity-100"
              >
                <Phone className="size-4" /> {phone}
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ServicesPage() {
  return (
    <>
      <Hero />
      <ServicesBento />
      <Method />
      <Expertises />
      <Audiences />
      <References />
      <Commitments />
      <Faq />
      <FinalCta />
    </>
  );
}