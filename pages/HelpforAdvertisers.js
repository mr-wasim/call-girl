export default function ContactPage() {
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
      <div
        className="py-10 text-center text-2xl font-semibold"
        style={{
          background: "linear-gradient(to bottom, #111, #000)",
        }}
      >
        Contact Us
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-10 flex justify-center">
        <div className="w-full max-w-3xl">

          {/* INFO LIST */}
          <ul className="text-sm leading-relaxed mb-8 space-y-2">
            <li>
              • Looking to make an appointment? We are not an agency and do not arrange bookings.
              Contact an advertiser directly.
            </li>
            <li>
              • Are you an advertiser with a question? First, look at our{" "}
              <span style={{ color: "var(--accent-color)" }}>Help for advertisers</span>{" "}
              and if you don't find the answer, please ask in the{" "}
              <span style={{ color: "var(--accent-color)" }}>Advertiser forum</span>.
            </li>
            <li>
              • Have a question about partnerships or co-operation? We would love to hear from you.
            </li>
            <li>
              • Anything else, you may{" "}
              <span style={{ color: "var(--accent-color)" }}>contact us here</span>.
            </li>
          </ul>

          {/* FORM BOX */}
          <div
            className="p-6 sm:p-8"
            style={{
              background: "#555",
              borderTop: `3px solid var(--accent-color)`,
              borderRadius: "var(--border-radius)",
            }}
          >
            <div className="space-y-5">

              <Field label="Name">
                <input className="contact-input" />
              </Field>

              <Field label="Email">
                <input className="contact-input" />
              </Field>

              <Field label="Message">
                <textarea className="contact-textarea" rows={4} />
              </Field>

              <button
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium indicate-hover"
                style={{
                  background: "var(--accent-color)",
                  color: "#000",
                  borderRadius: "var(--border-radius)",
                }}
              >
                Send message →
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* INLINE STYLES */}
      <style jsx>{`
        .contact-input {
          width: 100%;
          padding: 8px 10px;
          border-radius: var(--border-radius);
          border: none;
          outline: none;
          background: #fff;
          color: #000;
          font-size: 14px;
        }

        .contact-textarea {
          width: 100%;
          padding: 8px 10px;
          border-radius: var(--border-radius);
          border: none;
          outline: none;
          background: #fff;
          color: #000;
          font-size: 14px;
          resize: vertical;
        }

        .indicate-hover:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      {children}
    </div>
  )
}
