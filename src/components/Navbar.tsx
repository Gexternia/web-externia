/**
 * Navbar.tsx
 * Fixed navigation bar with page links.
 * - On home (/): logo hidden, only nav links visible
 * - On subpages: logo visible as home link
 * - No border line
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { label: "Quiénes Somos", href: "/quienes-somos" },
    { label: "Servicios", href: "/servicios" },
    { label: "Formación", href: "/formacion" },
];

export default function Navbar() {
    const [isDark, setIsDark] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isHome, setIsHome] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Detect if we're on the home page
        const path = window.location.pathname;
        setIsHome(path === "/" || path === "");

        setIsDark(!document.documentElement.classList.contains("light"));

        const themeHandler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setIsDark(detail.isDark);
        };
        window.addEventListener("themechange", themeHandler);

        const scrollHandler = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", scrollHandler);

        return () => {
            window.removeEventListener("themechange", themeHandler);
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? isDark
                        ? "bg-black/80 backdrop-blur-md"
                        : "bg-white/80 backdrop-blur-md"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo — only visible on subpages */}
                    <div className="flex-shrink-0">
                        <AnimatePresence>
                            {!isHome && (
                                <motion.a
                                    href="/"
                                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={isDark ? "/logo-externia-clean.png" : "/logo-externia-light-fixed.png"}
                                        alt="Externia — Inicio"
                                        className="h-8 sm:h-10 w-auto object-contain"
                                    />
                                </motion.a>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${isDark
                                        ? "text-gray-300 hover:text-azul"
                                        : "text-gray-600 hover:text-brand-magenta"
                                    }`}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-black/5"
                            }`}
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {menuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu — no border line */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden pb-4 overflow-hidden"
                        >
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`block py-3 px-2 text-sm font-medium transition-colors ${isDark
                                            ? "text-gray-300 hover:text-azul"
                                            : "text-gray-600 hover:text-brand-magenta"
                                        }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
