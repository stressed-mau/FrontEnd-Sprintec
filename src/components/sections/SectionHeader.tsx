import type { ElementType, ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  align?: "left" | "center";
  size?: "default" | "compact" | "subsection" | "modal";
  headingLevel?: 1 | 2 | 3;
  titleId?: string;
  descriptionId?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  actions,
  align = "left",
  size = "default",
  headingLevel = 1,
  titleId,
  descriptionId,
  className = "",
}: SectionHeaderProps) {
  const hasActions = Boolean(actions);
  const Heading = `h${headingLevel}` as ElementType;

  return (
    <div className={joinClasses(hasActions ? "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between" : "", className)}>
      <div className={joinClasses("min-w-0", align === "center" ? "text-center sm:text-left" : "")}>
        <Heading id={titleId} className={getTitleClassName(size)}>
          {title}
        </Heading>
        {description ? (
          <p id={descriptionId} className={getDescriptionClassName(size)}>
            {description}
          </p>
        ) : null}
      </div>
      {hasActions ? <div className="w-full shrink-0 sm:w-auto">{actions}</div> : null}
    </div>
  );
}

function getTitleClassName(size: SectionHeaderProps["size"]) {
  const baseClassName = "break-words leading-tight text-[#003A6C]";
  if (size === "compact") return `${baseClassName} text-2xl font-bold md:text-3xl`;
  if (size === "subsection") return `${baseClassName} text-xl font-bold`;
  if (size === "modal") return `${baseClassName} text-2xl font-bold`;
  return `${baseClassName} text-3xl font-bold md:text-4xl`;
}

function getDescriptionClassName(size: SectionHeaderProps["size"]) {
  const baseClassName = "max-w-3xl break-words text-[#4B778D]";
  if (size === "compact") return `${baseClassName} mt-1 text-sm`;
  if (size === "subsection") return `${baseClassName} mt-1 text-sm`;
  if (size === "modal") return `${baseClassName} mt-1 text-sm`;
  return `${baseClassName} mt-2 text-sm md:text-base`;
}

function joinClasses(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
