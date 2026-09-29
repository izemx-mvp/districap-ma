import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SITE, whatsappLink } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

function ContactPage() {
  const [fields, setFields] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof fields, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      toast.error("Adresse e-mail invalide.");
      return;
    }
    if (fields.message.trim().length < 10) {
      toast.error("Votre message est trop court.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({
      full_name: fields.full_name,
      email: fields.email,
      phone: fields.phone || null,
      subject: fields.subject || null,
      message: fields.message,
    });
    setBusy(false);
    if (error) {
      toast.error("Votre message n'a pas pu être envoyé. Réessayez.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl">Contact</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Une question sur un produit, un projet à chiffrer ou un suivi de commande ? Notre
        équipe vous répond du lundi au samedi.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          {sent ? (
            <div className="card-surface rise-in p-8 text-center">
              <h2 className="text-xl">Message envoyé</h2>
              <p className="mt-2 text-muted-foreground">
                Merci, nous revenons vers vous dans les meilleurs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="card-surface space-y-4 p-6">
              <div>
                <label htmlFor="c-nom" className="text-sm font-medium">
                  Nom complet
                </label>
                <Input
                  id="c-nom"
                  required
                  value={fields.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="c-email"
                    type="email"
                    required
                    value={fields.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="c-tel" className="text-sm font-medium">
                    Téléphone
                  </label>
                  <Input
                    id="c-tel"
                    type="tel"
                    value={fields.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-sujet" className="text-sm font-medium">
                  Sujet
                </label>
                <Input
                  id="c-sujet"
                  value={fields.subject}
                  onChange={(e) => set("subject", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="c-msg" className="text-sm font-medium">
                  Message
                </label>
                <Textarea
                  id="c-msg"
                  rows={5}
                  required
                  value={fields.message}
                  onChange={(e) => set("message", e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="press w-full" disabled={busy}>
                {busy ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Envoi…
                  </>
                ) : (
                  "Envoyer le message"
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                {SITE.address}
              </li>
              {SITE.phones.map((p) => (
                <li key={p} className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                  <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                </li>
              ))}
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  {SITE.hours.map((h) => (
                    <span key={h} className="block">
                      {h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
            <Button asChild className="mt-6 w-full">
              <a
                href={whatsappLink("Bonjour DISTRICAP, j'aimerais des informations.")}
                target="_blank"
                rel="noreferrer"
              >
                Écrire sur WhatsApp
              </a>
            </Button>
          </div>

          <div className="card-surface grid h-64 place-items-center bg-surface text-sm text-muted-foreground">
            <div className="text-center">
              <MapPin className="mx-auto size-8 text-primary" />
              <p className="mt-2">Ain Harrouda, Casablanca</p>
              <p className="text-xs">Plan interactif à venir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
