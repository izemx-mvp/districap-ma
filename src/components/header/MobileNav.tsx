import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { getParentCategories, getSubCategories } from "@/lib/catalog";
import { categoryIcon } from "@/lib/category-icons";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PAGES = [
  { to: "/services", label: "Services" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu principal" className="px-4 pb-8">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Catalogue
          </p>
          <ul className="mt-2 divide-y divide-border">
            {getParentCategories().map((cat, i) => {
              const Icon = categoryIcon(cat.slug);
              const isOpen = expanded === cat.slug;
              const panelId = `mnav-${cat.slug}`;
              return (
                <li key={cat.slug} className="rise-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center">
                    <Link
                      to="/categorie/$slug"
                      params={{ slug: cat.slug }}
                      onClick={close}
                      className="flex flex-1 items-center gap-3 py-3 text-sm font-semibold"
                    >
                      <Icon className="size-4 text-primary" />
                      {cat.name}
                    </Link>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-label={`${isOpen ? "Masquer" : "Afficher"} les sous-catégories ${cat.name}`}
                      onClick={() => setExpanded(isOpen ? null : cat.slug)}
                      className="press rounded-md p-2.5 text-muted-foreground"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-300",
                          isOpen && "rotate-180 text-primary",
                        )}
                      />
                    </button>
                  </div>
                  <div id={panelId} className="collapse-rows" data-open={isOpen} inert={!isOpen}>
                    <div className="overflow-hidden">
                      <ul className="mb-3 ml-2 border-l border-border pl-5">
                        {getSubCategories(cat.slug).map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              to="/categorie/$slug"
                              params={{ slug: sub.slug }}
                              onClick={close}
                              className="block py-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <ul className="mt-4 flex flex-col border-t border-border pt-4 text-sm font-medium">
            {PAGES.map((page) => (
              <li key={page.to}>
                <Link to={page.to} onClick={close} className="block py-2.5">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>

          <Button asChild className="mt-4 w-full">
            <Link to="/devis" onClick={close}>
              Demander un devis
            </Link>
          </Button>

          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            {SITE.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2"
              >
                <Phone className="size-4" /> {phone}
              </a>
            ))}
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2">
              <Mail className="size-4" /> {SITE.email}
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
