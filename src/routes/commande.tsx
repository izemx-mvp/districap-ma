import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Banknote, Pencil, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, isValidMoroccanPhone } from "@/lib/format";
import { generateOrderNumber, saveOrder, type OrderCustomer } from "@/lib/order";
import { EMAIL_RE, useFormState } from "@/lib/use-form";
import { CityCombobox } from "@/components/forms/CityCombobox";
import { Field } from "@/components/forms/Field";
import { StepIndicator } from "@/components/forms/Steps";
import { Button } from "@/components/ui/button";
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
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutPage,
});

const EMPTY: OrderCustomer = {
  full_name: "",
  company: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
};

const STEPS = ["Coordonnées", "Livraison & récapitulatif"];
const STEP_FIELDS: (keyof OrderCustomer)[][] = [
  ["full_name", "phone", "email"],
  ["city", "address"],
];

function validate(v: OrderCustomer) {
  const errors: Partial<Record<keyof OrderCustomer, string>> = {};
  if (v.full_name.trim().length < 3) errors.full_name = "Merci d'indiquer votre nom complet.";
  if (!isValidMoroccanPhone(v.phone))
    errors.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (!v.city.trim()) errors.city = "Choisissez votre ville.";
  if (v.address.trim().length < 10)
    errors.address = "Précisez votre adresse (rue, numéro, quartier).";
  return errors;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { lines, subtotal, clear, hydrated } = useCart();
  const form = useFormState(EMPTY, useCallback(validate, []));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const topRef = useRef<HTMLDivElement>(null);

  const goTo = (next: number) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const next = () => {
    if (form.check(STEP_FIELDS[0]!)) goTo(1);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (step === 0) return next();
    if (!form.check(STEP_FIELDS[1]!)) return;
    if (!form.check(STEP_FIELDS[0]!)) return goTo(0);

    const orderNumber = generateOrderNumber();
    const trimmed = Object.fromEntries(
      Object.entries(form.values).map(([k, v]) => [k, v.trim()]),
    ) as OrderCustomer;
    saveOrder({
      number: orderNumber,
      createdAt: new Date().toISOString(),
      customer: trimmed,
      lines,
      total: subtotal,
    });
    clear();
    navigate({ to: "/confirmation/$numero", params: { numero: orderNumber } });
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10" aria-busy="true">
        <div className="shimmer h-9 w-64 rounded" />
        <div className="shimmer mt-8 h-96 rounded-xl" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rise-in mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingCart className="float-soft mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-6 text-2xl">Votre panier est vide</h1>
        <p className="mt-2 text-muted-foreground">Ajoutez des produits avant de passer commande.</p>
        <Button asChild className="mt-6">
          <Link to="/">Retour à l'accueil</Link>
        </Button>
      </div>
    );
  }

  const v = form.values;

  return (
    <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-32 px-4 py-10">
      <h1 className="text-3xl">Finaliser ma commande</h1>
      <div className="mt-6 max-w-xl">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} noValidate className="card-surface overflow-hidden p-6">
          <div key={step} className={direction === "forward" ? "step-in-right" : "step-in-left"}>
            {step === 0 ? (
              <fieldset className="space-y-4">
                <legend className="mb-4 text-lg font-bold">Vos coordonnées</legend>
                <Field label="Nom complet" autoComplete="name" {...form.field("full_name")} />
                <Field
                  label="Société"
                  optional
                  autoComplete="organization"
                  {...form.field("company")}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Téléphone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    hint="Pour confirmer la commande et la livraison."
                    {...form.field("phone")}
                  />
                  <Field
                    label="E-mail"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    {...form.field("email")}
                  />
                </div>
              </fieldset>
            ) : (
              <fieldset className="space-y-4">
                <legend className="mb-4 text-lg font-bold">Livraison</legend>
                <div className="flex items-start justify-between gap-3 rounded-md bg-surface p-3 text-sm">
                  <p>
                    <span className="font-semibold">{v.full_name}</span>
                    {v.company && ` · ${v.company}`}
                    <br />
                    <span className="text-muted-foreground">
                      {v.phone} · {v.email}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => goTo(0)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <Pencil className="size-3" /> Modifier
                  </button>
                </div>
                <CityCombobox {...form.field("city")} />
                <Field
                  label="Adresse complète"
                  multiline
                  rows={3}
                  autoComplete="street-address"
                  {...form.field("address")}
                />
                <Field label="Remarques" optional multiline rows={3} {...form.field("notes")} />
                <div className="rounded-md border border-border bg-surface p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold">
                    <Banknote className="size-4 text-primary" /> Paiement à la livraison
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Vous réglez votre commande en espèces au moment de la réception. Les frais de
                    livraison vous sont confirmés par notre équipe.
                  </p>
                </div>
              </fieldset>
            )}
          </div>

          <div
            className={cn(
              "mt-6 flex flex-col-reverse gap-3 sm:flex-row",
              step === 0 ? "sm:justify-end" : "sm:justify-between",
            )}
          >
            {step === 1 && (
              <Button type="button" variant="ghost" onClick={() => goTo(0)}>
                <ArrowLeft className="size-4" /> Retour
              </Button>
            )}
            <Button type="submit" size="lg" className="press group">
              {step === 0 ? (
                <>
                  Continuer
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                "Valider ma commande"
              )}
            </Button>
          </div>
        </form>

        <aside className="card-surface p-6 lg:sticky lg:top-32" aria-label="Votre commande">
          <h2 className="text-lg">Votre commande</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((line) => (
              <li key={line.slug} className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <img
                    src={line.image}
                    alt=""
                    width={48}
                    height={48}
                    className="size-12 rounded-md border border-border bg-background object-contain"
                  />
                  <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-ink-foreground">
                    {line.quantity}
                  </span>
                </span>
                <span className="line-clamp-2 min-w-0 flex-1">{line.name}</span>
                <span className="shrink-0 font-semibold">
                  {line.price === null ? "Sur devis" : formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
            <span>Total TTC</span>
            <span className="text-primary">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Frais de livraison confirmés par notre équipe.
          </p>
          <Link
            to="/panier"
            className="mt-4 inline-flex text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Modifier le panier
          </Link>
        </aside>
      </div>
    </div>
  );
}
