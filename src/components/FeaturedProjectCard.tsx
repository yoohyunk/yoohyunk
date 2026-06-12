import { FaPlay, FaChevronDown, FaGithub } from "react-icons/fa";
import type { FeaturedProject } from "../data/featuredProjects";
import useInView from "../hooks/useInView";

interface Props {
  project: FeaturedProject;
  index: number;
}

/** Renders the demo video, or a clearly-labelled placeholder when no URL is set. */
function DemoVideo({ url, title }: { url: string; title: string }) {
  if (!url) {
    return (
      <div className="aspect-video w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center mb-3">
          <FaPlay className="w-5 h-5 text-violet-500 ml-1" aria-hidden="true" />
        </div>
        <p className="text-gray-600 font-medium">Demo video</p>
        <p className="text-gray-400 text-sm mt-1">Walkthrough coming soon</p>
      </div>
    );
  }

  const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
  if (isFile) {
    return (
      <video
        controls
        preload="metadata"
        className="aspect-video w-full rounded-xl border border-gray-200 bg-black"
      >
        <source src={url} />
        Your browser does not support embedded video.
      </video>
    );
  }

  // Loom share links work as embeds once /share/ becomes /embed/.
  const embedUrl = url.replace("loom.com/share/", "loom.com/embed/");
  return (
    <iframe
      src={embedUrl}
      title={`${title} demo video`}
      allowFullScreen
      className="aspect-video w-full rounded-xl border border-gray-200 bg-black"
    />
  );
}

export default function FeaturedProjectCard({ project, index }: Props) {
  const [ref, inView] = useInView(0.12);

  return (
    <article
      ref={ref}
      className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />

      <div className="p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              Featured · {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
            {project.title}
          </h3>
          <p className="text-gray-600 leading-relaxed max-w-2xl">
            {project.tagline}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mt-3 max-w-2xl">
            {project.status}
          </p>
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-violet-600 hover:text-violet-700 active:scale-95 transition"
            >
              <FaGithub className="w-4 h-4" aria-hidden="true" />
              View code on GitHub
            </a>
          ) : project.repoNote ? (
            <p className="inline-flex items-center gap-2 mt-4 text-sm text-gray-500">
              <FaGithub className="w-4 h-4 text-gray-400" aria-hidden="true" />
              {project.repoNote}
            </p>
          ) : null}
        </div>

        {/* Primary visual: demo video, or the glance diagram when video is hidden */}
        {project.hideVideo && project.diagram ? (
          <div className="mb-8 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 overflow-x-auto">
            <img
              src={project.diagram.src}
              alt={project.diagram.alt}
              className="w-full h-auto max-w-3xl mx-auto"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="mb-8">
            <DemoVideo url={project.demoVideoUrl} title={project.title} />
          </div>
        )}

        {/* What it does */}
        <section className="mb-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-600 mb-3">
            What it does
          </h4>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {project.whatItDoes}
          </p>
        </section>

        {/* Full breakdown expander */}
        <details className="group/breakdown">
          <summary className="flex items-center justify-between gap-4 cursor-pointer list-none rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors">
            <span className="font-semibold text-violet-600 text-sm uppercase tracking-wider">
              Show full breakdown
            </span>
            <FaChevronDown
              className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open/breakdown:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="mt-6">
            {/* Architecture diagram */}
            {(project.diagram || project.detailDiagram) && (
              <section className="mb-8">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-600 mb-3">
                  Architecture
                </h4>
                {project.diagram && !project.hideVideo && (
                  <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-4 overflow-x-auto">
                    <img
                      src={project.diagram.src}
                      alt={project.diagram.alt}
                      className="w-full h-auto max-w-3xl mx-auto"
                      loading="lazy"
                    />
                  </div>
                )}

                {project.detailDiagram && (
                  <details className="group mt-3 border border-gray-100 rounded-xl">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-3.5 hover:bg-gray-50 rounded-xl transition-colors">
                      <span className="font-medium text-[#1a1a2e]">
                        Full architecture (detail)
                      </span>
                      <FaChevronDown
                        className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <div className="px-4 pb-4 overflow-x-auto">
                      <img
                        src={project.detailDiagram.src}
                        alt={project.detailDiagram.alt}
                        className="h-auto mx-auto min-w-[760px] sm:min-w-0 sm:w-full"
                        loading="lazy"
                      />
                    </div>
                  </details>
                )}
              </section>
            )}

            {/* Key design decisions — the reasoning */}
            <section className="mb-8">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-600 mb-1">
                Key design decisions
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                The reasoning behind each piece. Click to expand.
              </p>
              <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
                {project.designDecisions.map((d) => (
                  <details key={d.title} className="group">
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-3.5 hover:bg-gray-50 rounded-xl transition-colors">
                      <span className="font-medium text-[#1a1a2e]">{d.title}</span>
                      <FaChevronDown
                        className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="px-4 pb-4 -mt-1 text-gray-600 text-sm leading-relaxed">
                      {d.body}
                    </p>
                  </details>
                ))}
              </div>
            </section>

            {/* Stack */}
            <section>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-violet-600 mb-3">
                Stack
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                {project.stack}
              </p>
            </section>
          </div>
        </details>
      </div>
    </article>
  );
}
