import { useEffect, useRef, useState } from "react";

export type FilterDropdownProps = {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export default function FilterDropdown({ value, options, placeholder, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current) return;
      if (event.target instanceof Node && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const selectedLabel = value === "all" ? placeholder ?? "Todos" : value;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-[#6DACBF]/30 bg-[#FDF8F0] px-2 text-xs text-[#003A6C] outline-none" >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`ml-2 h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-md border border-[#E6EDF2] bg-white shadow-lg">
          <li
            key="all"
            onClick={() => {
              onChange("all");
              setOpen(false);
            }}
            className={`cursor-pointer px-3 py-2 text-sm text-[#003A6C] hover:bg-[#F3F7F8] ${value === "all" ? "font-semibold" : ""}`} >
            {placeholder ?? "Todos"}
          </li>
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 text-sm text-[#003A6C] hover:bg-[#F3F7F8] ${value === option ? "font-semibold" : ""}`} >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
