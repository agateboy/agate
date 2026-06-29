import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

export async function Hero() {
  await ensureSeedData();
  const profile = await prisma.profile.findFirst();

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white/70 p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur md:p-12">
      <div className="flex gap-8 items-start">
        <div className="flex-shrink-0">
          {profile?.profileImageUrl ? (
            <div className="rounded-[1.5rem] overflow-hidden bg-zinc-200 aspect-square w-40 h-40">
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-[1.5rem] bg-zinc-200 aspect-square w-40 h-40 flex items-center justify-center">
              <span className="text-zinc-400 text-sm">No image yet</span>
            </div>
          )}
        </div>

        <div className="space-y-6 flex-1">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Portfolio</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            {profile?.name ?? "Your Name"}
          </h1>
          <p className="text-lg text-zinc-600">{profile?.role ?? "Creative developer"}</p>
          <p className="max-w-2xl text-base leading-8 text-zinc-600">{profile?.description ?? "A concise summary will appear here as soon as it is saved in the admin dashboard."}</p>
          <div className="flex flex-wrap gap-3">
            {profile?.githubUrl ? (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
                GitHub
              </a>
            ) : null}
            {profile?.linkedinUrl ? (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100">
                LinkedIn
              </a>
            ) : null}
            {profile?.cvFileUrl ? (
              <a href={profile.cvFileUrl} download className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
                Download CV
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
