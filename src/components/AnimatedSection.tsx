// src/components/AnimatedSection.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

interface AnimatedSectionProps {
  children: ((isVisible: boolean) => React.ReactNode) | React.ReactNode;
  className?: string;
}

export default function AnimatedSection({
  children,
  className = "",
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (
          entry.isIntersecting &&
          !hasScrolled.current &&
          sectionRef.current
        ) {
          const sectionRect = sectionRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Only scroll if the section is not mostly in view
          if (Math.abs(sectionRect.top) > viewportHeight * 0.2) {
            const targetScroll =
              window.pageYOffset +
              sectionRect.top -
              (viewportHeight - sectionRect.height) / 2;

            window.scrollTo({
              top: targetScroll,
              behavior: "smooth",
            });

            hasScrolled.current = true;
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "-10% 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Reset scroll flag when section is no longer visible
  useEffect(() => {
    if (!isVisible) {
      hasScrolled.current = false;
    }
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      className={`w-full min-h-[80vh] py-12 transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
    >
      {typeof children === "function" ? children(isVisible) : children}
    </section>
  );
}
