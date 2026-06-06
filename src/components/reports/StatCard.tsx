import type { ElementType } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  Icon: ElementType;
}

const StatCard = ({ title, value, subtext, Icon }: StatCardProps) => {
  return (
    <div className="
      bg-white
      p-3 sm:p-5
      rounded-2xl sm:rounded-3xl
      border border-[#D6E6EE]
      shadow-sm
      transition-all
      hover:shadow-md
      hover:border-[#70A1B9]
    ">
      <div className="flex items-start justify-between">

        <div className="space-y-1 sm:space-y-2">
          <p className="text-[#4B778D] font-semibold text-sm leading-tight">
            {title}
          </p>

          <p className="text-2xl sm:text-4xl font-bold text-[#003A6C] leading-none">
            {value}
          </p>

          <p className="text-xs text-[#70A1B9] font-medium">
            {subtext}
          </p>
        </div>

        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#F1F7F9]">
          <Icon
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#003A6C]"
            strokeWidth={1.7}
          />
        </div>

      </div>
    </div>
  );
};

export default StatCard;