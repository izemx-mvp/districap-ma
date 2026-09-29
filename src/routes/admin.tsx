import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Espace administration – DISTRICAP" },
      {
        name: "description",
        content:
          "Espace réservé à l'équipe DISTRICAP : suivi des commandes, demandes de devis et messages clients.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Espace administration – DISTRICAP" },
      { property: "og:description", content: "Accès réservé à l'équipe DISTRICAP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Connexion impossible : vérifiez vos identifiants.");
      return;
    }
    queryClient.invalidateQueries();
  };

  const isAdmin = useQuery({
    queryKey: ["is-admin", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin")
        .maybeSingle();
      return Boolean(data);
    },
  });

  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const quotes = useQuery({
    queryKey: ["admin-quotes"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quote_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const messages = useQuery({
    queryKey: ["admin-messages"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) {
      toast.error("Le statut n'a pas pu être modifié.");
      return;
    }
    toast.success(`Commande marquée « ${status} »`);
    orders.refetch();
  };

  if (!ready) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <h1 className="text-2xl">Espace administration</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connectez-vous avec votre compte DISTRICAP.
        </p>
        <form onSubmit={signIn} className="card-surface mt-6 space-y-4 p-6">
          <div>
            <label htmlFor="a-email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="a-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="a-pass" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="a-pass"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : "Se connecter"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Administration</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await supabase.auth.signOut();
            queryClient.clear();
          }}
        >
          <LogOut className="size-4" /> Se déconnecter
        </Button>
      </div>

      {isAdmin.data === false && (
        <p className="card-surface mt-6 p-4 text-sm text-muted-foreground">
          Votre compte est connecté mais ne dispose pas encore des droits
          d'administration. Les commandes et demandes ne s'affichent qu'une fois ces
          droits accordés.
        </p>
      )}

      <Tabs defaultValue="orders" className="mt-8">
        <TabsList>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="quotes">Demandes de devis</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4 pt-6">
          {(orders.data ?? []).map((order) => (
            <div key={order.id} className="card-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.full_name} · {order.city} · {order.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">
                    {formatPrice(Number(order.total))}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    aria-label="Statut de la commande"
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {(order.order_items ?? []).map((item) => (
                  <li key={item.id}>
                    {item.quantity} × {item.product_name} —{" "}
                    {formatPrice(item.unit_price === null ? null : Number(item.unit_price))}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
            </div>
          ))}
          {(orders.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
          )}
        </TabsContent>

        <TabsContent value="quotes" className="space-y-4 pt-6">
          {(quotes.data ?? []).map((quote) => (
            <div key={quote.id} className="card-surface p-4">
              <p className="font-semibold">
                {quote.full_name}
                {quote.company ? ` · ${quote.company}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                {quote.project_type} · {quote.budget ?? "budget non précisé"} ·{" "}
                {quote.city ?? "ville non précisée"}
              </p>
              <p className="text-sm text-muted-foreground">
                {quote.email} · {quote.phone}
              </p>
              <p className="mt-2 text-sm whitespace-pre-line">{quote.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(quote.created_at)}
              </p>
            </div>
          ))}
          {(quotes.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Aucune demande de devis.</p>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4 pt-6">
          {(messages.data ?? []).map((message) => (
            <div key={message.id} className="card-surface p-4">
              <p className="font-semibold">
                {message.full_name} — {message.subject ?? "Sans objet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {message.email}
                {message.phone ? ` · ${message.phone}` : ""}
              </p>
              <p className="mt-2 text-sm whitespace-pre-line">{message.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {formatDate(message.created_at)}
              </p>
            </div>
          ))}
          {(messages.data ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun message reçu.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
