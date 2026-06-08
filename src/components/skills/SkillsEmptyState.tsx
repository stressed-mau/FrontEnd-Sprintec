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
    <div className="rounded-2xl border border-[#A5D7E8] bg-white px-6 py-14 text-center shadow-sm">
      <p className="text-sm text-[#4B778D]">
        {searchQuery
          ? searchMessage
          : emptyMessage}
      </p>
    </div>
  );
}