import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/confirmation/$numero")({
  head: () => ({
    meta: [
      { title: "Commande confirmée – DISTRICAP" },
      {
        name: "description",
        content:
          "Votre commande DISTRICAP est enregistrée. Notre équipe vous contacte pour confirmer la livraison et les frais d'expédition.",
      },
      { property: "og:title", content: "Commande confirmée – DISTRICAP" },
      {
        property: "og:description",
        content: "Merci pour votre commande, notre équipe vous rappelle rapidement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { numero } = Route.useParams();

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <svg viewBox="0 0 64 64" className="mx-auto size-20" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          opacity="0.3"
        />
        <path
          d="M18 33l10 10 18-20"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="draw-check"
        />
      </svg>

      <h1 className="mt-8 text-3xl">Merci, votre commande est enregistrée</h1>
      <p className="rise-in mt-4 text-muted-foreground" style={{ animationDelay: "500ms" }}>
        Numéro de commande :{" "}
        <span className="font-bold text-foreground">{numero}</span>
      </p>
      <p className="mt-4 text-muted-foreground">
        Notre équipe vous appelle pour confirmer votre commande, les délais et les frais de
        livraison. Le règlement se fait en espèces à la réception.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Une question ? Écrivez-nous à {SITE.email} ou appelez le {SITE.phones[0]}.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link to="/">Retour à l'accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  );
}
