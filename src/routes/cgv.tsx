import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente – DISTRICAP" },
      {
        name: "description",
        content:
          "Conditions générales de vente DISTRICAP : commandes, prix en MAD, paiement à la livraison, délais, garantie et retours.",
      },
      { property: "og:title", content: "Conditions générales de vente – DISTRICAP" },
      {
        property: "og:description",
        content: "Commandes, paiement à la livraison, livraison, garantie et retours.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CgvPage,
});

const SECTIONS = [
  {
    title: "1. Objet",
    text: "Les présentes conditions régissent les ventes de matériel réalisées par DISTRICAP auprès de ses clients professionnels et particuliers au Maroc.",
  },
  {
    title: "2. Commandes",
    text: "Toute commande passée sur le site est confirmée par téléphone par notre équipe. Une commande n'est définitive qu'après cette confirmation et la validation de la disponibilité des produits.",
  },
  {
    title: "3. Prix",
    text: "Les prix sont indiqués en dirhams marocains (MAD), toutes taxes comprises. Certaines références techniques sont affichées « Sur devis » et font l'objet d'une proposition personnalisée.",
  },
  {
    title: "4. Paiement",
    text: "Le règlement s'effectue en espèces à la livraison. Pour les marchés et projets d'entreprise, un paiement par virement peut être convenu lors de l'établissement du devis.",
  },
  {
    title: "5. Livraison",
    text: "Nous livrons partout au Maroc depuis notre dépôt de Casablanca. Les frais de livraison sont confirmés lors de la validation de la commande et dépendent de la ville et du volume.",
  },
  {
    title: "6. Garantie",
    text: "Les produits bénéficient de la garantie constructeur en vigueur. Elle ne couvre pas les dommages liés à une mauvaise installation, à une surtension ou à un usage non conforme.",
  },
  {
    title: "7. Retours",
    text: "Toute demande de retour doit être signalée sous 7 jours à compter de la réception, produit complet dans son emballage d'origine.",
  },
];

function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Conditions générales de vente</h1>
      <div className="mt-8 space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg">{section.title}</h2>
            <p className="mt-2 text-muted-foreground">{section.text}</p>
          </section>
        ))}
        <section>
          <h2 className="text-lg">8. Contact</h2>
          <p className="mt-2 text-muted-foreground">
            Pour toute question relative à une commande : {SITE.email} — {SITE.phones[0]}.
            Adresse : {SITE.address}.
          </p>
        </section>
      </div>
    </div>
  );
}
