import { prisma } from "@/lib/prisma";
import { ProfileForm, ProjectManager } from "./forms";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await prisma.profile.findFirst();
  const projects = await prisma.project.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Admin dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold">Manage your portfolio</h1>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900">
              Log out
            </button>
          </form>
        </div>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h2 className="text-xl font-semibold">Profile</h2>
          <ProfileForm profile={profile} />
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8">
          <ProjectManager projects={projects} />
        </section>
      </div>
    </main>
  );
}
