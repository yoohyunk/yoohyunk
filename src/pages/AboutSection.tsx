// src/pages/AboutSection.jsx

export default function AboutSection() {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <h2 className="text-4xl font-bold mb-6 text-gray-900">About Me</h2>
      <div className="w-full max-w-2xl text-center space-y-4 text-gray-700">
        <p>
          I’m Yoohyun, a <strong>Full-Stack Developer</strong> based in Calgary,
          with equal strength in both front-end and back-end technologies.
        </p>
        <p>
          On the <strong>front end</strong>, I build responsive, accessible UIs
          using React, Next.js, and Tailwind CSS. On the{" "}
          <strong>back end</strong>, I design robust APIs and data models with
          Django, Node.js, and PostgreSQL.
        </p>
        <p>
          I love architecting end-to-end solutions—from database schema and
          server logic all the way to polished user experiences in the browser.
        </p>
      </div>
    </section>
  );
}
