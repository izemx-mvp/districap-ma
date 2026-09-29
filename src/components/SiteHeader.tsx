import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  FileText,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import logo from "@/assets/logo-districap.png.asset.json";
import { SITE, whatsappLink } from "@/lib/site";
import { categoriesQuery, productsQuery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { productImage } from "@/lib/images";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.87 9.87 0 0 0 4.74 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.17 8.17 0 0 1-1.25-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.21-8.24 8.21Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.22.24-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.59.26 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

export function SiteHeader() {
  const navigate = useNavigate();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const { count, lines, subtotal, remove, drawerOpen, setDrawerOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [popped, setPopped] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPopped(true);
    const t = setTimeout(() => setPopped(false), 320);
    return () => clearTimeout(t);
  }, [count]);

  const parents = useMemo(() => categories.filter((c) => !c.parent_slug), [categories]);
  const childrenOf = (slug: string) => categories.filter((c) => c.parent_slug === slug);

  const suggestions = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand_slug ?? "").includes(q) ||
          p.sku.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [term, products]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!term.trim()) return;
    setFocused(false);
    navigate({ to: "/recherche", search: { q: term.trim() } });
  };

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "ink-panel overflow-hidden text-xs transition-all duration-300",
          scrolled ? "max-h-0 opacity-0" : "max-h-16 opacity-100",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {SITE.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <Phone className="size-3.5" /> {phone}
              </a>
            ))}
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Mail className="size-3.5" /> {SITE.email}
            </a>
          </div>
          <p className="font-medium">{SITE.promise}</p>
        </div>
      </div>

      <div
        className={cn(
          "border-b border-border bg-background/95 backdrop-blur transition-all duration-300",
          scrolled && "shadow-[var(--shadow-card)]",
        )}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 md:gap-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
              className="press rounded-md p-2 transition-colors hover:text-primary lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="block shrink-0">
              <img
                src={logo.url}
                alt="DISTRICAP – Communication & Sécurité"
                className={cn(
                  "w-[150px] origin-left transition-transform duration-300 md:w-[190px]",
                  scrolled && "scale-85",
                )}
              />
            </Link>
          </div>

          <form onSubmit={submitSearch} className="relative hidden min-w-0 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => window.setTimeout(() => setFocused(false), 150)}
              placeholder="Rechercher un produit, une marque, une référence…"
              aria-label="Rechercher"
              className="h-11 rounded-full pl-9 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary"
            />
            {focused && suggestions.length > 0 && (
              <ul className="card-surface absolute top-full z-50 mt-2 w-full overflow-hidden p-1">
                {suggestions.map((p, i) => (
                  <li
                    key={p.id}
                    className="rise-in"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Link
                      to="/produit/$slug"
                      params={{ slug: p.slug }}
                      onClick={() => setTerm("")}
                      className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                    >
                      <img
                        src={productImage(p.image_key)}
                        alt=""
                        loading="lazy"
                        className="size-10 rounded object-contain"
                      />
                      <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(p.price ? Number(p.price) : null)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="flex items-center gap-1 md:gap-2">
            <a
              href={whatsappLink("Bonjour DISTRICAP, j'ai une question.")}
              target="_blank"
              rel="noreferrer"
              aria-label="Nous écrire sur WhatsApp"
              className="press rounded-md p-2 transition-colors hover:text-primary"
            >
              <WhatsAppGlyph className="size-5" />
            </a>
            <Button asChild variant="outline" size="sm" className="hidden lg:inline-flex">
              <Link to="/devis">
                <FileText className="size-4" /> Demander un devis
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={`Panier, ${count} article(s)`}
              className="press relative rounded-md p-2 transition-colors hover:text-primary"
            >
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span
                  className={cn(
                    "absolute -top-0.5 -right-0.5 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground",
                    popped && "pop-scale",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav
          className="mx-auto hidden max-w-7xl px-4 lg:block"
          onMouseLeave={() => setOpenMenu(null)}
        >
          <ul className="flex flex-wrap items-center gap-6 pb-2 text-sm font-medium">
            {parents.map((cat) => (
              <li
                key={cat.slug}
                className="relative"
                onMouseEnter={() => setOpenMenu(cat.slug)}
              >
                <Link
                  to="/categorie/$slug"
                  params={{ slug: cat.slug }}
                  className="nav-underline inline-flex items-center gap-1 py-2"
                >
                  {cat.name}
                  <ChevronDown className="size-3.5 opacity-60" />
                </Link>
                {openMenu === cat.slug && childrenOf(cat.slug).length > 0 && (
                  <div className="card-surface rise-in absolute top-full left-0 z-50 w-64 p-2">
                    {childrenOf(cat.slug).map((child, i) => (
                      <Link
                        key={child.slug}
                        to="/categorie/$slug"
                        params={{ slug: child.slug }}
                        onClick={() => setOpenMenu(null)}
                        className="rise-in block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-primary"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Menu mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Catalogue</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 px-4 pb-8">
            <form onSubmit={submitSearch} className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Rechercher…"
                aria-label="Rechercher"
                className="pl-9"
              />
            </form>
            {parents.map((cat, i) => (
              <div
                key={cat.slug}
                className="rise-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link
                  to="/categorie/$slug"
                  params={{ slug: cat.slug }}
                  onClick={() => setMobileOpen(false)}
                  className="block py-1 font-semibold"
                >
                  {cat.name}
                </Link>
                <div className="mt-1 ml-3 flex flex-col gap-1 border-l border-border pl-3">
                  {childrenOf(cat.slug).map((child) => (
                    <Link
                      key={child.slug}
                      to="/categorie/$slug"
                      params={{ slug: child.slug }}
                      onClick={() => setMobileOpen(false)}
                      className="py-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Button asChild className="w-full">
              <Link to="/devis" onClick={() => setMobileOpen(false)}>
                Demander un devis
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mini-panier */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="flex w-[92vw] max-w-md flex-col">
          <SheetHeader>
            <SheetTitle>Votre panier</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-3 overflow-y-auto px-4">
            {lines.length === 0 && (
              <div className="py-12 text-center">
                <ShoppingCart className="float-soft mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Votre panier est vide pour le moment.
                </p>
              </div>
            )}
            {lines.map((line) => (
              <div key={line.slug} className="rise-in flex gap-3 border-b border-border pb-3">
                <img
                  src={productImage(line.imageKey)}
                  alt=""
                  loading="lazy"
                  className="size-16 rounded-md border border-border object-contain"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{line.name}</p>
                  <p className="text-xs text-muted-foreground">Qté {line.quantity}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(line.price)}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Retirer ${line.name}`}
                  onClick={() => remove(line.slug)}
                  className="press self-start rounded-md p-1 text-muted-foreground transition-colors hover:text-primary"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-3 border-t border-border p-4">
            <div className="flex items-center justify-between font-semibold">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Button asChild className="w-full" disabled={lines.length === 0}>
              <Link to="/panier" onClick={() => setDrawerOpen(false)}>
                Voir le panier
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setDrawerOpen(false)}
            >
              <X className="size-4" /> Continuer mes achats
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
