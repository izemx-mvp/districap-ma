import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité – DISTRICAP" },
      {
        name: "description",
        content:
          "Comment DISTRICAP collecte, utilise et protège vos données personnelles lors de vos commandes et demandes de devis.",
      },
      { property: "og:title", content: "Politique de confidentialité – DISTRICAP" },
      {
        property: "og:description",
        content: "Traitement et protection de vos données personnelles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "Données collectées",
    text: "Nous collectons uniquement les informations nécessaires au traitement de vos commandes et demandes : nom, société, téléphone, e-mail, ville, adresse de livraison et description de projet.",
  },
  {
    title: "Utilisation des données",
    text: "Vos données servent à traiter vos commandes, établir vos devis, assurer la livraison et vous recontacter. Elles ne sont jamais vendues à des tiers.",
  },
  {
    title: "Cookies",
    text: "Le site utilise des cookies techniques nécessaires à son fonctionnement et des cookies de mesure d'audience. Vous pouvez les refuser via la bannière affichée lors de votre première visite.",
  },
  {
    title: "Conservation",
    text: "Les données de commande sont conservées le temps nécessaire au suivi commercial et comptable, conformément à la réglementation marocaine.",
  },
  {
    title: "Vos droits",
    text: "Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Politique de confidentialité</h1>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg">{section.title}</h2>
            <p className="mt-2 text-muted-foreground">{section.text}</p>
          </section>
        ))}
        <section>
          <h2 className="text-lg">Nous écrire</h2>
          <p className="mt-2 text-muted-foreground">
            Pour exercer vos droits : {SITE.email} — {SITE.phones[0]}.
          </p>
        </section>
      </div>
    </div>
  );
}
