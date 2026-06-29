import { prisma } from "@/lib/prisma";
import { ensureSeedData } from "@/lib/seed";

type ProjectsProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export async function Projects({ searchParams }: ProjectsProps) {
  await ensureSeedData();
  const sort = typeof searchParams?.sort === "string" ? searchParams.sort : "default";
  const selectedTech = typeof searchParams?.tech === "string" ? searchParams.tech : "";

  const allProjects = await prisma.project.findMany({
    orderBy:
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const availableTechStacks = Array.from(
    new Set(
      allProjects.flatMap((project) =>
        project.techStack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ),
  ).sort();

  const projects = selectedTech
    ? allProjects.filter((project) =>
        project.techStack
          .split(",")
          .map((item) => item.trim())
          .includes(selectedTech),
      )
    : allProjects;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Selected work</p>
          <h2 className="mt-2 text-3xl font-semibold text-zinc-950">Projects</h2>
        </div>

        <form method="GET" className="flex flex-wrap items-center gap-3">
          <label className="text-sm text-zinc-600">
            <span className="mr-2">Sort</span>
            <select name="sort" defaultValue={sort} className="rounded-full border border-zinc-300 bg-white px-3 py-2">
              <option value="default">Custom order</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>

          <label className="text-sm text-zinc-600">
            <span className="mr-2">Tech</span>
            <select name="tech" defaultValue={selectedTech} className="rounded-full border border-zinc-300 bg-white px-3 py-2">
              <option value="">All</option>
              {availableTechStacks.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
            Apply
          </button>
          {(sort !== "default" || selectedTech) && (
            <a href="/" className="text-sm font-medium text-zinc-700 underline decoration-zinc-300 underline-offset-4">
              Reset
            </a>
          )}
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.length === 0 ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[1.5rem] border border-zinc-200 bg-zinc-50 p-6">
              <div className="h-40 rounded-2xl bg-zinc-200" />
              <div className="mt-4 h-4 w-24 rounded bg-zinc-200" />
              <div className="mt-3 h-4 w-full rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-3/4 rounded bg-zinc-200" />
            </div>
          ))
        ) : (
          projects.map((project) => {
            const projectHref = project.referenceUrl
              ? project.referenceUrl.startsWith("http://") || project.referenceUrl.startsWith("https://")
                ? project.referenceUrl
                : `https://${project.referenceUrl}`
              : undefined;
            const techItems = project.techStack
              .split(",")
              .map((item: string) => item.trim())
              .filter(Boolean);

            const cardContent = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-sm text-zinc-500">
                      Preview image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-zinc-950">{project.title}</h3>
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-600">{project.year}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {techItems.map((item: string) => (
                      <span key={item} className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );

            return (
              <article key={project.id} className="group overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                {projectHref ? (
                  <a href={projectHref} target="_blank" rel="noreferrer" className="block h-full">
                    {cardContent}
                  </a>
                ) : (
                  <div className="h-full">{cardContent}</div>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
