import { prisma } from "@/lib/prisma";

export async function ensureSeedData() {
  const profile = await prisma.profile.findFirst();

  if (!profile) {
    await prisma.profile.create({
      data: {
        name: "Aga Putra",
        role: "Full-stack developer",
        description:
          "Crafting thoughtful digital experiences with Next.js, Prisma, and modern design systems.",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
      },
    });
  }

  const projectCount = await prisma.project.count();

  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "Orbit Studio",
          year: "2025",
          description: "A polished brand landing experience built for a creative studio.",
          techStack: "Next.js, Tailwind",
          referenceUrl: "https://example.com",
        },
        {
          title: "Pulse Admin",
          year: "2024",
          description: "A compact dashboard for operations teams managing daily content workflows.",
          techStack: "Prisma, SQLite",
          referenceUrl: "https://example.com",
        },
      ],
    });
  }
}
