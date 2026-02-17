import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useLeaderboardAnimations = ({
  headerRef,
  tabsRef,
  topCardsRef,
  listRef,
  ctaRef,
}) => {
  useEffect(() => {
    // HEADER
    gsap.from(headerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    });

    // TABS + TITLE
    gsap.from(tabsRef.current.children, {
      y: 20,
      opacity: 0,
      stagger: 0.12,
      duration: 0.45,
      ease: "power3.out",
    });

    // TOP 3 PODIUM
    gsap.from(topCardsRef.current.children, {
      scale: 0.85,
      opacity: 0,
      y: 30,
      stagger: 0.18,
      duration: 0.6,
      ease: "back.out(1.6)",
    });

    // LEADERBOARD ROWS (SCROLL)
    gsap.from(listRef.current.children, {
      scrollTrigger: {
        trigger: listRef.current,
        start: "top 80%",
      },
      y: 20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.4,
      ease: "power2.out",
    });

    // BOTTOM CTA
    gsap.from(ctaRef.current, {
      y: 20,
      opacity: 0,
      delay: 0.2,
      duration: 0.45,
      ease: "power3.out",
    });
  }, []);
};
