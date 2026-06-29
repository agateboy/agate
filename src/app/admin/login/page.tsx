import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Admin access</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-zinc-400">Use the password from your environment configuration.</p>

        <form action="/api/admin/login" method="POST" className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-zinc-300">
            Password
            <input
              type="password"
              name="password"
              required
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none ring-0"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            Continue
          </button>
        </form>

        <div className="mt-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-300">Back to portfolio</Link>
        </div>
      </div>
    </main>
  );
}
