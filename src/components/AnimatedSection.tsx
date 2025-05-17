// src/components/AnimatedSection.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";

interface Props {
  name: string;
  children: React.ReactNode;
}

export default function AnimatedSection({ name, children }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Element name={name}>
      <div
        ref={ref}
        className={`
          transition-all duration-700 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        {children}
      </div>
    </Element>
  );
}
