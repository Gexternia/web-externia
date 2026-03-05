/**
 * HeroContent.tsx
 * Animated hero logo that scales and moves toward the navbar on scroll.
 * On the home page, the logo starts centered/large and shrinks upward as you scroll.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

export default function HeroContent() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        setIsDark(!document.documentElement.classList.contains("light"));
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            setIsDark(detail.isDark);
        };
        window.addEventListener("themechange", handler);
        return () => window.removeEventListener("themechange", handler);
    }, []);

    // Scroll-based animation: logo shrinks and fades as you scroll
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 300], [1, 0.3]);
    const y = useTransform(scrollY, [0, 300], [0, -150]);

    return (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center pointer-events-none">
            <motion.img
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ opacity, scale, y }}
                src={isDark ? "/logo-externia-clean.png" : "/logo-externia-light-fixed.png"}
                alt="Externia"
                className="w-[360px] sm:w-[500px] md:w-[650px] lg:w-[800px] mx-auto object-contain drop-shadow-lg"
                key={isDark ? "dark" : "light"}
            />
        </div>
    );
}
