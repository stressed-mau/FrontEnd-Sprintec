import { LEVEL_COLORS, LEVEL_LABELS,} from '@/constants/skillConstants';

interface SkillLevelBadgeProps {
  level?: string;
}

export default function SkillLevelBadge({
  level,
}: SkillLevelBadgeProps) {
  if (!level) {
    return (
      <span className="text-gray-400 text-sm">
        —
      </span>
    );
  }

  const normalizedLevel =
    level.toLowerCase();

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
        LEVEL_COLORS[normalizedLevel] ??
        'bg-gray-100 text-gray-600'
      }`}
    >
      {LEVEL_LABELS[normalizedLevel] ??
        level}
    </span>
  );
}