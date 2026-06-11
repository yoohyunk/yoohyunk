import { useState, useEffect, useRef } from "react";
import experience from "../data/experience.json";

type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  start: string;
  end: string;
  bullets?: string[];
};

function parseDateForSort(value: string): number {
  if (!value) return 0;
  if (/(present|current)/i.test(value)) return Number.MAX_SAFE_INTEGER;
  const parts = value.split("-");
  const year = parseInt(parts[0], 10);
  const month = parts[1] ? parseInt(parts[1], 10) : 1;
  if (Number.isNaN(year)) return 0;
  return year * 100 + month;
}

export default function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items: ExperienceItem[] = [...(experience as ExperienceItem[])].sort(
    (a, b) =>
      parseDateForSort(b.end || b.start) - parseDateForSort(a.end || a.start)
  );

  useEffect(() => {
    setRevealed((prev) => {
      if (prev.length === items.length) return prev;
      return Array(items.length).fill(false);
    });
  }, [items.length]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setRevealed((state) => {
            const next =
              state.length === items.length ? [...state] : Array(items.length).fill(false);
            next[idx] = true;
            return next;
          });
          obs.unobserve(el);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2
          className={`font-bold text-center mb-16 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } text-4xl md:text-6xl`}
        >
          Experience
        </h2>

        <div className="relative space-y-8 md:space-y-16">
          {/* Mobile left rail */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-transparent md:hidden" />
          {/* Desktop center line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-300 via-pink-300 to-transparent hidden md:block" />

          {items.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={`${item.title}-${item.company}-${index}`}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className={`relative pl-6 md:pl-0 flex flex-col md:flex-row items-center gap-8 transition-all duration-300 ${
                  revealed[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span className="absolute left-0 top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-purple-400 md:hidden" />
                {/* Spacer for alternating layout */}
                {!isLeft && <div className="hidden md:block md:w-1/2" />}

                {/* Card */}
                <div className={`w-full md:w-1/2 ${isLeft ? "md:pr-12" : "md:pl-12"}`}>
                  <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full whitespace-nowrap">
                        {item.start} to {item.end}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">
                      {item.company}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {item.bullets.map((b, bi) => (
                          <li
                            key={bi}
                            className="text-gray-600 text-sm leading-relaxed flex gap-2"
                          >
                            <span className="text-purple-400 mt-1.5 flex-shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                {isLeft && <div className="hidden md:block md:w-1/2" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
