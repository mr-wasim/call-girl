import { Search, Megaphone, Settings } from "lucide-react"

export default function ForumHome() {
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
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex justify-between text-sm">
          <span style={{ color: "var(--accent-color)" }}>
            &lt; Escorts in Bangalore
          </span>
         
        </div>

        {/* HEADER */}
        <div className="py-6 text-center">
          <h1
            className="text-3xl font-semibold"
            style={{ color: "var(--accent-color)" }}
          >
            Welcome to our forum!
          </h1>

          {/* SEARCH */}
          <div className="mt-4 flex justify-center px-4">
            <div
              className="flex items-center gap-2 px-3 py-2 w-full max-w-xl"
              style={{
                background: "rgba(0,0,0,0.45)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--border-radius)",
              }}
            >
              <Search size={16} />
              <input
                placeholder="Search Topics and Posts"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* ICON */}
          <div className="absolute right-12 top-24 opacity-80 hidden lg:block">
            <Megaphone size={64} />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-10 space-y-10">

        {/* GENERAL */}
        <ForumBlock
          title="General"
          desc="Talk about everything"
          stats="1,195 posts in 565 topics"
          updated="Updated December 20, 2025 by tokage666"
          highlight
        />

        {/* WEBSITE */}
        <SectionTitle title="Website" />

        <div className="grid md:grid-cols-2 gap-6">
          <ForumBlock
            title="Feedback"
            desc="Feature requests, improvement suggestions, and help"
            stats="1,322 posts in 408 topics"
            updated="Updated September 18, 2025 by Charity_1"
          />
          <ForumBlock
            title="Support / Questions"
            desc="Ask questions to our staff, and have us and other users help you resolve problems"
            stats="1,114 posts in 314 topics"
            updated="Updated October 04, 2025 by Kimbali"
          />
        </div>

        {/* CITIES */}
        <SectionTitle title="Cities" />

        <div className="grid md:grid-cols-2 gap-6">
          <ForumBlock
            title="Abu Dhabi"
            desc="Abu Dhabi, UAE Forums"
            stats="62 posts in 16 topics"
            updated="Updated March 18, 2025 by Arbazmaniar44"
          />
          <ForumBlock
            title="Al Manama"
            desc="Al Manama, Bahrain Forums"
            stats="110 posts in 49 topics"
            updated="Updated September 27, 2024 by neshakur1"
          />
        </div>
      </div>
    </div>
  )
}

/* COMPONENTS */

function SectionTitle({ title }) {
  return (
    <h3 className="text-sm uppercase tracking-wide opacity-80">
      {title}
    </h3>
  )
}

function ForumBlock({ title, desc, stats, updated, highlight }) {
  return (
    <div
      className="p-5"
      style={{
        background: "rgba(0,0,0,0.35)",
        border: highlight
          ? `1px solid var(--accent-color)`
          : "1px solid rgba(255,255,255,0.12)",
        borderRadius: "var(--border-radius)",
      }}
    >
      <div className="flex justify-between gap-4">
        <div>
          <h2
            className="font-medium"
            style={{ color: "var(--accent-color)" }}
          >
            {title}
          </h2>
          <p className="text-sm mt-1">{desc}</p>
          <p className="text-xs opacity-70 mt-2">{updated}</p>
        </div>

        <div className="text-xs opacity-80 whitespace-nowrap">
          {stats}
        </div>
      </div>
    </div>
  )
}
