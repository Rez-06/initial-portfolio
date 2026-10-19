import type { ProjectStatus, SkillStatus } from "@/lib/types";

const PROJECT_LABEL: Record<ProjectStatus, string> = {
  "in-development": "In development",
  completed: "Completed",
  academic: "Academic project",
  prototype: "Prototype",
  archived: "Archived",
};
export const SKILL_LABEL: Record<SkillStatus, string> = {
  comfortable: "Comfortable",
  learning: "Learning",
  exploring: "Exploring",
};

export function StatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-2.5 py-1 text-xs font-semibold text-ink">
      <span aria-hidden className={`size-1.5 rounded-full ${status === "in-development" ? "bg-cobalt" : "bg-ink"}`} />
      {PROJECT_LABEL[status]}
    </span>
  );
}
