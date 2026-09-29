import { createFileRoute, Link } from "@tanstack/react-router";
import { AMBIANCE } from "@/lib/images";
import { CountUp, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos – DISTRICAP, distributeur depuis 2009" },
      {
        name: "description",
        content:
          "DISTRICAP distribue au Maroc du matériel informatique, audiovisuel et de sécurité électronique depuis 2009. Exclusivités de marques et accompagnement de projet.",
      },
      { property: "og:title", content: "À propos – DISTRICAP" },
      {
        property: "og:description",
        content: "Notre histoire depuis 2009, nos valeurs et nos références projets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    title: "Expertise technique",
    text: "Une équipe formée par les constructeurs, capable de dimensionner une installation complète.",
  },
  {
    title: "Disponibilité produit",
    text: "Un stock permanent à Casablanca pour livrer rapidement partout au Maroc.",
  },
  {
    title: "Proximité client",
    text: "Un interlocuteur dédié, du premier conseil jusqu'au support après installation.",
  },
];

const PROJECTS = ["ALMAZAR Marrakech", "Marina Mall", "Aeria Mall"];

function AboutPage() {
  return (
    <div>
      <section className="relative h-72 overflow-hidden bg-ink">
        <img
          src={AMBIANCE.videosurveillance}
          alt=""
          width={1600}
          height={912}
          className="size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 text-ink-foreground">
          <h1 className="text-4xl">Districap, partenaire de vos projets depuis 2009</h1>
          <p className="mt-3 max-w-2xl opacity-90">
            Distributeur casablancais de matériel informatique, audiovisuel et de sécurité
            électronique.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl">Notre histoire</h2>
            <p className="mt-4 text-muted-foreground">
              Créée en 2009 à Casablanca, DISTRICAP s'est construite autour d'une idée
              simple : rendre accessible aux professionnels marocains un matériel de
              sécurité et d'audiovisuel fiable, accompagné d'un vrai conseil technique.
            </p>
            <p className="mt-3 text-muted-foreground">
              Aujourd'hui, nous distribuons les gammes de constructeurs internationaux
              reconnus et accompagnons installateurs, intégrateurs, entreprises et
              administrations sur l'ensemble du territoire.
            </p>
          </Reveal>
          <Reveal delay={120} className="grid grid-cols-2 gap-5">
            <div className="card-surface p-6">
              <p className="text-4xl font-bold text-primary">
                <CountUp to={16} suffix="+" />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">ans d'activité</p>
            </div>
            <div className="card-surface p-6">
              <p className="text-4xl font-bold text-primary">
                <CountUp to={9} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">marques distribuées</p>
            </div>
            <div className="card-surface p-6">
              <p className="text-4xl font-bold text-primary">
                <CountUp to={8} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">familles de produits</p>
            </div>
            <div className="card-surface p-6">
              <p className="text-4xl font-bold text-primary">
                <CountUp to={100} suffix="%" />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">du Maroc livré</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl">Nos valeurs</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 70} className="card-surface p-6">
                <h3 className="text-lg">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl">Quelques références</h2>
        <p className="mt-2 text-muted-foreground">
          Des projets d'équipement livrés pour de grands sites commerciaux marocains.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project} delay={i * 70} className="card-surface p-6">
              <p className="font-semibold">{project}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Fourniture d'équipements de sécurité et d'audiovisuel.
              </p>
            </Reveal>
          ))}
        </div>
        <Button asChild className="mt-10">
          <Link to="/devis">Parler de votre projet</Link>
        </Button>
      </section>
    </div>
  );
}
