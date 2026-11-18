import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { img } from "@/data/images";
import { formatPrice } from "@/lib/pricing";
import { useStore, type CartLineDetailed } from "@/lib/store";

export function CartLineItem({ line, onNavigate }: { line: CartLineDetailed; onNavigate?: () => void }) {
  const { updateQty, removeFromCart } = useStore();
  const { product, size, qty } = line;
  const sizeInfo = product.sizes.find((s) => s.label === size);
  return (
    <li className="flex gap-3 py-4">
      <Link to="/products/$slug" params={{ slug: product.slug }} onClick={onNavigate} className="shrink-0">
        <img src={img(product.images[0] ?? "")} alt={product.title} width={88} height={110} loading="lazy" className="h-[110px] w-[88px] rounded-lg border border-border object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link to="/products/$slug" params={{ slug: product.slug }} onClick={onNavigate} className="line-clamp-2 text-sm font-semibold hover:text-sage-deep">
          {product.title}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Size {size}{sizeInfo && sizeInfo.age !== size ? ` (${sizeInfo.age})` : ""} · {product.designCode}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-border bg-card">
            <button type="button" onClick={() => updateQty(product.id, size, qty - 1)} aria-label={`Decrease quantity of ${product.title}`} className="grid size-8 place-items-center rounded-full hover:bg-secondary">
              <Minus className="size-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => updateQty(product.id, size, qty + 1)} aria-label={`Increase quantity of ${product.title}`} className="grid size-8 place-items-center rounded-full hover:bg-secondary">
              <Plus className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">{formatPrice(line.lineTotal)}</span>
            <button type="button" onClick={() => removeFromCart(product.id, size)} aria-label={`Remove ${product.title}`} className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
