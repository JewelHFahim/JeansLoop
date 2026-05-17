import { IProductDocument } from '../models/Product';

interface OrderLineItemInput {
    variantSku?: string;
    size?: string;
}

/** Matches storefront cart pricing: discounted product price, else variant price, else base price. */
export function resolveLineItemPrice(
    product: IProductDocument,
    item: OrderLineItemInput
): number {
    const variant = product.variants?.find(
        (v) =>
            (item.variantSku && v.sku === item.variantSku) ||
            (item.size && v.size === item.size)
    );

    if (product.discountedPrice && product.discountedPrice > 0) {
        return product.discountedPrice;
    }

    return variant?.price ?? product.price;
}

export function findProductVariant(
    product: IProductDocument,
    item: OrderLineItemInput
) {
    return product.variants?.find(
        (v) =>
            (item.variantSku && v.sku === item.variantSku) ||
            (item.size && v.size === item.size)
    );
}
