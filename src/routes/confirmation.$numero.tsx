import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { findOrder, orderWhatsappMessage, type LocalOrder } from "@/lib/order";
import { SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/confirmation/$numero")({
  head: () => ({
    meta: [
      { title: "Commande enregistrée – DISTRICAP" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "Votre commande DISTRICAP est enregistrée. Confirmez-la sur WhatsApp pour que notre équipe organise la livraison.",
      },
      { property: "og:title", content: "Commande confirmée – DISTRICAP" },
      {
        property: "og:description",
        content: "Merci pour votre commande DISTRICAP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { numero } = Route.useParams();
  const [order, setOrder] = useState<LocalOrder | null>(null);

  useEffect(() => {
    setOrder(findOrder(numero) ?? null);
  }, [numero]);

  const whatsappMessage = order
    ? orderWhatsappMessage(order)
    : `Bonjour DISTRICAP, je souhaite confirmer ma commande ${numero}.`;

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
        Numéro de commande : <span className="font-bold text-foreground">{numero}</span>
      </p>
      <p className="mt-4 text-muted-foreground">
        Pour finaliser, envoyez-nous le récapitulatif sur WhatsApp : notre équipe vous confirmera
        ensuite la livraison et ses frais. Le règlement se fait en espèces à la réception.
      </p>

      {order && (
        <div className="card-surface mt-8 p-5 text-left">
          <h2 className="text-lg">Récapitulatif</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {order.lines.map((line) => (
              <li key={line.slug} className="flex justify-between gap-4 py-2">
                <span>
                  {line.quantity} × {line.name}
                </span>
                <span className="shrink-0 font-medium">
                  {line.price === null ? "Sur devis" : formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total TTC</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Livraison à {order.customer.city} pour {order.customer.full_name}
          </p>
        </div>
      )}
      <p className="mt-2 text-sm text-muted-foreground">
        Une question ? Écrivez-nous à {SITE.email} ou appelez le {SITE.phones[0]}.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild className="glow-pulse">
          <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noreferrer">
            Confirmer sur WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Continuer mes achats</Link>
        </Button>
      </div>
    </div>
  );
}
