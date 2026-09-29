import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Cctv,
  Fingerprint,
  Flame,
  Mail,
  Network,
  Paperclip,
  Projector,
  Siren,
  Sparkles,
  Speaker,
  UploadCloud,
  X,
  type LucideIcon,
} from "lucide-react";
import { isValidMoroccanPhone } from "@/lib/format";
import { summaryMessage } from "@/lib/order";
import { BUDGET_RANGES, PROJECT_TYPES, SITE, whatsappLink } from "@/lib/site";
import { EMAIL_RE, useFormState } from "@/lib/use-form";
import { CityCombobox } from "@/components/forms/CityCombobox";
import { Field, FieldError, Shake } from "@/components/forms/Field";
import { ProgressBar } from "@/components/forms/Steps";
import { SuccessCheck } from "@/components/SuccessCheck";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Demander un devis gratuit – DISTRICAP" },
      {
        name: "description",
        content:
          "Décrivez votre projet de vidéosurveillance, incendie, sonorisation ou réseau : DISTRICAP vous répond avec un devis chiffré et adapté à votre site.",
      },
      { property: "og:title", content: "Demander un devis gratuit – DISTRICAP" },
      {
        property: "og:description",
        content: "Étude de votre besoin et devis gratuit pour vos projets au Maroc.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});

const PROJECT_ICONS: Record<string, LucideIcon> = {
  Vidéosurveillance: Cctv,
  "Détection incendie": Flame,
  "Alarme & Intrusion": Siren,
  "Contrôle d'accès": Fingerprint,
  Sonorisation: Speaker,
  Audiovisuel: Projector,
  "Informatique & Réseau": Network,
  Autre: Sparkles,
};

type QuoteFields = {
  project_type: string;
  budget: string;
  city: string;
  description: string;
  full_name: string;
  company: string;
  email: string;
  phone: string;
};

const EMPTY: QuoteFields = {
  project_type: "",
  budget: "",
  city: "",
  description: "",
  full_name: "",
  company: "",
  email: "",
  phone: "",
};

const STEPS: { title: string; fields: (keyof QuoteFields)[] }[] = [
  { title: "Votre projet", fields: ["project_type"] },
  { title: "Votre besoin", fields: ["description"] },
  { title: "Vos coordonnées", fields: ["full_name", "email", "phone"] },
];

function validate(v: QuoteFields) {
  const errors: Partial<Record<keyof QuoteFields, string>> = {};
  if (!v.project_type) errors.project_type = "Choisissez un type de projet.";
  if (v.description.trim().length < 15)
    errors.description = "Décrivez votre besoin en quelques lignes (15 caractères minimum).";
  if (v.full_name.trim().length < 3) errors.full_name = "Indiquez votre nom complet.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (!isValidMoroccanPhone(v.phone))
    errors.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
  return errors;
}

function QuotePage() {
  const form = useFormState(EMPTY, useCallback(validate, []));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [sent, setSent] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const v = form.values;

  const goTo = (next: number) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  };

  const addFiles = (list: FileList | null | undefined) => {
    const names = Array.from(list ?? []).map((f) => f.name);
    setFiles((current) => [...current, ...names.filter((n) => !current.includes(n))]);
  };

  const summary = summaryMessage("Bonjour DISTRICAP, je souhaite recevoir un devis.", [
    ["Type de projet", v.project_type],
    ["Budget estimé", v.budget],
    ["Ville", v.city],
    ["Besoin", v.description],
    ["Documents à transmettre", files.join(", ")],
    ["Nom", v.full_name],
    ["Société", v.company],
    ["E-mail", v.email],
    ["Téléphone", v.phone],
  ]);
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Demande de devis – ${v.project_type || "projet"}`,
  )}&body=${encodeURIComponent(summary)}`;

  const validateAll = () => {
    for (let i = 0; i < STEPS.length; i++) {
      if (!form.check(STEPS[i]!.fields)) {
        if (i !== step) goTo(i);
        return false;
      }
    }
    return true;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (step < STEPS.length - 1) {
      if (form.check(STEPS[step]!.fields)) goTo(step + 1);
      return;
    }
    if (validateAll()) setSent(true);
  };

  const sendWhatsapp = () => {
    if (!validateAll()) return;
    window.open(whatsappLink(summary), "_blank", "noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <SuccessCheck />
        <h1 className="rise-in mt-6 text-2xl">Merci, votre demande de devis est prête</h1>
        <p className="rise-in mt-3 text-muted-foreground" style={{ animationDelay: "120ms" }}>
          Transmettez-la à notre équipe via WhatsApp ou par e-mail : nous revenons vers vous avec
          une proposition adaptée à votre projet.
        </p>
        {files.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Vos documents ({files.join(", ")}) vous seront demandés par notre équipe.
          </p>
        )}
        <div
          className="rise-in mt-8 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <Button asChild size="lg" className="bg-[#0f7a5a] text-white hover:bg-[#0c6a4e]">
            <a href={whatsappLink(summary)} target="_blank" rel="noreferrer">
              <WhatsAppGlyph className="size-5" /> Envoyer via WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={mailto}>
              <Mail className="size-4" /> Envoyer par e-mail
            </a>
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Modifier ma demande
        </button>
      </div>
    );
  }

  const typeError = form.touched.project_type ? form.errors.project_type : undefined;

  return (
    <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-32 px-4 py-12">
      <h1 className="text-3xl">Demander un devis gratuit</h1>
      <p className="mt-3 text-muted-foreground">
        Vidéosurveillance, détection incendie, sonorisation, réseau : décrivez votre projet et
        recevez une proposition chiffrée adaptée à votre site.
      </p>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">
            Étape {step + 1} sur {STEPS.length} · {STEPS[step]!.title}
          </span>
          <span className="text-muted-foreground">
            {Math.round(((step + 1) / STEPS.length) * 100)} %
          </span>
        </div>
        <ProgressBar value={((step + 1) / STEPS.length) * 100} label="Progression du formulaire" />
      </div>

      <form onSubmit={onSubmit} noValidate className="card-surface mt-6 overflow-hidden p-6">
        <div key={step} className={direction === "forward" ? "step-in-right" : "step-in-left"}>
          {step === 0 && (
            <div className="space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold">Type de projet</legend>
                <Shake active={Boolean(typeError)} trigger={form.attempt}>
                  <div
                    role="radiogroup"
                    aria-label="Type de projet"
                    aria-describedby={typeError ? "project_type-error" : undefined}
                    className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4"
                  >
                    {PROJECT_TYPES.map((type) => {
                      const Icon = PROJECT_ICONS[type] ?? Sparkles;
                      const selected = v.project_type === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => form.set("project_type", type)}
                          className={cn(
                            "press group flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center text-sm font-medium transition-colors duration-200",
                            selected
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/40",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-11 place-items-center rounded-full transition-all duration-300",
                              selected
                                ? "scale-110 bg-primary text-primary-foreground"
                                : "bg-muted text-foreground group-hover:scale-105",
                            )}
                          >
                            <Icon className="size-5" />
                          </span>
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </Shake>
                <FieldError id="project_type" error={typeError} />
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold">
                  Budget estimé{" "}
                  <span className="font-normal text-muted-foreground">(facultatif)</span>
                </legend>
                <div
                  className="mt-3 flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Budget estimé"
                >
                  {BUDGET_RANGES.map((budget) => {
                    const selected = v.budget === budget;
                    return (
                      <button
                        key={budget}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => form.set("budget", selected ? "" : budget)}
                        className={cn(
                          "press rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        {budget}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="max-w-sm">
                <CityCombobox {...form.field("city")} error={undefined} valid={Boolean(v.city)} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <Field
                label="Description du besoin"
                multiline
                rows={6}
                hint="Nombre de caméras, surface à couvrir, contraintes du site, délais…"
                {...form.field("description")}
              />

              <div>
                <span className="text-sm font-semibold">
                  Documents <span className="font-normal text-muted-foreground">(facultatif)</span>
                </span>
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    addFiles(e.dataTransfer.files);
                  }}
                  className={cn(
                    "mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors duration-250 focus-within:border-primary",
                    dragging
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50",
                  )}
                >
                  <UploadCloud
                    className={cn(
                      "size-8 transition-transform duration-300",
                      dragging ? "-translate-y-1 scale-110 text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span>
                    <span className="font-semibold text-foreground">Glissez vos fichiers ici</span>{" "}
                    ou cliquez pour choisir
                  </span>
                  <span className="text-xs">Plans, cahier des charges, photos du site…</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>
                {files.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {files.map((name) => (
                      <li
                        key={name}
                        className="chip-in inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary/10 py-1 pr-1 pl-3 text-xs text-primary"
                      >
                        <Paperclip className="size-3 shrink-0" />
                        <span className="truncate">{name}</span>
                        <button
                          type="button"
                          aria-label={`Retirer ${name}`}
                          onClick={() => setFiles((current) => current.filter((n) => n !== name))}
                          className="rounded-full p-0.5 hover:bg-primary/15"
                        >
                          <X className="size-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Les fichiers ne sont pas envoyés depuis le site : notre équipe vous les demandera
                  lors de l'échange.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nom complet" autoComplete="name" {...form.field("full_name")} />
                <Field
                  label="Société"
                  optional
                  autoComplete="organization"
                  {...form.field("company")}
                />
                <Field
                  label="E-mail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...form.field("email")}
                />
                <Field
                  label="Téléphone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  {...form.field("phone")}
                />
              </div>
              <div className="rounded-md bg-surface p-4 text-sm">
                <p className="font-semibold">Votre demande</p>
                <p className="mt-1 text-muted-foreground">
                  {v.project_type}
                  {v.budget && ` · ${v.budget}`}
                  {v.city && ` · ${v.city}`}
                </p>
                <p className="mt-1 line-clamp-2 text-muted-foreground">{v.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
              <ArrowLeft className="size-4" /> Retour
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col gap-3 sm:flex-row">
            {step === STEPS.length - 1 && (
              <Button type="button" size="lg" variant="outline" onClick={sendWhatsapp}>
                <WhatsAppGlyph className="size-4" /> Envoyer via WhatsApp
              </Button>
            )}
            <Button type="submit" size="lg" className="press group">
              {step < STEPS.length - 1 ? (
                <>
                  Continuer
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              ) : (
                "Envoyer ma demande"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
