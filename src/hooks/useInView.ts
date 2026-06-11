// src/hooks/useInView.ts
import { useEffect, useRef, useState, RefObject } from "react";

/**
 * Observe an element's viewport intersection.
 * @param threshold IntersectionObserver threshold.
 * @param once When true (default), latch to visible on first intersection and
 *   stop observing, so a fast scroll-out never re-hides revealed content.
 */
export default function useInView(
  threshold = 0.1,
  once = true
): [RefObject<HTMLDivElement | null>, boolean] {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (once) observer.unobserve(element);
        } else if (!once) {
          setIntersecting(false);
        }
      },
      { threshold, rootMargin: "0px 0px 15% 0px" }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold, once]);

  return [ref, isIntersecting];
}
