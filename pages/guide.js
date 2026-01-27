export default function EtiquettePage() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(circle at top, #444 0%, #111 60%)",
        color: "var(--text-color)",
        fontFamily: "var(--font-family)",
      }}
    >
      {/* TOP BAR */}
      <div
        className="border-b text-sm"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3 flex justify-between">
          <span style={{ color: "var(--accent-color)" }}>&lt; Back</span>
          <span>Guide to seeing an escort</span>
          <span />
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-10 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">

        {/* LEFT CONTENT */}
        <div className="space-y-8 text-sm leading-relaxed">

          <Section title="Etiquette">
            <p>
              When contacting an escort, it is a good idea to provide some
              information about you. A polite introduction is very helpful as
              part of getting through any decent screening process from a quality escort.
            </p>
            <p>
              Be polite and respectful at all times; in person, on the phone and
              in emails. The only exception to this can be if you have agreed in
              advance with an escort a scenario where you want to play a specific role.
            </p>
            <p>
              Make sure you understand what the escort offers. If you have any
              requirements which are not specifically offered, they are probably
              not on offer. If in any case, you should ask in advance.
            </p>
            <p>
              Be discreet. If you are going to a private residence, ask for
              instructions on how to get in. Do not use the escort’s name when
              calling an intercom.
            </p>
            <p>
              If you have any allergies (animal, scents, etc.) make sure you tell
              the escort. If you have an aversion to tobacco smoke or smokers you
              probably want to check that too.
            </p>
            <p>
              Don’t ask about an escort’s personal life or her professional
              activities; it is volunteer information. Use common sense.
            </p>
          </Section>

          <Section title="Donations">
            <p>
              In most cases you will be expected to provide your donation at the
              start of the appointment. It is not normal to get a request to wire
              or send money in advance, so be suspicious if this is asked for.
            </p>
            <p>
              Don’t try to negotiate the amount of the donation on arrival.
              Assume rates are non-negotiable unless there is good reason to
              assume otherwise.
            </p>
            <p>
              Respect the time period you have booked. Most professional escorts
              do not like to have to ask you to leave and many will not watch the clock.
            </p>
            <p>
              If you have to cancel an appointment, do so as far in advance as
              possible. Do not make appointments and then not turn up.
            </p>
            <p>
              Don’t make promises you are not going to keep, whether it is for a
              future appointment, gift or review.
            </p>
          </Section>

          <Section title="Personal hygiene">
            <ul className="list-disc pl-5 space-y-1">
              <li>Take a shower before the appointment or at the start.</li>
              <li>Trim your nails and toenails.</li>
              <li>
                Trimming or shaving any areas you might lick or kiss is appreciated.
              </li>
              <li>
                Do not use strong cologne, deodorant or perfume on areas that may
                be licked or sucked.
              </li>
              <li>
                Mouthwash or chewing gum is often appreciated; avoid strong smells
                such as garlic, onions or curry.
              </li>
            </ul>
          </Section>

        </div>

        {/* RIGHT IMAGE */}
        <div className="relative hidden lg:block">
          <img
            src="/manners.png"
            alt="Good manners cost nothing"
            className="absolute right-0 top-10 max-w-sm opacity-90"
          />
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2
        className="text-xl font-semibold mb-3"
        style={{ color: "var(--accent-color)" }}
      >
        {title}
      </h2>
      <div className="space-y-3 opacity-95">
        {children}
      </div>
    </div>
  )
}
