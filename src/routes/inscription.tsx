import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Building2, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { type AccountType, useAccount } from "@/lib/account";
import { passwordScore, safeRedirect } from "@/lib/account-helpers";
import { isValidMoroccanPhone } from "@/lib/format";
import { EMAIL_RE, useFormState } from "@/lib/use-form";
import { AuthShell } from "@/components/auth/AuthShell";
import { CityCombobox } from "@/components/forms/CityCombobox";
import { Field, Shake } from "@/components/forms/Field";
import { PasswordField } from "@/components/forms/PasswordField";
import { StepIndicator } from "@/components/forms/Steps";
import { SuccessCheck } from "@/components/SuccessCheck";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/inscription")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } =>
    typeof search["redirect"] === "string" ? { redirect: safeRedirect(search["redirect"]) } : {},
  head: () => ({
    meta: [
      { title: "Créer un compte – Espace client DISTRICAP" },
      {
        name: "description",
        content:
          "Créez votre espace client DISTRICAP pour commander plus rapidement vos équipements de sécurité, sonorisation et réseau.",
      },
      { property: "og:title", content: "Créer un compte – Espace client DISTRICAP" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignUpPage,
});

type SignUpFields = {
  email: string;
  password: string;
  confirm: string;
  full_name: string;
  phone: string;
  city: string;
  company: string;
  type: AccountType;
};

const EMPTY: SignUpFields = {
  email: "",
  password: "",
  confirm: "",
  full_name: "",
  phone: "",
  city: "",
  company: "",
  type: "particulier",
};

const STEPS = ["Identifiants", "Coordonnées"];
const STEP_FIELDS: [(keyof SignUpFields)[], (keyof SignUpFields)[]] = [
  ["email", "password", "confirm"],
  ["full_name", "phone", "city", "company"],
];

function validate(v: SignUpFields) {
  const errors: Partial<Record<keyof SignUpFields, string>> = {};
  if (!EMAIL_RE.test(v.email.trim())) errors.email = "Adresse e-mail invalide.";
  if (passwordScore(v.password) < 3 || v.password.length < 8)
    errors.password = "Choisissez un mot de passe plus robuste.";
  if (!v.confirm || v.confirm !== v.password)
    errors.confirm = "Les mots de passe ne correspondent pas.";
  if (v.full_name.trim().length < 3) errors.full_name = "Indiquez votre nom complet.";
  if (!isValidMoroccanPhone(v.phone))
    errors.phone = "Numéro marocain invalide (ex. 06 12 34 56 78).";
  if (!v.city.trim()) errors.city = "Choisissez votre ville.";
  if (v.type === "professionnel" && v.company.trim().length < 2)
    errors.company = "Indiquez le nom de votre société.";
  return errors;
}

const ACCOUNT_TYPES: { value: AccountType; label: string; icon: typeof User }[] = [
  { value: "particulier", label: "Particulier", icon: User },
  { value: "professionnel", label: "Professionnel", icon: Building2 },
];

function SignUpPage() {
  const { redirect } = Route.useSearch();
  const target = safeRedirect(redirect);
  const navigate = useNavigate();
  const { signUp } = useAccount();
  const form = useFormState(EMPTY, useCallback(validate, []));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [terms, setTerms] = useState(false);
  const [termsAttempt, setTermsAttempt] = useState(0);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const v = form.values;
  const pro = v.type === "professionnel";

  const next = () => {
    if (!form.check(STEP_FIELDS[0])) return;
    setDirection("forward");
    setStep(1);
  };

  const back = () => {
    setDirection("back");
    setError(null);
    setStep(0);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step === 0) return next();
    const fieldsOk = form.check(STEP_FIELDS[1]);
    if (!terms) setTermsAttempt((a) => a + 1);
    if (!fieldsOk || !terms) return;
    setPending(true);
    const result = await signUp({
      email: v.email,
      password: v.password,
      fullName: v.full_name.trim(),
      phone: v.phone.trim(),
      city: v.city,
      type: v.type,
      company: pro ? v.company.trim() : "",
    });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      setDirection("back");
      setStep(0);
      return;
    }
    setDone(true);
    window.scrollTo({ top: 0 });
    toast.success("Compte créé", { description: `Bienvenue ${v.full_name.split(" ")[0]} !` });
  };

  if (done) {
    return (
      <AuthShell
        mode="inscription"
        title="Bienvenue chez DISTRICAP"
        subtitle="Votre compte est prêt. Vos coordonnées sont enregistrées sur ce navigateur."
        redirect={target}
      >
        <div className="rise-in py-2 text-center">
          <SuccessCheck />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button size="lg" className="press" onClick={() => void navigate({ to: target })}>
              Continuer <ArrowRight className="size-4" />
            </Button>
            <Button asChild size="lg" variant="outline" className="press">
              <Link to="/nouveautes">Voir les nouveautés</Link>
            </Button>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      mode="inscription"
      title="Créez votre compte"
      subtitle="Deux étapes rapides pour gagner du temps sur vos prochaines commandes."
      redirect={target}
    >
      <StepIndicator steps={STEPS} current={step} />

      <form onSubmit={submit} noValidate className="mt-6">
        <div key={step} className={direction === "forward" ? "step-in-right" : "step-in-left"}>
          {step === 0 ? (
            <div className="space-y-4">
              <div className="collapse-rows" data-open={Boolean(error)}>
                <div className="overflow-hidden">
                  <p
                    role={error ? "alert" : undefined}
                    className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm text-primary"
                  >
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <span>
                      {error}{" "}
                      <Link to="/connexion" className="font-semibold underline underline-offset-4">
                        Se connecter
                      </Link>
                    </span>
                  </p>
                </div>
              </div>
              <Field
                label="Adresse e-mail"
                type="email"
                inputMode="email"
                autoComplete="email"
                {...form.field("email")}
              />
              <PasswordField autoComplete="new-password" showStrength {...form.field("password")} />
              <PasswordField
                label="Confirmer le mot de passe"
                autoComplete="new-password"
                {...form.field("confirm")}
              />
              <Button type="submit" size="lg" className="press group w-full">
                Continuer
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Vous êtes</legend>
                <div className="relative grid grid-cols-2 gap-3">
                  {ACCOUNT_TYPES.map(({ value, label, icon: Icon }) => {
                    const selected = v.type === value;
                    return (
                      <label
                        key={value}
                        className={cn(
                          "press flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 text-sm font-semibold transition-colors duration-200 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary/15",
                          selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/40",
                        )}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={value}
                          checked={selected}
                          onChange={() => form.set("type", value)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-200",
                            selected ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        {label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <Field label="Nom complet" autoComplete="name" {...form.field("full_name")} />
                <div className="collapse-rows" data-open={pro} inert={!pro}>
                  <div className="overflow-hidden">
                    <Field
                      label="Société"
                      autoComplete="organization"
                      className="pt-4"
                      {...form.field("company")}
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Téléphone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  {...form.field("phone")}
                />
                <CityCombobox {...form.field("city")} />
              </div>

              <Shake active={!terms} trigger={termsAttempt}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-md p-1 text-sm select-none",
                    termsAttempt > 0 && !terms && "text-primary",
                  )}
                >
                  <Checkbox
                    checked={terms}
                    onCheckedChange={(checked) => setTerms(checked === true)}
                    className="mt-0.5"
                    aria-invalid={termsAttempt > 0 && !terms}
                  />
                  <span>
                    J'accepte les{" "}
                    <Link
                      to="/cgv"
                      target="_blank"
                      className="font-medium underline underline-offset-4"
                    >
                      conditions générales de vente
                    </Link>{" "}
                    et la{" "}
                    <Link
                      to="/confidentialite"
                      target="_blank"
                      className="font-medium underline underline-offset-4"
                    >
                      politique de confidentialité
                    </Link>
                    .
                  </span>
                </label>
              </Shake>

              <div className="grid grid-cols-[auto_1fr] gap-3">
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="press"
                  onClick={back}
                  aria-label="Étape précédente"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button type="submit" size="lg" className="press w-full" disabled={pending}>
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Création…
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Déjà client ?{" "}
        <Link
          to="/connexion"
          search={target !== "/" ? { redirect: target } : {}}
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
