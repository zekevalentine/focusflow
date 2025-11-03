import Link from 'next/link';

export default function LandingPage() {
  return (
    <main>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Land your next job faster—with focus, structure, and AI.
          </h1>
          <p className="mt-4 text-lg opacity-90">
            Job Hunter FocusFlow organizes your search, writes tailored cover letters, and keeps you consistent every day.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/dashboard" className="border px-5 py-3 rounded font-medium">Open app</Link>
            <Link href="#pricing" className="border px-5 py-3 rounded font-medium">See pricing</Link>
          </div>
          <div className="mt-6 text-sm opacity-70">
            No credit card required • Free plan available
          </div>
        </div>
        <div className="border rounded-xl p-4 shadow-sm">
          <div className="text-sm opacity-80">Product preview</div>
          <div className="mt-2 grid gap-3">
            <div className="border rounded p-3">
              <div className="font-semibold">Kanban</div>
              <div className="text-sm opacity-75">Move roles from Wishlist → Offer with drag & drop.</div>
            </div>
            <div className="border rounded p-3">
              <div className="font-semibold">AI Cover Letters</div>
              <div className="text-sm opacity-75">Paste resume + JD → tailored draft in seconds.</div>
            </div>
            <div className="border rounded p-3">
              <div className="font-semibold">Daily Focus</div>
              <div className="text-sm opacity-75">A simple daily plan to keep momentum.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold">Why FocusFlow</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Feature title="Stay organized" desc="Track applications, interviews, offers—and what’s next." />
            <Feature title="Write better" desc="AI-tailored cover letters that highlight your wins." />
            <Feature title="Be consistent" desc="Daily plan + accountability to avoid burnout." />
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Plan name="Free" price="0 NOK/mo" bullets={[
              'Job tracker',
              'Basic planner',
              '10 AI prompts / month',
            ]} cta={{ label: 'Get started', href: '/dashboard' }} />
            <Plan name="Pro" price="100 NOK/mo" highlight bullets={[
              'Unlimited job entries',
              'AI cover letters & daily plan',
              'Email support',
            ]} cta={{ label: 'Subscribe', href: '/subscribe' }} />
            <Plan name="Premium" price="199 NOK/mo" bullets={[
              'Interview Coach + Resume critique',
              'Priority support',
              'Early access features',
            ]} cta={{ label: 'Subscribe', href: '/subscribe' }} />
          </div>
        </div>
      </section>

      <Newsletter />
      <FAQ />
    </main>
  );
}

function Feature({ title, desc }:{ title:string; desc:string }){
  return (
    <div className="border rounded-xl p-5 bg-white">
      <div className="font-semibold">{title}</div>
      <div className="text-sm opacity-75 mt-1">{desc}</div>
    </div>
  );
}

function Plan({ name, price, bullets, cta, highlight }:{ name:string; price:string; bullets:string[]; cta:{label:string; href:string}; highlight?:boolean }){
  return (
    <div className={"border rounded-xl p-5 " + (highlight ? "ring-2 ring-blue-400" : "")}>
      <div className="text-lg font-semibold">{name}</div>
      <div className="text-2xl font-bold mt-2">{price}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {bullets.map((b,i)=>(<li key={i}>• {b}</li>))}
      </ul>
      <a href={cta.href} className="inline-block mt-5 border px-4 py-2 rounded">{cta.label}</a>
    </div>
  );
}

function Newsletter(){
  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h3 className="text-xl font-semibold">Join the Job Hunt newsletter</h3>
        <p className="opacity-80 text-sm mt-1">Short, practical tips to get hired faster.</p>
        <form action="/api/marketing/newsletter" method="post" className="mt-4 flex gap-2 justify-center">
          <input name="email" type="email" required placeholder="your@email.com" className="border p-2 rounded min-w-[260px]" />
          <button className="border px-4 py-2 rounded" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function FAQ(){
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4">
          <Q q="Is there a free plan?" a="Yes. You can use the tracker and basic planner for free, forever." />
          <Q q="Can I cancel anytime?" a="Absolutely. Manage your subscription from the Account page." />
          <Q q="Do you store my resume?" a="Only if you paste it into the tool. You can delete your data anytime." />
        </div>
      </div>
    </section>
  );
}

function Q({ q, a }:{ q:string; a:string }){
  return (
    <div className="border rounded p-4">
      <div className="font-medium">{q}</div>
      <div className="text-sm opacity-75 mt-1">{a}</div>
    </div>
  );
}
