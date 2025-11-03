'use client';
import { useState } from 'react';

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const checkout = async (price: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: price })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Checkout failed.');
    } finally { setLoading(false); }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Choose a plan</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold">Pro</h2>
          <p className="opacity-80">AI cover letters, daily focus</p>
          <button className="border px-4 py-2 rounded mt-3" disabled={loading}
            onClick={() => checkout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTH!)}>Subscribe</button>
        </div>
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold">Premium</h2>
          <p className="opacity-80">+ Interview coach, resume critique</p>
          <button className="border px-4 py-2 rounded mt-3" disabled={loading}
            onClick={() => checkout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTH!)}>Subscribe</button>
        </div>
      </div>
    </main>
  );
}
