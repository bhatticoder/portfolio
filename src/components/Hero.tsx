"use client";

import Image from "next/image";
import { useSiteSettings } from "@/lib/useSiteSettings";
import {
  FileCheck,
  Video,
  Sparkles,
  Rocket,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";

const capabilities = [
  {
    icon: FileCheck,
    title: "Automate repetitive checks",
    desc: "Documents, reports and code reviewed automatically, with a person stepping in when it matters.",
  },
  {
    icon: Video,
    title: "Make video useful",
    desc: "Cameras and recordings turned into data: vehicles, plates, counts, events.",
  },
  {
    icon: Sparkles,
    title: "Add AI to your product",
    desc: "Chat, search and summarization built on your own data, safely.",
  },
  {
    icon: Rocket,
    title: "Ship the full system",
    desc: "Backend, web app and deployment, so it runs, not just demos.",
  },
];

export function Hero() {
  const settings = useSiteSettings();

  return (
    <section className="pt-10 pb-16 sm:pt-16 sm:pb-24">
      {/* Top Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Photo Card on Mobile (shown first) */}
        <div className="lg:hidden flex justify-center">
          <div className="w-48 aspect-[4/5] rounded-2xl overflow-hidden border border-line bg-surface shadow-xs relative">
            <Image
              src={settings.avatarUrl || "/profile.jpg"}
              alt={settings.name}
              fill
              priority
              sizes="192px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Text Left Column (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Availability pill with subline */}
          <div className="flex flex-col gap-1 items-start">
            <AvailabilityBadge />
            <span className="text-xs text-muted font-sans ml-1">
              Overlaps UK and US business hours
            </span>
          </div>

          {/* H1 (serif, 56 to 64px desktop) */}
          <h1 className="mt-6 font-serif text-[42px] sm:text-[54px] lg:text-[62px] leading-[1.08] tracking-tight text-ink">
            I build AI systems that do{" "}
            <span className="text-accent underline decoration-line/80 underline-offset-4">
              real work
            </span>{" "}
            for your business.
          </h1>

          {/* Sub (plain language, 20px) */}
          <p className="mt-6 text-lg sm:text-[20px] text-muted leading-relaxed font-sans max-w-2xl">
            Tools that read documents, watch video, check your code, and flag
            problems automatically, so your team spends time on decisions
            instead of repetitive checking. Every project below has a demo you
            can open.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#book"
              className="inline-flex items-center justify-center px-6 h-12 bg-accent text-white font-sans text-base font-medium rounded-xl hover:opacity-95 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-sm"
            >
              Book a free 30-min call
            </a>
            <a
              href="#work"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-surface text-ink font-sans text-base font-medium border border-line rounded-xl hover:bg-paper hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-xs"
            >
              <span>See my work</span>
              <ArrowRight className="w-4 h-4 text-muted" strokeWidth={1.5} />
            </a>
          </div>

          {/* Proof Strip */}
          <div className="mt-10 w-full pt-8 border-t border-line grid grid-cols-3 divide-x divide-line">
            <div className="pr-4 sm:pr-6">
              <div className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                4
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted font-sans leading-snug">
                systems built and documented
              </div>
            </div>
            <div className="px-4 sm:px-6">
              <div className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Full
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted font-sans leading-snug">
                overlap with UK and US business hours
              </div>
            </div>
            <div className="pl-4 sm:px-6">
              <div className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                1 day
              </div>
              <div className="mt-1 text-xs sm:text-sm text-muted font-sans leading-snug">
                reply time on every inquiry
              </div>
            </div>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs sm:text-[13px] text-muted font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0" strokeWidth={1.5} />
            <span>
              Works with startups, agencies and engineering teams · NDA before
              any code is shared
            </span>
          </p>
        </div>

        {/* Photo Card on Desktop (5 cols on lg) */}
        <div className="hidden lg:col-span-5 lg:flex flex-col items-center justify-center pl-4">
          <div className="w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-line bg-surface shadow-sm relative group">
            <Image
              src={settings.avatarUrl || "/profile.jpg"}
              alt={settings.name}
              fill
              priority
              sizes="340px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="mt-3 text-center text-xs text-muted font-mono tracking-wide">
            {settings.name} · {settings.location}
          </div>
        </div>
      </div>

      {/* "What I can do for you" row of 4 plain-language cards */}
      <div className="mt-20">
        <div className="mb-4 text-xs uppercase tracking-widest text-muted font-mono">
          Services & Capabilities
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 border border-line bg-surface rounded-xl shadow-xs flex flex-col justify-between hover:border-line/80 hover:-translate-y-0.5 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-paper border border-line flex items-center justify-center text-accent mb-4">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-base font-semibold text-ink font-sans">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
