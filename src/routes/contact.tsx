import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { isValidMoroccanPhone } from "@/lib/format";
import { summaryMessage } from "@/lib/order";
import { SITE, whatsappLink } from "@/lib/site";
import { EMAIL_RE, useFormState } from "@/lib/use-form";
import { Field } from "@/components/forms/Field";
import { Reveal } from "@/components/Reveal";
import { SuccessCheck } from "@/components/SuccessCheck";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact – DISTRICAP Casablanca" },
      {
        name: "description",
        content:
          "Contactez DISTRICAP à Ain Harrouda, Casablanca : téléphone, e-mail, WhatsApp et horaires d'ouverture.",
      },
      { property: "og:title", content: "Contact – DISTRICAP Casablanca" },
      {
        property: "og:description",
        content: "Nos coordonnées, horaires et formulaire de contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const MAP_QUERY = "Ain Harrouda, Casablanca, Maroc";

type ContactFields = {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMPTY: ContactFields = { full_name: "", email: "", phone: "", subject: "", message: "" };
const REQUIRED: (keyof ContactFields)[] = ["full_name", "email", "phone", "message"];

function validate(v: ContactFields) {
  const errors: Partial<Record<keyof ContactFields, string>> = {};
  if (v.full_name.trim().length < 3) errors.full_name = "Indiquez votre nom complet.";
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (v.phone.trim() && !isValidMoroccanPhone(v.phone))
    errors.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
  if (v.message.trim().length < 10) errors.message = "Votre message est trop court.";
  return errors;
}

function InfoCard({
  icon: Icon,
  title,
  children,
  delay,
}: {
  icon: LucideIcon | typeof WhatsAppGlyph;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="card-surface group flex gap-4 p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0 text-sm">
        <h2 className="text-base">{title}</h2>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </Reveal>
  );
}

function ContactPage() {
  const form = useFormState(EMPTY, useCallback(validate, []));
  const [sent, setSent] = useState(false);
  const v = form.values;

  const summary = summaryMessage("Bonjour DISTRICAP,", [
    ["Nom", v.full_name],
    ["E-mail", v.email],
    ["Téléphone", v.phone],
    ["Sujet", v.subject],
    ["Message", v.message],
  ]);
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    v.subject || "Demande d'information",
  )}&body=${encodeURIComponent(summary)}`;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.check(REQUIRED)) setSent(true);
  };

  const sendWhatsapp = () => {
    if (!form.check(REQUIRED)) return;
    window.open(whatsappLink(summary), "_blank", "noreferrer");
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl">Contact</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Une question sur un produit, un projet à chiffrer ou un suivi de commande ? Écrivez-nous ou
        appelez-nous aux horaires d'ouverture.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon={Phone} title="Téléphone" delay={0}>
              {SITE.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, "")}`}
                  className="block font-medium text-foreground transition-colors hover:text-primary"
                >
                  {p}
                </a>
              ))}
            </InfoCard>
            <InfoCard icon={Mail} title="E-mail" delay={60}>
              <a
                href={`mailto:${SITE.email}`}
                className="font-medium break-all text-foreground transition-colors hover:text-primary"
              >
                {SITE.email}
              </a>
            </InfoCard>
            <InfoCard icon={WhatsAppGlyph} title="WhatsApp" delay={120}>
              <a
                href={whatsappLink("Bonjour DISTRICAP, j'aimerais des informations.")}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                Écrire sur WhatsApp
              </a>
            </InfoCard>
            <InfoCard icon={Clock} title="Horaires" delay={180}>
              {SITE.hours.map((h) => (
                <span key={h} className="block">
                  {h}
                </span>
              ))}
            </InfoCard>
          </div>
          <InfoCard icon={MapPin} title="Adresse" delay={240}>
            {SITE.address}
          </InfoCard>
          <Reveal delay={300} className="card-surface overflow-hidden">
            <iframe
              title="Plan d'accès – DISTRICAP, Ain Harrouda"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full border-0"
            />
          </Reveal>
        </div>

        <div>
          {sent ? (
            <div className="card-surface rise-in p-8 text-center lg:sticky lg:top-32">
              <SuccessCheck />
              <h2 className="mt-4 text-xl">Merci, votre message est prêt</h2>
              <p className="mt-2 text-muted-foreground">
                Transmettez-le à notre équipe via WhatsApp ou par e-mail, en un clic.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild className="bg-[#0f7a5a] text-white hover:bg-[#0c6a4e]">
                  <a href={whatsappLink(summary)} target="_blank" rel="noreferrer">
                    <WhatsAppGlyph className="size-4" /> Envoyer via WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={mailto}>
                    <Mail className="size-4" /> Envoyer par e-mail
                  </a>
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Modifier mon message
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="card-surface space-y-4 p-6 lg:sticky lg:top-32"
            >
              <h2 className="text-xl">Envoyez-nous un message</h2>
              <Field label="Nom complet" autoComplete="name" {...form.field("full_name")} />
              <div className="grid gap-4 sm:grid-cols-2">
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
                  optional
                  {...form.field("phone")}
                />
              </div>
              <Field label="Sujet" optional {...form.field("subject")} />
              <Field label="Message" multiline rows={6} {...form.field("message")} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="submit" size="lg" className="press w-full">
                  Envoyer le message
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="press w-full"
                  onClick={sendWhatsapp}
                >
                  <WhatsAppGlyph className="size-4" /> Envoyer via WhatsApp
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
