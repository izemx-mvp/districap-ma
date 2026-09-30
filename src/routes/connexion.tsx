import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "@/lib/account";
import { initials, safeRedirect } from "@/lib/account-helpers";
import { SITE } from "@/lib/site";
import { EMAIL_RE, useFormState } from "@/lib/use-form";
import { AuthShell } from "@/components/auth/AuthShell";
import { Field, Shake } from "@/components/forms/Field";
import { PasswordField } from "@/components/forms/PasswordField";
import { SuccessCheck } from "@/components/SuccessCheck";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/connexion")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: safeRedirect(search["redirect"]) } : {},
  head: () => ({
    meta: [
      { title: "Connexion – Espace client DISTRICAP" },
      {
        name: "description",
        content:
          "Connectez-vous à votre espace client DISTRICAP : vidéosurveillance, alarme, détection incendie, contrôle d'accès et réseau.",
      },
      { property: "og:title", content: "Connexion – Espace client DISTRICAP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignInPage,
});

type SignInFields = { email: string; password: string };

function validate(v: SignInFields) {
  const errors: Partial<Record<keyof SignInFields, string>> = {};
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (!v.password) errors.password = "Saisissez votre mot de passe.";
  return errors;
}

function SignInPage() {
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const navigate = useNavigate();
  const { user, hydrated, signIn, signOut } = useAccount();
  const form = useFormState({ email: "", password: "" }, useCallback(validate, []));
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorAttempt, setErrorAttempt] = useState(0);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.check(["email", "password"])) return;
    setPending(true);
    const result = await signIn(form.values.email, form.values.password, remember);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      setErrorAttempt((a) => a + 1);
      return;
    }
    setDone(true);
    toast.success("Connexion réussie", { description: "Heureux de vous revoir !" });
    window.setTimeout(() => void navigate({ to: target }), 900);
  };

  if (done) {
    return (
      <AuthShell
        mode="connexion"
        title="Connexion réussie"
        subtitle="Redirection en cours…"
        redirect={target}
      >
        <div className="rise-in py-6 text-center">
          <SuccessCheck />
        </div>
      </AuthShell>
    );
  }

  if (hydrated && user) {
    return (
      <AuthShell
        mode="connexion"
        title={`Bonjour ${user.fullName.split(" ")[0]}`}
        subtitle="Vous êtes déjà connecté sur ce navigateur."
        redirect={target}
      >
        <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {initials(user.fullName)}
          </span>
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold">{user.fullName}</p>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="press">
            <Link to={target}>
              Continuer <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="press"
            onClick={() => {
              signOut();
              toast("Vous êtes déconnecté.");
            }}
          >
            <LogOut className="size-4" /> Se déconnecter
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      mode="connexion"
      title="Bon retour parmi nous"
      subtitle="Connectez-vous pour retrouver vos coordonnées et commander plus vite."
      redirect={target}
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="collapse-rows" data-open={Boolean(error)}>
          <div className="overflow-hidden">
            <Shake active={Boolean(error)} trigger={errorAttempt}>
              <p
                role={error ? "alert" : undefined}
                className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                {error}
              </p>
            </Shake>
          </div>
        </div>

        <Field
          label="Adresse e-mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          {...form.field("email")}
        />
        <PasswordField {...form.field("password")} />

        <div className="text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 select-none">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
            Se souvenir de moi
          </label>
        </div>

        <Button type="submit" size="lg" className="press group w-full" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Connexion…
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        Nouveau chez {SITE.name} ?
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button asChild variant="outline" size="lg" className="press w-full">
        <Link to="/inscription" search={target !== "/" ? { redirect: target } : {}}>
          Créer un compte
        </Link>
      </Button>
    </AuthShell>
  );
}
