export default function PrivacyPolicyPage() {
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
        Privacy Policy
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
          <Section title="1. Information We Collect">
            We may collect basic information such as email addresses and IP
            addresses when you interact with our website.
          </Section>

          <Section title="2. How We Use Information">
            Information is used to improve the website, provide support,
            and ensure compliance with our terms.
          </Section>

          <Section title="3. Cookies">
            We may use cookies to enhance user experience. You can disable
            cookies through your browser settings.
          </Section>

          <Section title="4. Data Sharing">
            We do not sell or rent personal information to third parties.
            Information may be shared only when legally required.
          </Section>

          <Section title="5. Security">
            We take reasonable measures to protect your information but
            cannot guarantee complete security.
          </Section>

          <Section title="6. Changes to This Policy">
            This privacy policy may be updated from time to time.
            Continued use of the site means acceptance of changes.
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
