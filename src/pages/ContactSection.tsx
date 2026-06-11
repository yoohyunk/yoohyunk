import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaLinkedinIn, FaGithub } from "react-icons/fa";

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 15% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
      className={`w-full transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className={`font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } text-4xl md:text-6xl`}
        >
          Let's Connect
        </h2>
        <p
          className={`text-gray-500 text-lg mb-12 transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Have a project in mind? Let's talk.
        </p>
        <div className="flex justify-center gap-6">
          {contacts.map(({ icon: Icon, label, href, external }, i) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={`group flex flex-col items-center gap-3 transition-all duration-300 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ transitionDelay: isVisible ? `${i * 50}ms` : "0ms" }}
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
