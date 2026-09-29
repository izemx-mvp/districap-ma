import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/lib/catalog";

export const Route = createFileRoute("/plan-du-site")({
  head: () => ({
    meta: [
      { title: "Plan du site – DISTRICAP" },
      {
        name: "description",
        content:
          "Toutes les pages et catégories du site DISTRICAP : vidéosurveillance, alarme, incendie, contrôle d'accès, sonorisation, audiovisuel et réseau.",
      },
      { property: "og:title", content: "Plan du site – DISTRICAP" },
      { property: "og:description", content: "Naviguez dans toutes nos rubriques." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitemapPage,
});

const PAGES = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Nos services" },
  { to: "/devis", label: "Demander un devis" },
  { to: "/contact", label: "Contact" },
  { to: "/panier", label: "Panier" },
  { to: "/cgv", label: "Conditions générales de vente" },
  { to: "/confidentialite", label: "Politique de confidentialité" },
] as const;

function SitemapPage() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const parents = categories.filter((c) => !c.parent_slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl">Plan du site</h1>

      <section className="mt-8">
        <h2 className="text-lg">Pages</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {PAGES.map((page) => (
            <li key={page.to}>
              <Link to={page.to} className="nav-underline text-muted-foreground">
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        {parents.map((parent) => (
          <div key={parent.slug}>
            <h2 className="text-lg">
              <Link to="/categorie/$slug" params={{ slug: parent.slug }}>
                {parent.name}
              </Link>
            </h2>
            <ul className="mt-2 space-y-1">
              {categories
                .filter((c) => c.parent_slug === parent.slug)
                .map((child) => (
                  <li key={child.slug}>
                    <Link
                      to="/categorie/$slug"
                      params={{ slug: child.slug }}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
