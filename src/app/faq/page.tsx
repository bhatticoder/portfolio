import { Nav } from "@/components/Nav";
import { WorkingTerms } from "@/components/WorkingTerms";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Terms & FAQ — Muhammad Mudassar Bhatti",
  description:
    "Frequently asked questions regarding time-zone overlap, contract capacity, NDA signing, payment terms, and code ownership.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <WorkingTerms />
      </main>

      <Footer />
    </div>
  );
}

