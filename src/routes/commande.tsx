import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, isValidMoroccanPhone } from "@/lib/format";
import { generateOrderNumber, saveOrder, type OrderCustomer } from "@/lib/order";
import { MOROCCAN_CITIES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Commande – paiement à la livraison – DISTRICAP" },
      {
        name: "description",
        content:
          "Finalisez votre commande DISTRICAP : livraison partout au Maroc et règlement en espèces à la réception.",
      },
      { property: "og:title", content: "Commande – DISTRICAP" },
      {
        property: "og:description",
        content: "Commande en ligne avec paiement à la livraison partout au Maroc.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

type Fields = OrderCustomer;

const EMPTY: Fields = {
  full_name: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, clear } = useCart();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});

  const required: (keyof Fields)[] = ["full_name", "phone", "email", "city", "address"];
  const progress = useMemo(
    () => (required.filter((key) => fields[key].trim()).length / required.length) * 100,
    [fields],
  );

  const set = (key: keyof Fields) => (value: string) => setFields((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.full_name.trim()) next.full_name = "Merci d'indiquer votre nom complet.";
    if (!isValidMoroccanPhone(fields.phone))
      next.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "Adresse e-mail invalide.";
    if (!fields.city) next.city = "Choisissez votre ville.";
    if (fields.address.trim().length < 10) next.address = "Adresse trop courte.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const orderNumber = generateOrderNumber();
    saveOrder({
      number: orderNumber,
      createdAt: new Date().toISOString(),
      customer: fields,
      lines,
      total: subtotal,
    });
    clear();
    navigate({ to: "/confirmation/$numero", params: { numero: orderNumber } });
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">Ajoutez des produits avant de passer commande.</p>
        <Button asChild className="mt-6">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  const field = (key: keyof Fields, label: string, type = "text", optional = false) => (
    <div>
      <label className="text-sm font-medium" htmlFor={key}>
        {label}
        {optional && <span className="text-muted-foreground"> (facultatif)</span>}
      </label>
      <Input
        id={key}
        type={type}
        value={fields[key]}
        onChange={(e) => set(key)(e.target.value)}
        className={cn("mt-1", errors[key] && "border-primary")}
        aria-invalid={Boolean(errors[key])}
      />
      {errors[key] && <p className="mt-1 text-xs text-primary">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl">Finaliser la commande</h1>

      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="card-surface space-y-5 p-6" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("full_name", "Nom complet")}
            {field("company", "Société", "text", true)}
            {field("phone", "Téléphone", "tel")}
            {field("email", "E-mail", "email")}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="city">
              Ville
            </label>
            <select
              id="city"
              value={fields.city}
              onChange={(e) => set("city")(e.target.value)}
              className={cn(
                "mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
                errors.city && "border-primary",
              )}
            >
              <option value="">Choisir une ville…</option>
              {MOROCCAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p className="mt-1 text-xs text-primary">{errors.city}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="address">
              Adresse complète
            </label>
            <Textarea
              id="address"
              value={fields.address}
              onChange={(e) => set("address")(e.target.value)}
              className={cn("mt-1", errors.address && "border-primary")}
              rows={3}
            />
            {errors.address && <p className="mt-1 text-xs text-primary">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor="notes">
              Notes <span className="text-muted-foreground">(facultatif)</span>
            </label>
            <Textarea
              id="notes"
              value={fields.notes}
              onChange={(e) => set("notes")(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="rounded-md border border-border bg-surface p-4 text-sm">
            <p className="font-semibold">Mode de paiement : paiement à la livraison</p>
            <p className="mt-1 text-muted-foreground">
              Vous réglez votre commande en espèces au moment de la réception.
            </p>
          </div>

          <Button type="submit" size="lg" className="press w-full">
            Valider ma commande
          </Button>
        </form>

        <aside className="card-surface h-fit p-6 lg:sticky lg:top-40">
          <h2 className="text-lg">Votre commande</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.slug} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate">{line.name}</span>
                  <span className="text-muted-foreground">Qté {line.quantity}</span>
                </span>
                <span className="shrink-0 font-semibold">
                  {formatPrice((line.price ?? 0) * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total TTC</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Frais de livraison confirmés à la commande.
          </p>
        </aside>
      </div>
    </div>
  );
}
