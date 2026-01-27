export default function TermsPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #444 0%, #111 60%)",
        color: "var(--text-color)",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* HEADER */}
      <div className="py-10 text-center text-2xl font-semibold">
        Terms & Conditions
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-10 flex justify-center">
        <div
          className="w-full max-w-4xl p-6 sm:p-8"
          style={{
            background: "rgba(0,0,0,0.35)",
            borderRadius: "var(--border-radius)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
          }}
        >
          <Section title="1. Introduction">
            By accessing and using this website, you accept and agree to be bound
            by the terms and provisions of this agreement.
          </Section>

          <Section title="2. Nature of the Service">
            Massage Republic is not an agency and does not arrange bookings.
            We provide an online platform where advertisers and users may
            communicate directly.
          </Section>

          <Section title="3. User Responsibility">
            Users are responsible for complying with the laws of their local
            jurisdiction. We do not take responsibility for any actions taken
            outside this platform.
          </Section>

          <Section title="4. Content & Advertisers">
            Advertisers are responsible for the accuracy of the information they
            publish. We reserve the right to remove any content that violates
            these terms.
          </Section>

          <Section title="5. Limitation of Liability">
            We are not liable for any direct or indirect damages arising from the
            use of this website.
          </Section>

          <Section title="6. Changes to Terms">
            These terms may be updated at any time without prior notice.
            Continued use of the website constitutes acceptance of those changes.
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2
        className="text-lg font-semibold mb-2"
        style={{ color: "var(--accent-color)" }}
      >
        {title}
      </h2>
      <p className="text-sm leading-relaxed opacity-90">
        {children}
      </p>
    </div>
  )
}
