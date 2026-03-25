"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, GraduationCap, FileText, Globe, Star, X, Menu } from "lucide-react";

const NAV_ITEMS = [
  { name: "Services",        url: "#services",      icon: Briefcase },
  { name: "Universities",    url: "#universities",  icon: GraduationCap },
  { name: "Testimonials",    url: "#testimonials",          icon: FileText },
  { name: "Packages", url: "#package",        icon: Globe },
  { name: "Contact Us",    url: "#contact",  icon: Star },
];

const shimmerKeyframes = `
@keyframes shimmer-slide { to { transform: translate(calc(100cqw - 100%), 0); } }
@keyframes spin-around {
  0%   { transform: translateZ(0) rotate(0); }
  15%, 35% { transform: translateZ(0) rotate(90deg); }
  65%, 85% { transform: translateZ(0) rotate(270deg); }
  100% { transform: translateZ(0) rotate(360deg); }
}
`;

function ShimmerButton({ children, className = "", ...props }) {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <button
        className={`relative z-0 inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full border border-white/10 bg-[rgba(0,35,149,1)] px-5 py-[9px] text-[13px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-px ${className}`}
        style={{ "--spread": "120deg", "--shimmer-color": "#ffffff", "--speed": "3s", "--cut": "0.05em" }}
        {...props}
      >
        <span className="absolute inset-0 -z-10 overflow-visible [container-type:size] blur-[3px]">
          <span className="absolute inset-0 h-[100cqh] aspect-square [animation:shimmer-slide_var(--speed)_ease-in-out_infinite_alternate]">
            <span className="absolute inset-[-100%] w-auto bg-[conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [animation:spin-around_calc(var(--speed)*2)_infinite_linear]" />
          </span>
        </span>
        {children}
        <span className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_-12px_20px_rgba(255,255,255,0.35),inset_0_-4px_8px_rgba(255,255,255,0.5),inset_0_1px_0px_rgba(255,255,255,0.2)]" />
        <span className="absolute -z-10 inset-[var(--cut)] rounded-full bg-[rgba(0,35,149,1)]" />
      </button>
    </>
  );
}

function Logo() {
  return (
    <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-lg">
      {/* Your actual image */}
      <img
        src="/logo.png"          // Make sure the path is correct
        alt="Logo"
        className="h-15 w-15 object-contain" // small, fits nicely
      />
      {/* Optional accent stripe */}
      {/* <div className="absolute right-0 top-0 h-full w-[5px] bg-[#ED2939]" /> */}
    </div>
  );
}

export function Navbar() {
  const [activeTab, setActiveTab] = useState(NAV_ITEMS[0].name);
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full border-b border-[#dde8f8] bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${scrolled ? "shadow-[0_4px_24px_rgba(0,35,149,0.09)]" : "shadow-[0_2px_12px_rgba(0,35,149,0.05)]"}`}>
        <div className="mx-auto flex h-[60px] max-w-[1160px] items-center gap-3 px-4 md:px-9">

          {/* Brand */}
          <a href="#" className="flex shrink-0 items-center gap-2 no-underline">
            <Logo />
            <div className="flex flex-col leading-tight">
              <span className="text-[13.5px] font-extrabold tracking-tight text-[#00185a] md:text-[15px]">
                AZ Consultations
              </span>
              <span className="hidden text-[9.5px] font-semibold uppercase tracking-[0.8px] text-[#7a8fbb] md:block">
                Study in France Specialists
              </span>
            </div>
          </a>

          {/* Desktop pill nav */}
          <div className="ml-auto hidden items-center gap-0.5 rounded-full border border-[rgba(0,35,149,0.10)] bg-[rgba(0,35,149,0.04)] p-1 backdrop-blur-xl md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={`relative z-0 flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] no-underline transition-colors duration-200 hover:text-[#002395] ${isActive ? "font-bold text-[#002395]" : "font-medium text-[#3a4a6b]"}`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="-z-10 absolute inset-0 rounded-full bg-[rgba(0,35,149,0.08)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    >
                      <div className="absolute left-1/2 top-[-8px] h-1 w-8 -translate-x-1/2 rounded-b bg-[#002395]">
                        <div className="absolute -left-2 -top-1.5 h-5 w-12 rounded-full bg-[rgba(0,35,149,0.18)] blur-[8px]" />
                        <div className="absolute -top-0.5 left-0.5 h-3.5 w-7 rounded-full bg-[rgba(0,35,149,0.25)] blur-[5px]" />
                      </div>
                    </motion.div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <ShimmerButton className="ml-3 hidden md:inline-flex" onClick={() => window.location.href = "#contact"}>
            Free Consultation
          </ShimmerButton>

          {/* Mobile right: consult + hamburger */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <ShimmerButton className="!px-4 !py-[7px] !text-[12px]" onClick={() => window.location.href = "#contact"}>
              Consult
            </ShimmerButton>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#dde8f8] bg-white/90"
            >
              <Menu size={18} color="#002395" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[300] bg-[rgba(0,12,50,0.38)] backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed bottom-0 right-0 top-0 z-[400] flex w-[76vw] max-w-[300px] flex-col overflow-y-auto bg-white shadow-[-8px_0_48px_rgba(0,35,149,0.14)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#eef3fb] px-5 py-[18px]">
                <a href="#" className="flex items-center gap-2 no-underline" onClick={() => setDrawerOpen(false)}>
                  <Logo />
                  <div className="leading-tight">
                    <div className="text-[13.5px] font-extrabold text-[#00185a]">AZ Consultations</div>
                    <div className="text-[9px] font-semibold uppercase tracking-[0.7px] text-[#7a8fbb]">Study in France</div>
                  </div>
                </a>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border border-[#eef3fb] bg-[#f5f8ff]"
                >
                  <X size={16} color="#3a4a6b" strokeWidth={2.5} />
                </button>
              </div>

              {/* Links */}
              <div className="flex-1 px-3 py-3">
                <div className="px-2.5 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[1.2px] text-[#b0bdd8]">
                  Navigation
                </div>
                {NAV_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <motion.a
                      key={item.name}
                      href={item.url}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
                      onClick={() => { setActiveTab(item.name); setDrawerOpen(false); }}
                      className={`mb-0.5 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 no-underline transition-all duration-150 hover:translate-x-1 hover:bg-[rgba(0,35,149,0.07)] ${isActive ? "bg-[rgba(0,35,149,0.07)] text-[#002395]" : "text-[#3a4a6b]"}`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${isActive ? "bg-[rgba(0,35,149,0.1)]" : "bg-[#f5f8ff]"}`}>
                        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#002395" : "#6a7fa8"} />
                      </div>
                      <span className={`text-[14px] ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
                      {isActive && <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#002395]" />}
                    </motion.a>
                  );
                })}
              </div>

              {/* Footer CTA */}
              <div className="border-t border-[#eef3fb] px-5 pb-7 pt-4">
                <p className="mb-2.5 text-center text-[12px] text-[#7a8fbb]">Ready to start your French journey?</p>
                <ShimmerButton
                  className="w-full !justify-center !px-5 !py-3 !text-[14px]"
                  onClick={() => { setDrawerOpen(false); window.location.href = "#contact"; }}
                >
                  Free Consultation
                </ShimmerButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;