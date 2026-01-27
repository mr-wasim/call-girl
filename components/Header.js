// components/Header.js
import Link from "next/link";
import { Globe } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { SettingsContext, AuthContext } from "../pages/_app";

export default function Header() {
  const { settings } = useContext(SettingsContext) || {};
  const { user, refreshUser, loadingUser } = useContext(AuthContext) || {};
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshUser();
    setOpen(false);
  }

  const logoSrc = settings?.logoPath || "/logo.png";

  const headerStyle = {
    background: "var(--header-bg, #000)",
    color: "var(--header-text, #fff)",
  };

  const Avatar = ({ name }) => (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center font-semibold"
      style={{ background: "var(--accent-color, #f3bc1b)", color: "#000" }}
    >
      {name?.[0]?.toUpperCase() || "U"}
    </div>
  );

  return (
    <header style={headerStyle} className="sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* LOGO */}
          <Link href="/">
            <img
              src={logoSrc}
              alt="Logo"
              className="h-8 sm:h-9 w-auto cursor-pointer"
            />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="text-sm px-3 py-1.5 rounded-md">EN</button>
            <button className="p-2 rounded-md hover:bg-white/10">
              <Globe size={18} />
            </button>

            {/* NOT LOGGED IN */}
            {!loadingUser && !user && (
              <Link
                href="/signin"
                className="border px-4 py-1.5 rounded-md text-sm hover:bg-white hover:text-black"
              >
                Sign in
              </Link>
            )}

            {/* LOADING */}
            {loadingUser && (
              <div className="w-24 h-8 bg-white/10 rounded animate-pulse" />
            )}

            {/* LOGGED IN */}
            {user && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/10"
                >
                  <Avatar name={user.displayName} />
                  <span className="hidden sm:block text-sm">
                    {user.displayName}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow z-50">
                    <div className="px-4 py-3 border-b">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.displayName}
                      </div>
                      <div className="text-xs text-gray-600">
                        {user.email}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/my-listings"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      My Listings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
