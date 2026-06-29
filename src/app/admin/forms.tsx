"use client";

import { saveProfileAction, saveProjectAction, deleteProjectAction, moveProjectAction } from "./actions";
import { useState } from "react";

async function uploadFile(file: File, folder: string = "uploads") {
  if (!file || file.size === 0) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  const { url } = await res.json();
  return url;
}

export function ProfileForm({ profile }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const profileImageInput = e.currentTarget.profileImage as HTMLInputElement;
      const cvFileInput = e.currentTarget.cvFile as HTMLInputElement;

      if (profileImageInput.files?.[0]) {
        const imageUrl = await uploadFile(profileImageInput.files[0], "uploads");
        if (imageUrl) formData.set("profileImageUrl", imageUrl);
      }

      if (cvFileInput.files?.[0]) {
        const cvUrl = await uploadFile(cvFileInput.files[0], "uploads");
        if (cvUrl) formData.set("cvFileUrl", cvUrl);
      }

      formData.delete("profileImage");
      formData.delete("cvFile");

      await saveProfileAction(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={profile?.id ?? ""} />
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Name</span>
        <input defaultValue={profile?.name ?? ""} name="name" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Role</span>
        <input defaultValue={profile?.role ?? ""} name="role" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Description</span>
        <textarea defaultValue={profile?.description ?? ""} name="description" rows={4} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-zinc-400">GitHub URL</span>
          <input defaultValue={profile?.githubUrl ?? ""} name="githubUrl" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-zinc-400">LinkedIn URL</span>
          <input defaultValue={profile?.linkedinUrl ?? ""} name="linkedinUrl" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block text-zinc-400">Profile image</span>
          <input type="file" name="profileImage" accept="image/*" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-zinc-400">CV file</span>
          <input type="file" name="cvFile" accept=".pdf" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
        </label>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={loading} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition disabled:opacity-50 hover:bg-zinc-200">
        {loading ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}

type ProjectFormProps = {
  project?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = Boolean(project?.id);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(form);
      const projectImageInput = form.projectImage as HTMLInputElement;

      if (projectImageInput.files?.[0]) {
        const imageUrl = await uploadFile(projectImageInput.files[0], "uploads");
        if (imageUrl) formData.set("imageUrl", imageUrl);
      }

      formData.delete("projectImage");
      if (project?.id) {
        formData.set("id", project.id);
      }

      await saveProjectAction(formData);
      form.reset();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {project?.id ? <input type="hidden" name="id" value={project.id} /> : null}
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Title</span>
        <input name="title" required defaultValue={project?.title ?? ""} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Year</span>
        <input name="year" defaultValue={project?.year ?? ""} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Description</span>
        <textarea name="description" rows={4} defaultValue={project?.description ?? ""} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Tech Stack</span>
        <input name="techStack" defaultValue={project?.techStack ?? ""} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Reference URL</span>
        <input name="referenceUrl" defaultValue={project?.referenceUrl ?? ""} className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block text-zinc-400">Project image</span>
        <input type="file" name="projectImage" accept="image/*" className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3" />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition disabled:opacity-50 hover:bg-zinc-200">
          {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update project" : "Add project"}
        </button>
        {isEditing ? (
          <button type="button" onClick={onCancel} className="rounded-full border border-zinc-700 px-5 py-3 text-sm text-zinc-300 transition hover:bg-zinc-800">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function ProjectManager({ projects }: { projects: any[] }) {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const editingProject = projects.find((project) => project.id === editingProjectId) ?? null;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{editingProject ? "Edit project" : "Add project"}</h2>
          {editingProject ? (
            <button type="button" onClick={() => setEditingProjectId(null)} className="text-sm text-zinc-400 transition hover:text-white">
              New project
            </button>
          ) : null}
        </div>
        <ProjectForm project={editingProject ?? undefined} onSuccess={() => setEditingProjectId(null)} onCancel={() => setEditingProjectId(null)} />
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6">
        <h2 className="text-xl font-semibold">Projects</h2>
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-zinc-400">{project.year}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form action={moveProjectAction} className="flex gap-2">
                  <input type="hidden" name="id" value={project.id} />
                  <button type="submit" name="direction" value="up" className="rounded-full border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800">
                    ↑
                  </button>
                  <button type="submit" name="direction" value="down" className="rounded-full border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800">
                    ↓
                  </button>
                </form>
                <button type="button" onClick={() => setEditingProjectId(project.id)} className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800">
                  Edit
                </button>
                <form action={deleteProjectAction} className="inline-flex">
                  <input type="hidden" name="id" value={project.id} />
                  <button className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
