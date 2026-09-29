import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, Headset, LifeBuoy, PackageCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services – étude, fourniture et support – DISTRICAP" },
      {
        name: "description",
        content:
          "Étude de projet, fourniture de matériel, conseil technique, livraison partout au Maroc et support après-vente par DISTRICAP.",
      },
      { property: "og:title", content: "Nos services – DISTRICAP" },
      {
        property: "og:description",
        content: "De l'étude technique au support après-vente, nous accompagnons vos projets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: ClipboardList,
    title: "Étude de projet",
    text: "Analyse du site, dimensionnement des équipements, schémas de principe et chiffrage détaillé.",
  },
  {
    icon: PackageCheck,
    title: "Fourniture de matériel",
    text: "Un stock permanent de caméras, centrales, enregistreurs, sonorisation et matériel réseau.",
  },
  {
    icon: Headset,
    title: "Conseil technique",
    text: "Nos ingénieurs vous aident à choisir les références adaptées à vos contraintes et à votre budget.",
  },
  {
    icon: Truck,
    title: "Livraison",
    text: "Expédition partout au Maroc depuis Casablanca, avec paiement à la livraison.",
  },
  {
    icon: LifeBuoy,
    title: "Support après-vente",
    text: "Assistance à la mise en service, garantie constructeur et suivi des retours.",
  },
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl">Nos services</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        DISTRICAP ne se limite pas à la vente de matériel : nous vous accompagnons à chaque
        étape de votre projet d'équipement.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 70} className="card-surface p-6">
            <span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
              <service.icon className="size-5" />
            </span>
            <h2 className="mt-4 text-lg">{service.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{service.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="ink-panel mt-14 rounded-2xl px-6 py-12 text-center md:px-16">
        <h2 className="text-2xl text-ink-foreground">Besoin d'une étude personnalisée ?</h2>
        <p className="mx-auto mt-3 max-w-xl opacity-85">
          Envoyez-nous votre cahier des charges : nous revenons vers vous avec une
          proposition complète.
        </p>
        <Button asChild className="mt-6">
          <Link to="/devis">Demander un devis</Link>
        </Button>
      </Reveal>
    </div>
  );
}
