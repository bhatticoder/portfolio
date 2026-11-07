import { Nav } from "@/components/Nav";
import { BookCall } from "@/components/BookCall";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Book a Scoping Call — Muhammad Mudassar Bhatti",
  description:
    "Schedule a 30-minute technical scoping call to discuss AI engineering constraints, timelines, and deliverables.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-white">
      <Nav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <BookCall />
      </main>

      <Footer />
    </div>
  );
}

