import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Download, FileText, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  brandName,
  mainImage,
  getCategory,
  getParentCategory,
  getProduct,
  similarProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { whatsappLink } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const { add, setDrawerOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const price = product.price;
  const oldPrice = product.old_price;
  const image = mainImage(product);
  const category = getCategory(product.category);
  const parentCategory = category ? getParentCategory(category) : undefined;
  const specs = product.specs;
  const similar = similarProducts(product, 4);

  const addToCart = () => {
    add(
      {
        slug: product.slug,
        name: product.name,
        sku: product.sku,
        price,
        image,
      },
      quantity,
    );
    setAdded(true);
    toast.success("Produit ajouté au panier", { description: product.name });
    window.setTimeout(() => setAdded(false), 1200);
    window.setTimeout(() => setDrawerOpen(true), 300);
  };

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

      <nav className="text-sm text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-primary">
          Accueil
        </Link>
        {parentCategory && (
          <>
            {" / "}
            <Link
              to="/categorie/$slug"
              params={{ slug: parentCategory.slug }}
              className="hover:text-primary"
            >
              {parentCategory.name}
            </Link>
          </>
        )}
        {category && (
          <>
            {" / "}
            <Link
              to="/categorie/$slug"
              params={{ slug: category.slug }}
              className="hover:text-primary"
            >
              {category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="card-surface overflow-hidden p-6">
          <img
            src={image}
            alt={product.name}
            width={1008}
            height={1008}
            className="mx-auto aspect-square w-full max-w-lg object-contain transition-transform duration-250 hover:scale-105"
          />
        </div>

        <div className="lg:sticky lg:top-40 lg:self-start">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            {brandName(product.brand)}
          </p>
          <h1 className="mt-1 text-3xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Référence : {product.sku}</p>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="text-3xl font-bold text-primary">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(oldPrice)}
              </span>
            )}
            <span className="text-sm text-muted-foreground">TTC</span>
          </div>

          <p
            className={
              product.in_stock
                ? "mt-2 text-sm font-medium text-success"
                : "mt-2 text-sm font-medium text-muted-foreground"
            }
          >
            {product.in_stock ? "En stock – expédié sous 48 h" : "Sur commande"}
          </p>

          {product.short_description && (
            <p className="mt-5 text-muted-foreground">{product.short_description}</p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-md border border-input">
              <button
                type="button"
                aria-label="Diminuer la quantité"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="press p-2"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                aria-label="Augmenter la quantité"
                onClick={() => setQuantity((q) => q + 1)}
                className="press p-2"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {price !== null && (
              <Button size="lg" className="press flex-1" onClick={addToCart}>
                {added ? (
                  <>
                    <Check className="size-4" /> Ajouté au panier
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-4" /> Ajouter au panier
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="glow-pulse flex-1">
              <a
                href={whatsappLink(
                  `Bonjour DISTRICAP, je souhaite commander : ${product.name} (réf. ${product.sku}).`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Commander via WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/devis">
                <FileText className="size-4" /> Demander un devis
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-14">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Caractéristiques techniques</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
          <TabsTrigger value="livraison">Livraison & paiement</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="rise-in max-w-3xl pt-6 text-muted-foreground">
          {product.description}
        </TabsContent>
        <TabsContent value="specs" className="rise-in pt-6">
          <table className="w-full max-w-3xl text-sm">
            <tbody>
              {Object.entries(specs).map(([key, value], i) => (
                <tr
                  key={key}
                  className="rise-in border-b border-border"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <th scope="row" className="py-3 pr-6 text-left font-medium">
                    {key}
                  </th>
                  <td className="py-3 text-muted-foreground">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>
        <TabsContent value="docs" className="rise-in pt-6">
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
        </TabsContent>
        <TabsContent value="livraison" className="rise-in max-w-3xl pt-6 text-muted-foreground">
          <p>
            Livraison partout au Maroc depuis notre dépôt de Casablanca. Le règlement s'effectue en
            espèces à la réception de votre commande (paiement à la livraison). Les frais de
            livraison sont confirmés lors de la validation de la commande par notre équipe.
          </p>
        </TabsContent>
      </Tabs>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl">Produits similaires</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
