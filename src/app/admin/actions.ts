"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME } from "@/lib/auth";

export async function saveProfileAction(formData: FormData) {
  const name = formData.get("name")?.toString() ?? "";
  const role = formData.get("role")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const githubUrl = formData.get("githubUrl")?.toString() ?? "";
  const linkedinUrl = formData.get("linkedinUrl")?.toString() ?? "";
  const profileImageUrl = formData.get("profileImageUrl")?.toString() ?? null;
  const cvFileUrl = formData.get("cvFileUrl")?.toString() ?? null;

  const existingProfile = await prisma.profile.findFirst();

  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: {
        name,
        role,
        description,
        githubUrl,
        linkedinUrl,
        profileImageUrl: profileImageUrl || existingProfile.profileImageUrl,
        cvFileUrl: cvFileUrl || existingProfile.cvFileUrl,
      },
    });
  } else {
    await prisma.profile.create({
      data: {
        name,
        role,
        description,
        githubUrl,
        linkedinUrl,
        profileImageUrl,
        cvFileUrl,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function saveProjectAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString() ?? "";
  const year = formData.get("year")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const techStack = formData.get("techStack")?.toString() ?? "";
  const referenceUrl = formData.get("referenceUrl")?.toString() ?? "";
  const imageUrl = formData.get("imageUrl")?.toString() ?? null;

  if (id) {
    const existingProject = await prisma.project.findUnique({ where: { id } });
    await prisma.project.update({
      where: { id },
      data: {
        title,
        year,
        description,
        techStack,
        referenceUrl,
        imageUrl: imageUrl ?? existingProject?.imageUrl ?? null,
      },
    });
  } else {
    const nextSortOrder = await prisma.project.count();
    await prisma.project.create({
      data: {
        title,
        year,
        description,
        techStack,
        referenceUrl,
        imageUrl,
        sortOrder: nextSortOrder,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function moveProjectAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const direction = formData.get("direction")?.toString();

  if (!id || !direction) {
    return;
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  const currentIndex = projects.findIndex((project) => project.id === id);
  if (currentIndex === -1) {
    return;
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= projects.length) {
    return;
  }

  const currentProject = projects[currentIndex];
  const targetProject = projects[targetIndex];

  await prisma.$transaction([
    prisma.project.update({ where: { id: currentProject.id }, data: { sortOrder: targetProject.sortOrder } }),
    prisma.project.update({ where: { id: targetProject.id }, data: { sortOrder: currentProject.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProjectAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) {
    return;
  }

  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE_NAME);
  redirect("/admin/login");
}
