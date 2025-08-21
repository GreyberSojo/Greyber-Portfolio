// components/ProjectCaseStudy.tsx
import { Project } from "@/data/projects";

interface ProjectCaseStudyProps {
  project: Project;
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  return (
    <section className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        {/* Tipo y fecha */}
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Tipo: {project.type.toUpperCase()}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Actualizado: {project.metrics?.lastUpdated}
          </span>
        </div>

        {/* Estrellas si existen */}
        {project.metrics?.stars && (
          <div className="flex items-center gap-1 text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.947a1 1 0 00-.364-1.118L2.975 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-200">{project.metrics?.stars}</span>
          </div>
        )}
      </div>

      {/* Descripción corta */}
      <p className="mt-4 text-gray-800 dark:text-gray-100">
        {project.summary}
      </p>

      {/* Tech badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Tags badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-200 dark:bg-blue-700 rounded text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
    </section>
  );
}
