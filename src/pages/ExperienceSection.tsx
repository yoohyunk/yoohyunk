import { useEffect, useRef, useState } from "react";
import experience from "../data/experience.json";

type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  start: string; // YYYY-MM or text
  end: string; // YYYY-MM or "Present"
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
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "-100px",
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

  const items: ExperienceItem[] = [...(experience as ExperienceItem[])].sort(
    (a, b) =>
      parseDateForSort(b.end || b.start) - parseDateForSort(a.end || a.start)
  );

  // prepare revealed flags per item length
  useEffect(() => {
    setRevealed((prev) => {
      if (prev.length === items.length) return prev;
      return Array(items.length).fill(false);
    });
  }, [items.length]);

  // toggle each card visibility when it enters/leaves the viewport
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setRevealed((state) => {
            const next =
              state.length === items.length
                ? [...state]
                : Array(items.length).fill(false);
            next[idx] = entry.isIntersecting;
            return next;
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [items.length]);

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-[opacity,transform] duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-5xl mx-auto px-2 sm:px-4">
        <h2
          className={`text-4xl font-bold mb-12 text-purple-200 text-center transition-[opacity,transform] duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Experience
          <div
            className={`h-0.5 w-28 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transition-[opacity,transform] duration-700 delay-300 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </h2>

        <div className="relative">
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-purple-600/60 via-purple-500/30 to-transparent rounded-full transition-[height,opacity] duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ height: isVisible ? "100%" : "0%" }}
          />

          <ul className="space-y-10">
            {items.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <li
                  key={`${item.title}-${item.company}-${index}`}
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-6"
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                >
                  <div
                    className={`hidden md:block ${
                      isLeft ? "md:order-5" : "md:order-2"
                    }`}
                  />

                  <div
                    className={`${
                      isLeft ? "md:order-1 md:pr-10" : "md:order-2 md:pl-10"
                    }`}
                  >
                    <div
                      className={`relative group transition-[opacity,transform] duration-700 ${
                        revealed[index]
                          ? "opacity-100 translate-x-0"
                          : isLeft
                          ? "opacity-0 -translate-x-6"
                          : "opacity-0 translate-x-6"
                      }`}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <span
                        className={`absolute top-3 ${
                          isLeft ? "-right-[64px]" : "-left-[64px]"
                        } block w-6 h-6 rounded-full bg-[#0a0a0c]`}
                        style={{ boxShadow: "0 0 0 2px rgba(168,85,247,0.6)" }}
                      />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-500" />

                      <div className="relative bg-[#0a0a0c] rounded-lg p-5 text-gray-300 border border-purple-900/20 hover:border-purple-600/40 transition-colors">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-purple-200">
                            {item.title}
                          </h3>
                          <span className="text-gray-400">
                            @ {item.company}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-3">
                          <span>
                            {item.start} — {item.end}
                          </span>
                          {item.location ? (
                            <span> • {item.location}</span>
                          ) : null}
                        </div>
                        {item.bullets && item.bullets.length > 0 && (
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {item.bullets.map((b, bi) => (
                              <li key={bi}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
