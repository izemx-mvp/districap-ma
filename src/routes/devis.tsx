import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { isValidMoroccanPhone } from "@/lib/format";
import { summaryMessage } from "@/lib/order";
import { BUDGET_RANGES, MOROCCAN_CITIES, PROJECT_TYPES, SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SuccessCheck } from "@/components/SuccessCheck";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/devis")({
  head: () => ({
    meta: [
      { title: "Demander un devis gratuit – DISTRICAP" },
      {
        name: "description",
        content:
          "Décrivez votre projet de vidéosurveillance, incendie, sonorisation ou réseau : DISTRICAP vous répond sous 24 heures ouvrées avec un devis chiffré.",
      },
      { property: "og:title", content: "Demander un devis gratuit – DISTRICAP" },
      {
        property: "og:description",
        content: "Étude technique et devis gratuit pour vos projets au Maroc.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuotePage,
});

type FieldErrors = Partial<
  Record<"full_name" | "email" | "phone" | "project_type" | "description", string>
>;

function QuotePage() {
  const [fields, setFields] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    project_type: "",
    budget: "",
    description: "",
  });
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof fields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const addFiles = (list: FileList | null | undefined) => {
    const names = Array.from(list ?? []).map((f) => f.name);
    setFiles((current) => [...current, ...names.filter((n) => !current.includes(n))]);
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!fields.full_name.trim()) next.full_name = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = "E-mail invalide.";
    if (!isValidMoroccanPhone(fields.phone)) next.phone = "Numéro marocain invalide.";
    if (!fields.project_type) next.project_type = "Choisissez un type de projet.";
    if (fields.description.trim().length < 15)
      next.description = "Décrivez votre besoin en quelques lignes.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const summary = summaryMessage("Bonjour DISTRICAP, je souhaite recevoir un devis.", [
    ["Nom", fields.full_name],
    ["Société", fields.company],
    ["E-mail", fields.email],
    ["Téléphone", fields.phone],
    ["Ville", fields.city],
    ["Type de projet", fields.project_type],
    ["Budget estimé", fields.budget],
    ["Besoin", fields.description],
    ["Documents à transmettre", files.join(", ")],
  ]);
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    `Demande de devis – ${fields.project_type || "projet"}`,
  )}&body=${encodeURIComponent(summary)}`;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validate()) setSent(true);
  };

  const sendWhatsapp = () => {
    if (!validate()) return;
    window.open(whatsappLink(summary), "_blank", "noreferrer");
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <SuccessCheck />
        <h1 className="mt-6 text-2xl">Merci, votre demande de devis est prête</h1>
        <p className="mt-3 text-muted-foreground">
          Transmettez-la à notre équipe via WhatsApp ou par e-mail : nous revenons vers vous avec
          une proposition adaptée à votre projet.
        </p>
        {files.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            Vos documents ({files.join(", ")}) vous seront demandés par notre équipe.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <a href={whatsappLink(summary)} target="_blank" rel="noreferrer">
              Envoyer via WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={mailto}>Envoyer par e-mail</a>
          </Button>
        </div>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Modifier ma demande
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl">Demander un devis gratuit</h1>
      <p className="mt-3 text-muted-foreground">
        Vidéosurveillance, détection incendie, sonorisation, réseau : décrivez votre projet et
        recevez une proposition chiffrée adaptée à votre site.
      </p>

      <form onSubmit={submit} className="card-surface mt-8 space-y-5 p-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="nom" className="text-sm font-medium">
              Nom complet
            </label>
            <Input
              id="nom"
              value={fields.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              className={cn("mt-1", errors.full_name && "border-primary")}
            />
            {errors.full_name && <p className="mt-1 text-xs text-primary">{errors.full_name}</p>}
          </div>
          <div>
            <label htmlFor="societe" className="text-sm font-medium">
              Société <span className="text-muted-foreground">(facultatif)</span>
            </label>
            <Input
              id="societe"
              value={fields.company}
              onChange={(e) => set("company", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={fields.email}
              onChange={(e) => set("email", e.target.value)}
              className={cn("mt-1", errors.email && "border-primary")}
            />
            {errors.email && <p className="mt-1 text-xs text-primary">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="tel" className="text-sm font-medium">
              Téléphone
            </label>
            <Input
              id="tel"
              type="tel"
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={cn("mt-1", errors.phone && "border-primary")}
            />
            {errors.phone && <p className="mt-1 text-xs text-primary">{errors.phone}</p>}
          </div>
          <div>
            <label htmlFor="ville" className="text-sm font-medium">
              Ville
            </label>
            <select
              id="ville"
              value={fields.city}
              onChange={(e) => set("city", e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choisir…</option>
              {MOROCCAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="text-sm font-medium">
              Type de projet
            </label>
            <select
              id="type"
              value={fields.project_type}
              onChange={(e) => set("project_type", e.target.value)}
              className={cn(
                "mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
                errors.project_type && "border-primary",
              )}
            >
              <option value="">Choisir…</option>
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.project_type && (
              <p className="mt-1 text-xs text-primary">{errors.project_type}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="budget" className="text-sm font-medium">
            Budget estimé
          </label>
          <select
            id="budget"
            value={fields.budget}
            onChange={(e) => set("budget", e.target.value)}
            className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Choisir…</option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description du besoin
          </label>
          <Textarea
            id="description"
            rows={5}
            value={fields.description}
            onChange={(e) => set("description", e.target.value)}
            className={cn("mt-1", errors.description && "border-primary")}
            placeholder="Nombre de caméras, surface à couvrir, contraintes du site, délais…"
          />
          {errors.description && <p className="mt-1 text-xs text-primary">{errors.description}</p>}
        </div>

        <div>
          <span className="text-sm font-medium">
            Document <span className="text-muted-foreground">(facultatif)</span>
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
              "mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm text-muted-foreground transition-colors duration-250",
              dragging ? "border-primary text-primary" : "border-border",
            )}
          >
            <Paperclip className="size-4" />
            Glissez un plan ou un cahier des charges, ou cliquez pour choisir
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
            <ul className="mt-2 flex flex-wrap gap-2">
              {files.map((name) => (
                <li
                  key={name}
                  className="rise-in inline-flex items-center gap-1 rounded-full bg-primary/10 py-1 pr-1 pl-3 text-xs text-primary"
                >
                  {name}
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
            Les fichiers ne sont pas envoyés depuis le site : notre équipe vous les demandera lors
            de l'échange.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button type="submit" size="lg" className="press w-full">
            Envoyer ma demande
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="press w-full"
            onClick={sendWhatsapp}
          >
            Envoyer via WhatsApp
          </Button>
        </div>
      </form>
    </div>
  );
}
