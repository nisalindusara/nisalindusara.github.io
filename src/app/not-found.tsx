import Link from "next/link";
import { profile } from "@/content/profile";
import { TopBar } from "@/components/TopBar/TopBar";

export default function NotFound() {
  return (
    <main id="main" className="container" style={{ minHeight: "70dvh" }}>
      {/* Name top left, as on every page; the nav shows only the menu circle here. */}
      <TopBar name={profile.name} sentinel={false} />
      <div style={{ paddingTop: "20vh" }}>
        <h1 className="display" style={{ fontSize: "var(--fs-h2)" }}>
          Not found.
        </h1>
        <p style={{ marginTop: 24 }}>
          <Link href="/" style={{ borderBottom: "1px solid var(--line)" }}>
            Back to the start
          </Link>
        </p>
      </div>
    </main>
  );
}
