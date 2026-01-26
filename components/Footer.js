export default function Footer() {
  return (
    <footer className="relative bg-[#1f1f1f] text-gray-300 mt-14">
      
      {/* texture overlay */}
      <div className="absolute inset-0 opacity-25 bg-[url('/texture.png')] pointer-events-none" />

      <div className="relative z-10 container-w px-6 py-8">

        {/* TOP LINKS */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] mb-6">
          <a href="#" className="text-[#f3bc1b] hover:underline">Forums</a>
          <a href="#" className="text-[#f3bc1b] hover:underline">About</a>
          <a href="#" className="text-[#f3bc1b] hover:underline">Blog</a>
          <a href="#" className="text-[#f3bc1b] hover:underline">Advertise Escort Services</a>
          <a href="#" className="text-[#f3bc1b] hover:underline">Help for Advertisers</a>
          <a href="#" className="text-[#f3bc1b] hover:underline">Guide to seeing an escort</a>

          <span className="flex items-center gap-2 text-red-500 font-semibold">
            🖐 Stop Human Trafficking
          </span>
        </div>

        {/* DISCLAIMER */}
        <p className="text-[12.5px] leading-relaxed text-gray-300 mb-5 max-w-[1100px]">
          This website only allows adult individuals to advertise their time and companionship to other adult individuals.
          We do not provide a booking service nor arrange meetings. Any price indicated relates to time only and nothing else.
          Any service offered or whatever else that may occur is the choice of consenting adults and a private matter between them.
          In some countries, individuals do not legally have the choice to decide this; it is your responsibility to comply with local laws.
        </p>

        {/* BOTTOM LINE */}
        <div className="text-[12.5px] text-gray-400">
          © 2026 Massage Republic&nbsp;
          <a href="#" className="text-[#f3bc1b] hover:underline">Terms of Use</a>
          &nbsp;|&nbsp;
          <a href="#" className="text-[#f3bc1b] hover:underline">Privacy Policy</a>
          &nbsp;|&nbsp;
          <a href="#" className="text-[#f3bc1b] hover:underline">GDPR</a>
          &nbsp;|&nbsp;
          <a href="#" className="text-[#f3bc1b] hover:underline">Contact Us</a>
        </div>

      </div>
    </footer>
  )
}
