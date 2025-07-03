import { useEffect, useState } from "react";

export const useScrollTop = (threshold = 10) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > threshold;
            setScrolled(prev => {
                if (prev !== isScrolled) {
                    return isScrolled;
                }
                return prev;
            });
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold]);

    return scrolled;
};
