import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, Mail, Menu, Phone, Search, ShoppingCart } from "lucide-react";
import logo from "@/assets/logo_districap.png";
import { SITE, whatsappLink } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
import { AccountMenu } from "@/components/header/AccountMenu";
import { MegaMenu } from "@/components/header/MegaMenu";
import { MobileNav } from "@/components/header/MobileNav";
import { MobileSearch } from "@/components/header/MobileSearch";
import { SearchBox } from "@/components/header/SearchBox";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

/** `scrolled` once past the top bar; `hidden` while scrolling down (revealed on scroll up). */
function useScrollState(locked: boolean) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      setScrolled(y > 80);
      if (y < 200) setHidden(false);
      else if (delta > 8) setHidden(true);
      else if (delta < -8) setHidden(false);
      if (Math.abs(delta) > 8 || y < 200) lastY.current = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { scrolled, hidden: hidden && !locked };
}

export function SiteHeader() {
  const { count, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [popped, setPopped] = useState(false);
  const firstRender = useRef(true);
  const { scrolled, hidden } = useScrollState(megaOpen || searchOpen);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setPopped(true);
    const t = setTimeout(() => setPopped(false), 320);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-transform duration-300 ease-entrance",
        hidden && "-translate-y-full",
      )}
    >
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
              className="hidden items-center gap-1.5 transition-colors hover:text-primary sm:inline-flex"
            >
              <Mail className="size-3.5" /> {SITE.email}
            </a>
          </div>
          <p className="hidden font-medium md:block">{SITE.promise}</p>
        </div>
      </div>

      <div
        className={cn(
          "relative border-b border-border bg-background/95 backdrop-blur transition-shadow duration-300",
          scrolled && "shadow-[var(--shadow-card)]",
        )}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-3 md:gap-6">
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileOpen(true)}
              className="press -ml-2 rounded-md p-2 transition-colors hover:text-primary lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <Link to="/" className="block shrink-0" aria-label="DISTRICAP – Accueil">
              <img
                src={logo}
                alt="DISTRICAP – Communication & Sécurité"
                className={cn(
                  "h-auto w-[130px] origin-left transition-transform duration-300 sm:w-[150px] md:w-[190px]",
                  scrolled && "scale-85",
                )}
              />
            </Link>
          </div>

          <div className="min-w-0">
            <SearchBox className="hidden md:block" />
          </div>

          <div className="flex items-center gap-0.5 md:gap-2">
            <button
              type="button"
              aria-label="Rechercher"
              onClick={() => setSearchOpen(true)}
              className="press rounded-md p-2 transition-colors hover:text-primary md:hidden"
            >
              <Search className="size-5" />
            </button>
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
            <AccountMenu />
            <button
              type="button"
              data-cart-target
              onClick={() => setDrawerOpen(true)}
              aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}
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

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 pb-2 text-sm font-medium">
            <MegaMenu onOpenChange={setMegaOpen} />
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="nav-underline py-2">
                {link.label}
              </Link>
            ))}
            <Link
              to="/devis"
              className="ml-auto inline-flex items-center gap-1.5 py-2 text-muted-foreground transition-colors hover:text-primary"
            >
              Un projet ? Parlons-en
            </Link>
          </div>
        </nav>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
      <MobileSearch open={searchOpen} onClose={closeSearch} />
      <CartDrawer />
    </header>
  );
}
