import Link from "next/link";

import { pricingPlans } from "@/config/pricing";

const workflowSteps = [
  {
    number: "01",
    title: "Define the interview once",
    description: "Shape role-specific questions, competencies, and evidence expectations before candidates enter the process.",
  },
  {
    number: "02",
    title: "Share a consistent experience",
    description: "Give candidates a structured interview path designed to apply the same job-relevant framework every time.",
  },
  {
    number: "03",
    title: "Review evidence, not vibes",
    description: "Connect assessment signals back to interview evidence so hiring teams can make the final decision with context.",
  },
] as const;

const productPrinciples = [
  {
    title: "Structured by design",
    description: "Interview plans start from explicit role requirements, questions, and observable evidence—not improvised scoring criteria.",
  },
  {
    title: "Evidence-linked review",
    description: "The product is designed to keep assessment reasoning connected to candidate responses instead of opaque ranking signals.",
  },
  {
    title: "Humans stay accountable",
    description: "AI can help collect and organize job-relevant evidence, but humans make hiring decisions.",
  },
] as const;

const faqs = [
  {
    question: "Does Hire Evidence make hiring decisions?",
    answer: "No. The product boundary is explicit: AI assists structured evidence review, while people remain responsible for hiring decisions.",
  },
  {
    question: "Is this another generic HR suite?",
    answer: "No. Hire Evidence is focused on structured interviewing, interview evidence, and review workflows rather than broad HR administration.",
  },
  {
    question: "What is included in pricing today?",
    answer: "Pricing is intentionally a placeholder while the product foundation is being built. Billing and entitlements are a later milestone.",
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f7f2] text-[#111a18]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f7f7f2]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="Hire Evidence home">
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-xl bg-[#153b32] text-sm font-bold text-white">H</span>
            <span>Hire Evidence</span>
          </Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm text-[#4d5b57] md:flex">
            <a href="#how-it-works" className="transition hover:text-[#111a18]">How it works</a>
            <a href="#security-fairness" className="transition hover:text-[#111a18]">Security &amp; fairness</a>
            <a href="#pricing" className="transition hover:text-[#111a18]">Pricing</a>
            <a href="#faq" className="transition hover:text-[#111a18]">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="rounded-full px-3 py-2 text-sm font-medium text-[#30423d] transition hover:bg-black/5">
              Log in
            </Link>
            <Link href="/auth/signup" className="hidden rounded-full bg-[#153b32] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0e2d26] sm:inline-flex">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-black/5">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_70%_15%,rgba(178,220,202,0.62),transparent_38%),radial-gradient(circle_at_15%_30%,rgba(233,205,147,0.42),transparent_31%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-10 lg:py-32">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-[#153b32]/15 bg-white/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#315e52]">
                Evidence-first interviewing
              </p>
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.045em] text-[#10231f] sm:text-6xl lg:text-7xl">
                Create structured AI interviews once. Interview candidates anytime.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[#52605c] sm:text-xl">
                Scale interviews without sacrificing structure. Create role-aware interviewers, share a consistent candidate experience, and review evidence-backed assessments with humans in control.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup" className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#153b32] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(21,59,50,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0e2d26]">
                  Create your first interviewer
                </Link>
                <a href="#how-it-works" className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white/65 px-6 text-sm font-semibold text-[#263732] transition hover:bg-white">
                  Watch demo
                </a>
              </div>
              <p className="mt-5 text-sm leading-6 text-[#66736f]">Built around structured evidence and human oversight—not automated hiring decisions.</p>
            </div>

            <div className="rounded-[2rem] border border-white/80 bg-white/72 p-4 shadow-[0_28px_80px_rgba(24,54,46,0.12)] backdrop-blur sm:p-6">
              <div className="rounded-[1.5rem] border border-black/6 bg-[#10231f] p-6 text-white sm:p-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#a9c7bf]">Interview plan</p>
                    <p className="mt-2 text-lg font-semibold">Senior Full Stack Engineer</p>
                  </div>
                  <span className="rounded-full bg-[#d8eadf] px-3 py-1 text-xs font-semibold text-[#183c33]">Structured</span>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    ["Architecture", "Role evidence"],
                    ["TypeScript", "Role evidence"],
                    ["Problem solving", "Role evidence"],
                  ].map(([label, meta]) => (
                    <div key={label} className="flex items-center justify-between rounded-2xl bg-white/7 px-4 py-4">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-xs text-[#a9c7bf]">{meta}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl bg-[#d8eadf] p-4 text-[#173a31]">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em]">Review principle</p>
                  <p className="mt-2 text-sm leading-6">Assessment reasoning stays connected to job-relevant interview evidence.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" aria-labelledby="how-it-works-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#397264]">How it works</p>
            <h2 id="how-it-works-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Structure first. Evidence throughout.</h2>
            <p className="mt-4 text-lg leading-8 text-[#5d6965]">A focused workflow for teams that want repeatable interviews without handing hiring authority to an algorithm.</p>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <li key={step.number} className="rounded-[1.6rem] border border-black/7 bg-white/65 p-7">
                <span className="text-sm font-semibold text-[#56877a]">{step.number}</span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-7 text-[#66716d]">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-y border-black/5 bg-[#10231f] text-white">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-sm font-semibold text-[#9bc4b8]">Built for interview quality</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Move the conversation from instinct to evidence.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {productPrinciples.map((principle) => (
                  <article key={principle.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                    <h3 className="text-lg font-semibold">{principle.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#b8c9c4]">{principle.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="security-fairness" aria-labelledby="security-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="grid gap-10 rounded-[2rem] border border-black/7 bg-[#e8efe9] p-7 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:p-14">
            <div>
              <p className="text-sm font-semibold text-[#397264]">Product boundary</p>
              <h2 id="security-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Security &amp; fairness are constraints, not add-ons.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/75 p-5">
                <h3 className="font-semibold">Human decision authority</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6965]">Humans make hiring decisions. The system is designed to support evidence review, not autonomous hire or reject actions.</p>
              </div>
              <div className="rounded-2xl bg-white/75 p-5">
                <h3 className="font-semibold">Job-relevant evidence</h3>
                <p className="mt-2 text-sm leading-6 text-[#5d6965]">The product avoids prohibited appearance, emotion, accent, personality, and deception scoring.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" aria-labelledby="pricing-title" className="border-y border-black/5 bg-white/45">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#397264]">Pricing</p>
              <h2 id="pricing-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Start with the workflow. Add billing when it is ready.</h2>
              <p className="mt-4 text-lg leading-8 text-[#5d6965]">The current pricing card is product configuration, not an entitlement or billing promise.</p>
            </div>
            <div className="mt-10 max-w-xl">
              {pricingPlans.map((plan) => (
                <article key={plan.name} className="rounded-[1.75rem] border border-black/8 bg-white p-7 shadow-[0_18px_50px_rgba(21,59,50,0.08)] sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <span className="rounded-full bg-[#eef3ef] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#527067]">Preview</span>
                  </div>
                  <p className="mt-4 leading-7 text-[#606c68]">{plan.description}</p>
                  <p className="mt-7 text-3xl font-semibold tracking-tight">{plan.priceLabel}</p>
                  <Link href={plan.ctaHref} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#153b32] px-5 text-sm font-semibold text-white transition hover:bg-[#0e2d26]">
                    {plan.ctaLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-[#397264]">FAQ</p>
              <h2 id="faq-title" className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Frequently asked questions</h2>
            </div>
            <div className="divide-y divide-black/8 border-y border-black/8">
              {faqs.map((item) => (
                <article key={item.question} className="py-6">
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="mt-2 max-w-2xl leading-7 text-[#606c68]">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#d9e9df] px-7 py-12 sm:px-12 sm:py-16 lg:flex lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#397264]">Build the interview deliberately</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[#10231f] sm:text-4xl">Scale the process without giving up structure.</h2>
            </div>
            <Link href="/auth/signup" className="mt-8 inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-[#153b32] px-6 text-sm font-semibold text-white transition hover:bg-[#0e2d26] lg:mt-0">
              Create your first interviewer
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/6 px-5 py-8 text-sm text-[#65716d] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Hire Evidence · structured interviewing with human oversight.</p>
          <div className="flex gap-5">
            <Link href="/auth/login" className="hover:text-[#111a18]">Log in</Link>
            <a href="#security-fairness" className="hover:text-[#111a18]">Security &amp; fairness</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
