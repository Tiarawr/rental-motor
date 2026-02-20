"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bike, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Motor", href: "/motorcycles" },
    { name: "Tentang", href: "/#about" }, // Changed back to "#about" for later implementation
    { name: "Admin", href: "/admin/login" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
      );
    }
  }, []);

  // Use a transparent background primarily, but switch to blur when scrolled unless it's an admin page
  const isAdmin = pathname.startsWith("/admin");
  const bgClass =
    isScrolled || isAdmin || isMobileMenuOpen
      ? "bg-white/80 backdrop-blur-md border-b border-gray-200"
      : "bg-transparent border-transparent";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}
    >
      <div className="mx-auto px-6 md:px-12 max-w-[1200px]">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-bold tracking-tighter text-gray-900">
              Jogja Rentalan<span className="text-yellow-500">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith("/admin") && link.name === "Admin");

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors relative pb-1
                    after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:scale-x-0 after:h-[1px] auto 
                    hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-right hover:after:origin-left
                    ${
                      isActive
                        ? "text-gray-900 after:scale-x-100 after:bg-gray-900"
                        : "text-gray-500 hover:text-gray-900 after:bg-gray-900"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-800 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[15px] font-medium text-gray-800 hover:text-gray-400 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
