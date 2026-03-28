import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    productId: string;
    variantSku: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    size: string;
    color: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (variantSku: string, size?: string, color?: string) => void;
    updateQuantity: (variantSku: string, size: string | undefined, color: string | undefined, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.variantSku === item.variantSku && i.size === item.size && i.color === item.color
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.variantSku === item.variantSku && i.size === item.size && i.color === item.color
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (variantSku, size, color) =>
                set((state) => ({
                    items: state.items.filter((i) => !(i.variantSku === variantSku && i.size === size && i.color === color)),
                })),
            updateQuantity: (variantSku, size, color, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.variantSku === variantSku && i.size === size && i.color === color ? { ...i, quantity } : i
                    ),
                })),
            clearCart: () => set({ items: [] }),
            getTotalItems: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.quantity, 0);
            },
            getTotalPrice: () => {
                const state = get();
                return state.items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
