import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo-districap.png.asset.json";
import { SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Merci de saisir une adresse e-mail valide.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    setBusy(false);
    if (error && !error.message.includes("duplicate")) {
      toast.error("L'inscription n'a pas pu être enregistrée. Réessayez.");
      return;
    }
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="ink-panel mt-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-block rounded-md bg-background p-3">
            <img src={logo.url} alt="DISTRICAP" className="w-[170px]" />
          </div>
          <p className="mt-4 text-sm opacity-80">
            Distributeur marocain de matériel informatique, audiovisuel et de sécurité
            électronique depuis 2009. Conseil, fourniture et accompagnement de projet
            partout au Maroc.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="rounded-md p-2 transition-all hover:-translate-y-0.5 hover:text-primary"
            >
              <Facebook className="size-5" />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="rounded-md p-2 transition-all hover:-translate-y-0.5 hover:text-primary"
            >
              <Linkedin className="size-5" />
            </a>
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="rounded-md p-2 transition-all hover:-translate-y-0.5 hover:text-primary"
            >
              <Instagram className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Districap</h3>
          <ul className="mt-4 space-y-2 text-sm opacity-85">
            <li>
              <Link to="/a-propos" className="nav-underline">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-underline">
                Nos services
              </Link>
            </li>
            <li>
              <Link to="/devis" className="nav-underline">
                Demander un devis
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/plan-du-site" className="nav-underline">
                Plan du site
              </Link>
            </li>
            <li>
              <Link to="/cgv" className="nav-underline">
                CGV
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className="nav-underline">
                Politique de confidentialité
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Nous trouver</h3>
          <ul className="mt-4 space-y-3 text-sm opacity-85">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {SITE.address}
            </li>
            {SITE.phones.map((p) => (
              <li key={p} className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
              </li>
            ))}
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0" />
              <span>
                {SITE.hours.map((h) => (
                  <span key={h} className="block">
                    {h}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide uppercase">Newsletter</h3>
          <p className="mt-4 text-sm opacity-85">
            Nouveautés produits et promotions, une fois par mois.
          </p>
          {done ? (
            <p className="rise-in mt-4 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm">
              L'inscription a été effectuée avec succès.
            </p>
          ) : (
            <form onSubmit={subscribe} className="mt-4 flex flex-col gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre e-mail"
                aria-label="Votre e-mail"
                className="bg-background text-foreground"
                required
              />
              <Button type="submit" disabled={busy}>
                {busy ? "Envoi…" : "Je m'inscris"}
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs opacity-70 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} DISTRICAP — {SITE.tagline}. Tous droits réservés.
          </p>
          <p>{SITE.promise}</p>
        </div>
      </div>
    </footer>
  );
}
