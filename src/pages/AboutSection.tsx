// src/pages/AboutSection.jsx

export default function AboutSection() {
  return (
    <section className="relative">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          About Me
          <div className="h-1 w-20 bg-blue-500 mx-auto mt-2 rounded-full" />
        </h2>
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 text-gray-700">
          <p className="text-lg leading-relaxed">
            I'm Yoohyun, a{" "}
            <span className="text-blue-600 font-semibold">
              Full-Stack Developer
            </span>{" "}
            based in Calgary, with equal strength in both front-end and back-end
            technologies.
          </p>
          <div className="border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-lg">
            <p className="text-lg">
              On the <span className="font-semibold">front end</span>, I build
              responsive, accessible UIs using React, Next.js, and Tailwind CSS.
              On the <span className="font-semibold">back end</span>, I design
              robust APIs and data models with Django, Node.js, and PostgreSQL.
            </p>
          </div>
          <p className="text-lg leading-relaxed">
            I love architecting end-to-end solutions—from database schema and
            server logic all the way to polished user experiences in the
            browser.
          </p>
        </div>
      </div>
    </section>
  );
}
