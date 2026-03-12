'use client';

import { useState } from 'react';
import CartHeader from './components/CartHeader';
import CartTable from './components/CartTable';
import OrderSummary from './components/OrderSummary';
import type { CartItem } from './components/CartItemRow';

const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Fortune Chakki Atta (10kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2y9PPOGvyYi7LB8Z1inqTWQdB2QmLmLBCCUWnnIMoUeDywxV_iTPLuUA1HBlbUWViCggah0avczzmsjWB4IJcXiLy0RNpzkXVcF7bEkSboQld3Roun6Z1jhtxzw3kQkQuwlxGDJRRo_Z4lZClEFQdwR-PbyYwsurwDE94q8WkXghf4HoY9ecMWdFrQXZOSNva752kVZ_QKqz5i8wi371mfnvifFPYa45ZQuQTgYVExTuiVldC1Ak2AZAj-CowA5IhR0EaLuYG9j4',
    sku: 'FCT-10KG-001',
    packSize: '10kg Bag',
    unitsPerCarton: 10,
    stockStatus: 'in-stock',
    pricePerUnit: 420,
    mrp: 450,
    gstPercent: 5,
    quantity: 5,
  },
  {
    id: '2',
    name: 'Tata Salt (1kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8pTJnzG8lRgfkoxO4kPU_xuTNJHp8V8bA9HkEEePluDPYratwELnAA0vKTWoPcLmrtU5u5T_rPe7uW80sqqVocjV-Ng7cSk6JAeFaSBY53TjqKSWigMH_zxjkf7a3QwRFn187qbQz6mDqUKBfkEIIub4PzhOE_gvAoLCmt8G9EPLnjGvLXK4_S84im2h5qTjF0x112GDosQ46emoMveWEsrtFBfQRMjDjjUck-lRGIxistgZYQncU_z3eUfIc2yMRbsq7r26vqbA',
    sku: 'TST-1KG-092',
    packSize: '1kg Pack',
    unitsPerCarton: 10,
    stockStatus: 'in-stock',
    pricePerUnit: 18,
    mrp: 20,
    gstPercent: 12,
    quantity: 10,
  },
  {
    id: '3',
    name: 'Maggi Noodles (Pack of 12)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkou_7ViCQDNpxj1ymdOvHAjryGAd3eLSHr6QdU8xqB4xmUlP8yChcnOTf-HvRE8a98s6qTnKSxHq50VX7ph7dEaS0nKYlmL8J-jBfj27S3a6Gqi1B16iPg0IMZD19CzAXRVdTCLN2xMTtrhiLEvhGZIFnxAVb21gbyTGvXFyqbj5vF-8UsDZiL5bndJCwyd9mTlSIyuN1mdn1uyMuTlyjOGMoEjZCSjuQd3tiMH_hGqH2Hd6aATox-ZaQy2gy5LQdxSnwNdwjaIg',
    sku: 'MGN-12P-445',
    packSize: 'Pack of 12',
    unitsPerCarton: 12,
    stockStatus: 'low-stock',
    pricePerUnit: 110,
    mrp: 125,
    gstPercent: 18,
    quantity: 20,
  },
  {
    id: '4',
    name: 'Surf Excel Matic (2kg)',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh-QJ5NHrK8GgALHA0o8UhP0G1pIO2ZAdnqfTjzKXRmRbteSvkVL-xClx6y6on4tTPg_GtJXII_8QIItDxZogwn4pB3RIMxQ_9yKA-54qjb5kwk_t3aV06kE96zhl6HNE4cE11RGCIejDSwup7HVxh-wBpwByN8M-sQ4gYjZEOu-ksaV4BCb7TP6lw0t7jyzUibEKqIFnE9LU9CJHxONVLG_tIxdk2DX1xZjlzn6LU5ctSG8MjB1UispwjTHev_UogVj_7mtMV3N0',
    sku: 'SE-2KG-771',
    packSize: '2kg Pack',
    unitsPerCarton: 2,
    stockStatus: 'in-stock',
    pricePerUnit: 340,
    mrp: 380,
    gstPercent: 18,
    quantity: 8,
  },
];

export default function WholesaleCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [deliverySlot, setDeliverySlot] = useState<'mandi' | 'standard'>('mandi');
  const [useCredit, setUseCredit] = useState(true);

  const handleQuantityChange = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
      <CartHeader
        orderId="#WH-2023-892"
        creditLimit={250000}
        creditUsedPercent={25}
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items Table */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {cartItems.length > 0 ? (
            <CartTable
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onClearCart={handleClearCart}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
              <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">shopping_cart</span>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mb-6">Browse the catalog to add products to your wholesale cart.</p>
              <a
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#7c3bed] hover:bg-[#6926d4] text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                Browse Catalog
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-4 relative">
            <OrderSummary
              items={cartItems}
              deliverySlot={deliverySlot}
              onDeliverySlotChange={setDeliverySlot}
              useCredit={useCredit}
              onUseCreditChange={setUseCredit}
              availableCredit={187500}
            />
          </div>
        )}
      </div>
    </main>
  );
}
