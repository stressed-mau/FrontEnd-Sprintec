interface SkillsEmptyStateProps {
  searchQuery: string;
  emptyMessage: string;
  searchMessage: string;
}

export default function SkillsEmptyState({
  searchQuery,
  emptyMessage,
  searchMessage,
}: SkillsEmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#6dacbf] bg-[#F7F0E1] py-14 text-center shadow-sm">
      <p className="text-sm text-[#4B778D]">
        {searchQuery
          ? searchMessage
          : emptyMessage}
      </p>
    </div>
  );
}