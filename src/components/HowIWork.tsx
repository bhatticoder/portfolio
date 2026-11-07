"use client";

const steps = [
  {
    num: "01",
    title: "30-min scoping call",
    desc: "You describe the problem. I tell you honestly if it's solvable and what it would take.",
  },
  {
    num: "02",
    title: "Written plan",
    desc: "Scope, risks, timeline and price in writing within one business day.",
  },
  {
    num: "03",
    title: "Build in small slices",
    desc: "A working piece you can see every week, not a big reveal at the end.",
  },
  {
    num: "04",
    title: "Handover",
    desc: "You own the code. It's documented so another engineer can continue.",
  },
];

export function HowIWork() {
  return (
    <section id="process" className="py-20 border-t border-line">
      <div>
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          02 / The Process
        </span>
        <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-ink tracking-tight">
          How a contract with me runs
        </h2>
        <p className="mt-2 text-muted text-base max-w-xl font-sans">
          Simple, predictable milestones with zero surprises. Clear
          communication during your working hours.
        </p>
      </div>

      {/* Horizontal 4-step timeline (vertical on mobile) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="p-6 border border-line bg-surface rounded-xl shadow-xs relative flex flex-col justify-between"
          >
            <div>
              <div className="font-serif text-3xl sm:text-4xl text-accent font-normal mb-3">
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-ink font-sans">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                {step.desc}
              </p>
            </div>
            <div className="mt-6 pt-3 border-t border-line/40 text-xs font-mono text-muted">
              Step {idx + 1} of 4
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

