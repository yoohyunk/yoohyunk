import { useState, useEffect, useRef } from "react";

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
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

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-[opacity,transform] duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className={`text-4xl font-bold mb-8 text-purple-200 text-center transition-[opacity,transform] duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Let's Connect
          <div
            className={`h-0.5 w-20 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full transition-[opacity,transform] duration-700 delay-500 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
            }`}
          />
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="mailto:yoohyunk20@gmail.com"
            className="flex items-center p-4 sm:p-5 rounded-xl hover:bg-purple-900/20 active:bg-purple-900/30 transition-colors group min-h-[72px]"
          >
            <div className="bg-purple-900/30 p-3 sm:p-3.5 rounded-full group-hover:bg-purple-800/40 group-active:bg-purple-800/50 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <h3 className="font-semibold text-purple-200 text-sm sm:text-base">Email</h3>
              <p className="text-gray-400 group-hover:text-purple-300 group-active:text-purple-300 transition-colors text-sm sm:text-base truncate">
                yoohyunk20@gmail.com
              </p>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/yoohyunk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 sm:p-5 rounded-xl hover:bg-purple-900/20 active:bg-purple-900/30 transition-colors group min-h-[72px]"
          >
            <div className="bg-purple-900/30 p-3 sm:p-3.5 rounded-full group-hover:bg-purple-800/40 group-active:bg-purple-800/50 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <h3 className="font-semibold text-purple-200 text-sm sm:text-base">LinkedIn</h3>
              <p className="text-gray-400 group-hover:text-purple-300 group-active:text-purple-300 transition-colors text-sm sm:text-base truncate">
                linkedin.com/in/yoohyunk
              </p>
            </div>
          </a>

          <a
            href="https://github.com/yoohyunk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 sm:p-5 rounded-xl hover:bg-purple-900/20 active:bg-purple-900/30 transition-colors group md:col-span-2 min-h-[72px]"
          >
            <div className="bg-purple-900/30 p-3 sm:p-3.5 rounded-full group-hover:bg-purple-800/40 group-active:bg-purple-800/50 transition-colors flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4 min-w-0">
              <h3 className="font-semibold text-purple-200 text-sm sm:text-base">GitHub</h3>
              <p className="text-gray-400 group-hover:text-purple-300 group-active:text-purple-300 transition-colors text-sm sm:text-base truncate">
                github.com/yoohyunk
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
