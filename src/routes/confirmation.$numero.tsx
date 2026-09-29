import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Copy, Check } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { findOrder, orderWhatsappMessage, type LocalOrder } from "@/lib/order";
import { SITE, whatsappLink } from "@/lib/site";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { SuccessCheck } from "@/components/SuccessCheck";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
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
      { property: "og:title", content: "Commande enregistrée – DISTRICAP" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { numero } = Route.useParams();
  const [order, setOrder] = useState<LocalOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrder(findOrder(numero) ?? null);
  }, [numero]);

  const whatsappMessage = order
    ? orderWhatsappMessage(order)
    : `Bonjour DISTRICAP, je souhaite confirmer ma commande ${numero}.`;

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(numero);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-20">
      <div className="relative mx-auto size-20">
        <ConfettiBurst className="pointer-events-none absolute inset-0" />
        <SuccessCheck className="relative size-20" />
      </div>

      <h1 className="rise-in mt-8 text-3xl" style={{ animationDelay: "200ms" }}>
        Merci, votre commande est enregistrée
      </h1>
      <div
        className="rise-in mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pr-1.5 pl-4 text-sm"
        style={{ animationDelay: "350ms" }}
      >
        Numéro de commande : <span className="font-bold">{numero}</span>
        <button
          type="button"
          onClick={copyNumber}
          aria-label="Copier le numéro de commande"
          className="press grid size-7 place-items-center rounded-full hover:bg-muted"
        >
          {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </button>
      </div>
      <p className="rise-in mt-5 text-muted-foreground" style={{ animationDelay: "450ms" }}>
        Pour finaliser, envoyez-nous le récapitulatif sur WhatsApp : notre équipe vous confirmera
        ensuite la livraison et ses frais. Le règlement se fait en espèces à la réception.
      </p>

      <div
        className="rise-in mt-8 flex flex-wrap justify-center gap-3"
        style={{ animationDelay: "550ms" }}
      >
        <Button
          asChild
          size="lg"
          className="glow-pulse press bg-[#0f7a5a] text-white hover:bg-[#0c6a4e]"
        >
          <a href={whatsappLink(whatsappMessage)} target="_blank" rel="noreferrer">
            <WhatsAppGlyph className="size-5" /> Confirmer sur WhatsApp
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="group">
          <Link to="/">
            Continuer mes achats
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>

      {order && (
        <div
          className="card-surface rise-in mt-10 p-5 text-left"
          style={{ animationDelay: "650ms" }}
        >
          <h2 className="text-lg">Récapitulatif</h2>
          <ul className="mt-3 divide-y divide-border text-sm">
            {order.lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3 py-2.5">
                <img
                  src={line.image}
                  alt=""
                  width={40}
                  height={40}
                  className="size-10 shrink-0 rounded border border-border bg-background object-contain"
                />
                <span className="min-w-0 flex-1">
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
            Livraison à {order.customer.city} pour {order.customer.full_name} ·{" "}
            {order.customer.phone}
          </p>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Une question ? Écrivez-nous à{" "}
        <a href={`mailto:${SITE.email}`} className="font-medium text-foreground hover:text-primary">
          {SITE.email}
        </a>{" "}
        ou appelez le{" "}
        <a
          href={`tel:${SITE.phones[0]?.replace(/\s/g, "")}`}
          className="font-medium text-foreground hover:text-primary"
        >
          {SITE.phones[0]}
        </a>
        .
      </p>
    </div>
  );
}
