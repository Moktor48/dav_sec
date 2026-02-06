import { headers } from "next/headers";

import { redirect } from "next/navigation";

import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2xl text-white">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
          {!session ? (
            <form>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                formAction={async () => {
                  "use server";
                  const res = await auth.api.signInSocial({
                    body: {
                      provider: "google",
                      callbackURL: "/",
                    },
                  });
                  if (!res.url) {
                    throw new Error("No URL returned from signInSocial");
                  }
                  redirect(res.url);
                }}
              >
                Sign in with Google
              </button>
            </form>
          ) : (
            <form>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                formAction={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/");
                }}
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
