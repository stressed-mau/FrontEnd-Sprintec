import { Search } from 'lucide-react';

interface SkillsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export default function SkillsSearchBar({
  value,
  onChange,
  placeholder,
}: SkillsSearchBarProps) {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#4B778D]" />

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#0E7D96]/20 bg-white text-[#003A6C] placeholder:text-[#4B778D]/60 outline-none focus:ring-2 focus:ring-[#0E7D96]/30 shadow-sm"
      />
    </div>
  );
}