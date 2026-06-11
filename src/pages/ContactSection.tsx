import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "-100px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const contacts = [
    {
      icon: FaEnvelope,
      label: "Email",
      href: "mailto:yoohyunk20@gmail.com",
      external: false,
    },
    {
      icon: FaLinkedinIn,
      label: "LinkedIn",
      href: "https://linkedin.com/in/yoohyunk",
      external: true,
    },
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/yoohyunk",
      external: true,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`w-full transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className={`font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } text-4xl md:text-6xl`}
        >
          Let's Connect
        </h2>
        <p
          className={`text-gray-500 text-lg mb-12 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Have a project in mind? Let's talk.
        </p>
        <div
          className={`flex justify-center gap-6 transition-all duration-700 delay-[600ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {contacts.map(({ icon: Icon, label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-purple-400 group-hover:shadow-lg group-hover:shadow-purple-500/10 group-hover:scale-110 group-active:scale-95 transition-all duration-300">
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-500 transition-colors" />
              </div>
              <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
