'use client';

import Link from 'next/link';
import type { CartItem } from './CartItemRow';

interface OrderSummaryProps {
  items: CartItem[];
  deliverySlot: 'mandi' | 'standard';
  onDeliverySlotChange: (slot: 'mandi' | 'standard') => void;
  useCredit: boolean;
  onUseCreditChange: (val: boolean) => void;
  availableCredit: number;
}

export default function OrderSummary({
  items,
  deliverySlot,
  onDeliverySlotChange,
  useCredit,
  onUseCreditChange,
  availableCredit,
}: OrderSummaryProps) {
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

  const formatCurrencyShort = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  // Calculate subtotal (sum of pricePerUnit * quantity * unitsPerCarton)
  const subtotal = items.reduce((sum, item) => sum + item.pricePerUnit * item.quantity * item.unitsPerCarton, 0);
  const retailTotal = items.reduce((sum, item) => sum + item.mrp * item.quantity * item.unitsPerCarton, 0);
  const savings = retailTotal - subtotal;

  // Tax calc – average GST split into CGST + SGST
  const totalGst = items.reduce((sum, item) => {
    const lineTotal = item.pricePerUnit * item.quantity * item.unitsPerCarton;
    return sum + lineTotal * (item.gstPercent / 100);
  }, 0);
  const cgst = totalGst / 2;
  const sgst = totalGst / 2;

  const grandTotal = subtotal + totalGst;

  const deliveryFee = deliverySlot === 'standard' ? 49 : 0;
  const finalTotal = grandTotal + deliveryFee;

  return (
    <div className="sticky top-24 flex flex-col gap-6">
      {/* Main Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7c3bed]">receipt_long</span>
          Order Summary
        </h3>

        {/* Financials */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal (Excl. Tax)</span>
            <span className="font-mono text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">CGST (9%)</span>
            <span className="font-mono text-slate-900">{formatCurrency(cgst)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">SGST (9%)</span>
            <span className="font-mono text-slate-900">{formatCurrency(sgst)}</span>
          </div>
          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery Fee</span>
              <span className="font-mono text-slate-900">{formatCurrency(deliveryFee)}</span>
            </div>
          )}
          <div className="h-px bg-slate-200 my-2" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-900">Grand Total</span>
            <span className="font-mono font-bold text-xl text-slate-900">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        {/* Savings */}
        <div className="bg-green-50 border border-green-200/60 rounded-lg p-3 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-[20px]">savings</span>
            <span className="text-sm font-medium text-green-600">Total Savings vs Retail</span>
          </div>
          <span className="font-mono font-bold text-green-600">{formatCurrency(savings)}</span>
        </div>

        {/* Pay using Credit */}
        <div className="mb-6">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex flex-col">
              <span className="font-medium text-slate-900 flex items-center gap-2">
                Pay using Credit
                <span className="material-symbols-outlined text-slate-400 text-[16px]" title="Use your available credit line for this order">info</span>
              </span>
              <span className="text-xs text-slate-500 mt-0.5">Available: {formatCurrencyShort(availableCredit)}</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                checked={useCredit}
                onChange={(e) => onUseCreditChange(e.target.checked)}
                className="sr-only peer"
                type="checkbox"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3bed]" />
            </div>
          </label>
        </div>

        {/* Delivery Preference */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-900 mb-3">Delivery Preference</label>
          <div className="grid grid-cols-1 gap-3">
            {/* Morning Mandi Slot */}
            <div className="relative">
              <input
                checked={deliverySlot === 'mandi'}
                onChange={() => onDeliverySlotChange('mandi')}
                className="peer sr-only"
                id="slot-mandi"
                name="delivery-slot"
                type="radio"
              />
              <label
                className="flex p-3 border rounded-lg cursor-pointer focus:outline-none hover:bg-slate-50 peer-checked:ring-2 peer-checked:ring-[#7c3bed] peer-checked:border-[#7c3bed] border-slate-200 transition-all"
                htmlFor="slot-mandi"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">Morning Mandi Slot</p>
                      <p className="text-xs text-slate-500">Tomorrow, 4:00 AM - 6:00 AM</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600 uppercase">Free</span>
                </div>
              </label>
            </div>

            {/* Standard Delivery */}
            <div className="relative">
              <input
                checked={deliverySlot === 'standard'}
                onChange={() => onDeliverySlotChange('standard')}
                className="peer sr-only"
                id="slot-standard"
                name="delivery-slot"
                type="radio"
              />
              <label
                className="flex p-3 border rounded-lg cursor-pointer focus:outline-none hover:bg-slate-50 peer-checked:ring-2 peer-checked:ring-[#7c3bed] peer-checked:border-[#7c3bed] border-slate-200 transition-all"
                htmlFor="slot-standard"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">Standard Delivery</p>
                      <p className="text-xs text-slate-500">Tomorrow, 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">₹49</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full bg-[#7c3bed] hover:bg-[#6926d4] text-white py-3.5 px-4 rounded-xl font-bold shadow-md shadow-[#7c3bed]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm lg:text-base">
          Place Wholesale Order
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <p className="text-xs text-center text-slate-500 mt-4">
          By placing this order, you agree to our{' '}
          <Link className="underline hover:text-[#7c3bed] transition-colors" href="#">
            B2B Terms of Service
          </Link>
          .
        </p>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center justify-center gap-4 py-2 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          <span className="text-[10px] font-medium uppercase tracking-wider">Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span className="text-[10px] font-medium uppercase tracking-wider">Buyer Protection</span>
        </div>
      </div>
    </div>
  );
}
