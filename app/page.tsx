import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  IconChevronRight,
  IconLockSquareRoundedFilled,
  IconShieldCheckFilled,
} from "@tabler/icons-react";
import MovieSearch from "@/components/movie-search";

export default async function page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container  flex h-16 items-center justify-between">
          <div className="flex items-center ">
            {/* <Lock size={24} className="text-primary" /> */}
            <span className="font-bold text-xl">Better-Auth</span>
          </div>
          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ModeToggle />
              {session?.user ? (
                <a href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </a>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Search section */}
      <section className="py-6">
        <div className="container">
          <h2 className="text-xl font-semibold mb-2">חיפוש סרטים (TMDB + IMDb)</h2>
          <MovieSearch />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 mt-auto">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <IconLockSquareRoundedFilled size={20} className="text-primary" />
            <span className="font-bold">Auth Starter Kit</span>
          </div>
          <div className="flex gap-8">
            <a
              href="https://github.com/achour"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Github
            </a>
            <a
              href="https://www.achour.dev"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Portfolio
            </a>
            <a
              href="https://x.com/achourdev"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Achour Meguenni
          </div>
        </div>
      </footer>
    </div>
  );
}
