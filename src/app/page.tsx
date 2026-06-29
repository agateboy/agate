import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f1f5f9_45%,_#e2e8f0)] px-4 py-12 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <Hero />
        <Projects searchParams={params} />
      </div>
    </main>
  );
}
