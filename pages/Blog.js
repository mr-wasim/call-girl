import Link from "next/link"

export default function BlogDetailPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #444 0%, #111 60%)",
        color: "var(--text-color)",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* TOP BAR */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
          <span>Trying to get to massagerepublic.com?</span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded font-medium"
            style={{
              background: "var(--accent-color)",
              color: "#000",
            }}
          >
            Visit the main site →
          </Link>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="w-full px-4 sm:px-6 lg:px-14 xl:px-20 py-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">

        {/* MAIN BLOG */}
        <div
          className="p-6 sm:p-8"
          style={{
            background: "rgba(0,0,0,0.35)",
            borderRadius: "var(--border-radius)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--accent-color)" }}
            >
              Sri Lanka
            </h1>
            <span className="text-xs opacity-80">April 24, 2019</span>
          </div>

          <div className="space-y-4 text-sm leading-relaxed">
            <p>
              We try to avoid political comment, but one of the team knows a person
              directly affected by what just happened there. The horrific and cowardly
              bombings in Sri Lanka are an offense to the people who follow the religion
              which the responsible people claim to be “fighting for”.
            </p>

            <p>
              Sri Lanka recently emerged from a decades-long civil war. Tourism surged,
              rebuilding started and many people began to escape poverty. That progress
              is now under threat.
            </p>

            <p>
              We have been helping a charity in Sri Lanka looking out for vulnerable girls
              and women over the last couple of years and will continue to help where we can.
            </p>

            <p>
              We dropped advertising prices in Colombo by 40% to support our advertisers
              during this difficult period.
            </p>

            <p>
              Sri Lanka is a beautiful country, full of welcoming and very nice people.
              Go visit.
            </p>
          </div>

          <div className="mt-6 text-xs opacity-80">
            Posted by{" "}
            <span style={{ color: "var(--accent-color)" }}>
              Claire Republique
            </span>{" "}
            at{" "}
            <span style={{ color: "var(--accent-color)" }}>
              20:09
            </span>{" "}
            · 0 comments
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">

          <SidebarBox title="This is our blog">
            <Link
              href="/"
              style={{ color: "var(--accent-color)" }}
              className="text-sm hover:underline"
            >
              Go to the main site
            </Link>
          </SidebarBox>

          <SidebarBox title="About Massage Republic">
            <p className="text-sm leading-relaxed opacity-90">
              MassageRepublic.com was created to help service providers connect with
              their audience and serve the needs of visitors in a responsible way.
            </p>
            <Link
              href="/blog"
              className="inline-block mt-2 text-sm hover:underline"
              style={{ color: "var(--accent-color)" }}
            >
              Go to the blog homepage
            </Link>
          </SidebarBox>

          <SidebarBox title="Blocked in your country?">
            <p className="text-sm">
              Try:{" "}
              <span style={{ color: "var(--accent-color)" }}>
                http://massagerepublic.tk
              </span>
            </p>
            <p className="text-xs opacity-70 mt-1">
              Warning: this is not an SSL site
            </p>
            <p className="text-sm mt-2">
              Or try a proxy or VPN service.
            </p>
          </SidebarBox>

        </div>
      </div>
    </div>
  )
}

function SidebarBox({ title, children }) {
  return (
    <div
      className="p-5"
      style={{
        background: "rgba(0,0,0,0.35)",
        borderRadius: "var(--border-radius)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      <h3
        className="font-semibold mb-3"
        style={{ color: "var(--accent-color)" }}
      >
        {title}
      </h3>
      {children}
    </div>
  )
}
