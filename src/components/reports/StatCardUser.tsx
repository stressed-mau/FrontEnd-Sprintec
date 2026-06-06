import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  Icon: React.ElementType;
}
function StatCardUser({
  title,
  value,
  subtext,
  Icon,
}: StatCardProps) {
  return (
    <div
      className="
        bg-white
        border border-[#C9E1F0]
        rounded-2xl sm:rounded-[2rem]
        p-3 sm:p-5
        shadow-sm
        transition-all
        hover:border-[#70A1B9]
        print:shadow-none
      "
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-[#4B778D] font-semibold text-sm uppercase tracking-wide">
            {title}
          </p>

          <p className="text-2xl sm:text-4xl font-bold text-[#003A6C] leading-none">
            {value}
          </p>

          <p className="text-xs text-[#70A1B9] font-medium">
            {subtext}
          </p>
        </div>

        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-[#F5FAFD]">
          <Icon
            className="w-4 h-4 sm:w-5 sm:h-5 text-[#003A6C]"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
}
export default StatCardUser;