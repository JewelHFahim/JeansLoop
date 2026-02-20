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
    removeItem: (variantSku: string) => void;
    updateQuantity: (variantSku: string, quantity: number) => void;
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
                        (i) => i.variantSku === item.variantSku
                    );
                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.variantSku === item.variantSku
                                    ? { ...i, quantity: i.quantity + item.quantity }
                                    : i
                            ),
                        };
                    }
                    return { items: [...state.items, item] };
                }),
            removeItem: (variantSku) =>
                set((state) => ({
                    items: state.items.filter((i) => i.variantSku !== variantSku),
                })),
            updateQuantity: (variantSku, quantity) =>
                set((state) => ({
                    items: state.items.map((i) =>
                        i.variantSku === variantSku ? { ...i, quantity } : i
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
