import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const navData = [
  { label: "Home", href: "/" },
  // {
    // label: "About",
    // children: [
      { label: "About", href: "/about" },
      // { label: "Director's Message", href: "/director-message" },
      // { label: "Why AZ", href: "/whyaz" },
      // { label: "Our Philosophy", href: "/our-philosophy" },
      // { label: "Our Services", href: "/our-services" },
    // ],
  // },
  { label: "Services", href: "/our-services" },
  {
    label: "Study",
    href: "/study-abroad-fr",
    // children: [
    //   { label: "Study Abroad France", href: "/study-abroad-fr" },
    //   { label: "Study Abroad United Kingdom", href: "/study-abroad-uk" },
    //   { label: "Study Abroad New Zealand", href: "/study-abroad-new-zealand" },
    //   { label: "Study Abroad Australia", href: "/study-abroad-australia" },
    // ],
  },
  { label: "Partners", href: "/partners" },
  { label: "Programs", href: "/programs" },
  // {
  //   label: "Success Stories",
  //   children: [
  { label: "Testimonials", href: "/testimonials" },
  //     { label: "External Scholarships", href: "/external-scholarships" },
  //     { label: "Scholarships Secured", href: "/scholarships-secured" },
  //   ],
  // },
  // {
  //   label: "Get in Touch",
  //   children: [
  { label: "Contact", href: "/contact" },
  //     { label: "Careers", href: "/careers" },
  //   ],
  // },
  // { label: "Visa Assistance", href: "/visa-assistance" },
  { label: "Latest Updatess", href: "/breaking-news", cta: true },
];

function DropdownMenu({ items, visible, onNavigate }) {
  return (
    <div
      className={`absolute top-full left-0 z-50 min-w-[230px] rounded-2xl border border-white/10 bg-[#08111f]/80 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-200 overflow-hidden ${
        visible
          ? "opacity-100 pointer-events-auto translate-y-0"
          : "opacity-0 pointer-events-none -translate-y-2"
      }`}
    >
      {/* gold top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.href);
          }}
          className="flex items-center gap-2 px-5 py-3 text-[13px] font-medium text-white/70 hover:text-[#d4af37] hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors duration-150 group"
        >
          <span className="w-1 h-1 rounded-full bg-[#d4af37]/0 group-hover:bg-[#d4af37] transition-colors duration-150 flex-shrink-0" />
          {item.label}
        </a>
      ))}
    </div>
  );
}

function NavItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (item.cta) {
    return (
      <li>
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.href);
          }}
          className="inline-block px-5 py-2 rounded-xl bg-[#d4af37] text-slate-950 text-[13px] font-semibold shadow-lg hover:scale-[1.03] hover:brightness-110 transition-all duration-150"
        >
          {item.label}
        </a>
      </li>
    );
  }

  if (!item.children) {
    return (
      <li>
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(item.href);
          }}
          className="text-white/75 text-[13.5px] font-medium hover:text-[#d4af37] transition-colors duration-150 px-2 py-1 block"
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => {
          if (item.href) onNavigate(item.href);
          else setOpen((v) => !v);
        }}
        className="flex items-center gap-1 text-white/75 text-[13.5px] font-medium hover:text-[#d4af37] transition-colors duration-150 px-2 py-1 cursor-pointer bg-transparent border-0 outline-none"
      >
        <span>{item.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <DropdownMenu
        items={item.children}
        visible={open}
        onNavigate={(href) => {
          setOpen(false);
          onNavigate(href);
        }}
      />
    </li>
  );
}

function MobileMenu({ open, onClose, onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (label) =>
    setExpanded((prev) => (prev === label ? null : label));

  const handleNav = (href) => {
    onNavigate(href);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] transition-all duration-300 ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className={`absolute top-0 left-0 h-full w-[300px] bg-[#08111f]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* gold left rail */}
        <div className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <img
            src="/az_logo.png"
            alt="AZ"
            className="h-10"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {navData.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggle(item.label)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-white/75 text-[13.5px] font-medium hover:bg-white/5 hover:text-[#d4af37] transition-colors"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expanded === item.label
                          ? "rotate-180 text-[#d4af37]"
                          : ""
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {expanded === item.label && (
                    <div className="ml-5 border-l border-[#d4af37]/30 bg-white/3">
                      {item.children.map((child) => (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNav(child.href);
                          }}
                          className="block pl-5 pr-4 py-2.5 text-[12.5px] text-white/55 hover:text-[#d4af37] border-b border-white/5 last:border-0 transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(item.href);
                  }}
                  className={`block px-5 py-3.5 text-[13.5px] font-medium transition-colors border-b border-white/5 ${
                    item.cta
                      ? "mx-4 my-2 rounded-xl bg-[#d4af37] text-slate-950 text-center font-semibold border-0 hover:brightness-110"
                      : "text-white/75 hover:bg-white/5 hover:text-[#d4af37]"
                  }`}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[11px] text-white/25 tracking-widest uppercase">
            AZ Consultations
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EdNetNavbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = (href) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Marquee */}
      

      {/* Navbar */}
      <nav
        className={`w-full fixed top-0 left-0 z-[99999] transition-all duration-300 ${
          scrolled
            ? "sticky top-0 bg-[#08111f]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-[#08111f]/60 backdrop-blur-xl border-b border-white/8"
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-5 relative flex items-center h-[70px]">
          {/* Logo - Left */}
<div className="flex-shrink-0 z-10">
  <a
    href="/"
    onClick={(e) => {
      e.preventDefault();
      handleNavigate("/");
    }}
  >
    <img
      src="/az_logo.png"
      alt="AZ Consultants"
      className="h-[140px] w-auto object-contain"
    />
  </a>
</div>

{/* Center Menu */}
<ul className="hidden lg:flex items-center gap-6 list-none m-0 absolute left-1/2 -translate-x-1/2">
  {navData
    .filter((item) => !item.cta)
    .map((item) => (
      <NavItem
        key={item.label}
        item={item}
        onNavigate={handleNavigate}
      />
    ))}
</ul>

{/* Right CTA */}
<div className="ml-auto hidden lg:block">
  {navData
    .filter((item) => item.cta)
    .map((item) => (
      <NavItem
        key={item.label}
        item={item}
        onNavigate={handleNavigate}
      />
    ))}
</div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512">
              <path d="M432 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-128H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z" />
            </svg>
          </button>
        </div>

        {/* Gold shimmer bottom line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      </nav>

      {/* Mobile Drawer */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={handleNavigate}
      />

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      
    </>
  );
}