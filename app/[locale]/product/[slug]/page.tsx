import { notFound } from 'next/navigation';
import { formatPrice, getAllProducts, getProductBySlug } from '@/lib/products';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  PackageIcon,
  ShieldIcon,
  TruckIcon,
} from '@/components/icons';
import Link from 'next/link';
import { getCurrency } from '@/lib/currency/get-currency';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Drunken Arsenal`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const currency = await getCurrency();

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getAllProducts())
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 2}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-sm font-semibold text-primary uppercase tracking-wide">
                {product.category}
              </span>
              {product.category === 'bundle' && (
                <span className="px-3 py-1 bg-destructive/10 border border-destructive/20 rounded-md text-sm font-bold text-destructive">
                  SAVE UP TO 20%
                </span>
              )}
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price, currency)}
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <PackageIcon className="h-4 w-4" />
              <span
                className={
                  product.stock > 0
                    ? 'text-green-600 font-medium'
                    : 'text-destructive font-medium'
                }
              >
                {product.stock > 0
                  ? `${product.stock} in stock - Ready to ship`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Add to Cart */}
            <div className="pt-4">
              <AddToCartButton product={product} />
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <TruckIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    On orders over $50
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Quality Guaranteed</p>
                  <p className="text-sm text-muted-foreground">
                    Premium tactical-grade materials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PackageIcon className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">30-Day Returns</p>
                  <p className="text-sm text-muted-foreground">
                    Not satisfied? Full refund guaranteed
                  </p>
                </div>
              </div>
            </div>

            {/* Age Warning */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-bold text-destructive text-center">
                18+ ONLY - DRINK RESPONSIBLY - NOT FOR SALE TO MINORS
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t pt-16">
            <h2 className="text-3xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group block"
                >
                  <div className="bg-card border rounded-lg overflow-hidden hover:border-primary transition-colors">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={relatedProduct.images[0] || '/placeholder.svg'}
                        alt={relatedProduct.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="font-bold whitespace-nowrap">
                          {formatPrice(relatedProduct.price, currency)}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {relatedProduct.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
