import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <LogoMark size={52} />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="display-xl mt-4 max-w-2xl text-balance">
        This piece seems to have found another home.
      </h1>
      <p className="lede mx-auto mt-5 max-w-md">
        The page you&rsquo;re looking for isn&rsquo;t here — but the collection is always changing.
        Let&rsquo;s find you something with a little more history.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/collections/new-arrivals" size="lg">
          Shop New Arrivals
        </ButtonLink>
        <ButtonLink href="/archive" variant="outline" size="lg">
          Browse the Archive
        </ButtonLink>
      </div>
      <p className="mt-8 text-sm text-ink-soft">
        Or{" "}
        <Link href="/find-your-piece" className="link-underline text-oxblood">
          tell Sophie what you&rsquo;re after
        </Link>
        .
      </p>
    </Container>
  );
}
