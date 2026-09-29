import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Banknote, ChevronRight, Download, FileText, Truck } from "lucide-react";
import {
  brandName,
  discountPercent,
  getBrand,
  getCategory,
  getParentCategory,
  getProduct,
  mainImage,
  similarProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useAddToCart } from "@/lib/add-to-cart";
import { useRecentlyViewed } from "@/lib/recently-viewed";
import { whatsappLink } from "@/lib/site";
import { AddedLabel } from "@/components/AddedLabel";
import { AnimatedTabs } from "@/components/AnimatedTabs";
import { BrandLogo } from "@/components/BrandLogo";
import { ProductCarousel } from "@/components/ProductCarousel";
import { QuantityStepper } from "@/components/QuantityStepper";
import { WhatsAppGlyph } from "@/components/WhatsAppGlyph";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produit/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const title = `${product?.name ?? "Produit"} – DISTRICAP`;
    const description = product
      ? `${product.short_description} Réf. ${product.sku}, ${brandName(product.brand)}. Livraison partout au Maroc, paiement à la livraison.`
      : "Fiche produit DISTRICAP : caractéristiques techniques, prix en MAD et disponibilité.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        ...(product ? [{ property: "og:image", content: mainImage(product) }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductNotFound,
  component: ProductPage,
});

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl">Produit introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        Cette référence n'est plus disponible dans notre catalogue.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { added, addToCart } = useAddToCart(product);
  const [quantity, setQuantity] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const recentlyViewed = useRecentlyViewed(product.slug);

  const price = product.price;
  const oldPrice = product.old_price;
  const discount = discountPercent(product);
  const image = mainImage(product);
  const brand = getBrand(product.brand);
  const category = getCategory(product.category);
  const parentCategory = category ? getParentCategory(category) : undefined;
  const specs = Object.entries(product.specs);
  const similar = similarProducts(product, 8);

  // Reset per-product state when navigating between products.
  useEffect(() => setQuantity(1), [product.slug]);

  // Mobile sticky bar appears once the main buy block has scrolled out of view.
  useEffect(() => {
    const node = buyRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [product.slug]);

  const onAdd = () => addToCart(quantity, imageRef.current);

  const tabs = [
    {
      value: "description",
      label: "Description",
      content: (
        <p className="max-w-3xl leading-relaxed text-muted-foreground">{product.description}</p>
      ),
    },
    {
      value: "specs",
      label: "Caractéristiques techniques",
      content: (
        <div className="max-w-3xl overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <caption className="sr-only">Caractéristiques techniques de {product.name}</caption>
            <tbody>
              {[["Référence", product.sku], ["Marque", brandName(product.brand)], ...specs].map(
                ([key, value], i) => (
                  <tr
                    key={key}
                    className={cn("rise-in", i % 2 === 0 && "bg-surface")}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <th scope="row" className="w-2/5 px-4 py-3 text-left font-medium">
                      {key}
                    </th>
                    <td className="px-4 py-3 text-muted-foreground">{value}</td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      value: "docs",
      label: "Documents",
      content: product.datasheet_url ? (
        <a
          href={product.datasheet_url}
          target="_blank"
          rel="noreferrer"
          className="card-surface group inline-flex max-w-md items-center gap-4 p-4 transition-colors hover:border-primary"
        >
          <span className="grid size-11 place-items-center rounded-md bg-primary/10 text-primary">
            <FileText className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold">Fiche technique</span>
            <span className="block text-sm text-muted-foreground">{product.name} – PDF</span>
          </span>
          <Download className="size-4 text-muted-foreground transition-transform group-hover:translate-y-0.5 group-hover:text-primary" />
        </a>
      ) : (
        <div className="max-w-3xl">
          <p className="text-muted-foreground">
            La fiche technique détaillée de ce produit est disponible sur demande.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <a
              href={whatsappLink(
                `Bonjour DISTRICAP, je souhaite recevoir la fiche technique de : ${product.name} (réf. ${product.sku}).`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="size-4" /> Demander la fiche technique
            </a>
          </Button>
        </div>
      ),
    },
    {
      value: "livraison",
      label: "Livraison & paiement",
      content: (
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          Livraison partout au Maroc depuis notre dépôt de Casablanca. Le règlement s'effectue en
          espèces à la réception de votre commande (paiement à la livraison). Les frais de livraison
          sont confirmés lors de la validation de la commande par notre équipe.
        </p>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            sku: product.sku,
            brand: { "@type": "Brand", name: brandName(product.brand) },
            description: product.short_description,
            image,
            offers:
              price !== null
                ? {
                    "@type": "Offer",
                    price,
                    priceCurrency: "MAD",
                    availability: product.in_stock
                      ? "https://schema.org/InStock"
                      : "https://schema.org/PreOrder",
                  }
                : undefined,
          }),
        }}
      />

      <nav className="text-sm text-muted-foreground" aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-x-1.5">
          <li>
            <Link to="/" className="hover:text-primary">
              Accueil
            </Link>
          </li>
          {[parentCategory, category].map(
            (c) =>
              c && (
                <li key={c.slug} className="flex items-center gap-x-1.5">
                  <ChevronRight className="size-3.5" aria-hidden="true" />
                  <Link
                    to="/categorie/$slug"
                    params={{ slug: c.slug }}
                    className="hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ),
          )}
          <li className="flex min-w-0 items-center gap-x-1.5">
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <span className="truncate text-foreground" aria-current="page">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ProductGallery
            key={product.slug}
            images={product.images}
            alt={product.name}
            imageRef={imageRef}
          />
          <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1">
            {discount && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-primary-foreground">
                -{discount} %
              </span>
            )}
            {product.is_new && (
              <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-ink-foreground">
                Nouveau
              </span>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-32 lg:self-start">
          {brand && (
            <div className="flex items-center gap-3">
              <BrandLogo brand={brand} className="text-base text-muted-foreground" />
              {brand.exclusive && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Distributeur exclusif
                </span>
              )}
            </div>
          )}
          <h1 className="mt-2 text-3xl leading-tight">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Référence : {product.sku}</p>

          <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(oldPrice)}
              </span>
            )}
            {price !== null && <span className="text-sm text-muted-foreground">TTC</span>}
          </div>

          <p
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 text-sm font-medium",
              product.in_stock ? "text-success" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                product.in_stock ? "bg-success" : "bg-muted-foreground",
              )}
            />
            {product.in_stock ? "En stock" : "Sur commande"}
          </p>

          <p className="mt-5 text-muted-foreground">{product.short_description}</p>

          <div ref={buyRef} className="mt-6 flex flex-wrap items-center gap-3">
            {price !== null ? (
              <>
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <Button size="lg" className="press flex-1" onClick={onAdd}>
                  <AddedLabel added={added} addedLabel="Ajouté au panier" />
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="press flex-1">
                <Link to="/devis">
                  <FileText className="size-4" /> Demander un devis
                </Link>
              </Button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="flex-1">
              <a
                href={whatsappLink(
                  `Bonjour DISTRICAP, je souhaite commander : ${product.name} (réf. ${product.sku}).`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppGlyph className="size-4" /> Commander via WhatsApp
              </a>
            </Button>
            {price !== null && (
              <Button asChild variant="outline" className="flex-1">
                <Link to="/devis">
                  <FileText className="size-4" /> Demander un devis
                </Link>
              </Button>
            )}
          </div>

          <ul className="mt-6 grid gap-2 border-t border-border pt-5 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" /> Livraison partout au Maroc
            </li>
            <li className="flex items-center gap-2">
              <Banknote className="size-4 text-primary" /> Paiement à la livraison
            </li>
          </ul>
        </div>
      </div>

      <AnimatedTabs key={product.slug} tabs={tabs} defaultValue="description" className="mt-14" />

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">Produits similaires</h2>
          <ProductCarousel
            key={product.slug}
            products={similar}
            label="Produits similaires"
            className="mt-6"
          />
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">Vus récemment</h2>
          <ProductCarousel
            products={recentlyViewed}
            label="Produits vus récemment"
            className="mt-6"
          />
        </section>
      )}

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur transition-transform duration-300 ease-entrance lg:hidden",
          showStickyBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showStickyBar}
        inert={!showStickyBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-muted-foreground">{product.name}</p>
            <p className="font-bold text-primary">{formatPrice(price)}</p>
          </div>
          {price !== null ? (
            <Button className="press" onClick={() => addToCart(quantity, null)}>
              <AddedLabel added={added} label="Ajouter" />
            </Button>
          ) : (
            <Button asChild>
              <Link to="/devis">Demander un devis</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
