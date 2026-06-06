import {  ChevronDown, ChevronUp,} from "lucide-react";
import type {  SectionKey, VisibilityItem,} from "@/services/portfolioVisibilityService";

interface VisibilitySectionCardProps {
  sectionKey: SectionKey;
  label: string;
  items: VisibilityItem[];
  isExpanded: boolean;
  isSaving: boolean;
  onToggleExpand: (key: string) => void;
  onBulkSelect: (key: SectionKey,checked: boolean,) => void;
  onItemCheck: (key: SectionKey,id: number,sourceTable?: VisibilityItem["sourceTable"],) => Promise<void>;
  visibleStats: string;
}

export default function VisibilitySectionCard({sectionKey, label,items,isExpanded, isSaving,
  onToggleExpand,onBulkSelect, onItemCheck, visibleStats,}: VisibilitySectionCardProps) {
  const hasItems = items.length > 0;
  const allChecked =
    hasItems &&
    items.every((item) => item.checked);
  const sectionEnabled =
    hasItems &&
    items.some((item) => item.checked);
  return (
    <div
      className={`border border-[#C9E1F0] rounded-xl overflow-hidden transition-all ${
        !sectionEnabled
          ? "opacity-50"
          : "opacity-100"
      }`}    >
      <div className="p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sectionEnabled}
              disabled={isSaving || !hasItems}
              onChange={() =>
                onBulkSelect(
                  sectionKey,
                  !sectionEnabled
                )
              }   />

            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#003A6C]" />
          </label>

          <div className="flex items-center gap-3">
            <span className="text-[#003A6C] font-semibold">
              {label}
            </span>

            <span className="text-gray-400 text-sm font-medium">
              {visibleStats}
            </span>
          </div>
        </div>

        <button
          onClick={() =>
            onToggleExpand(sectionKey)  }
          className="p-1 rounded-full hover:bg-gray-100 text-[#003A6C] transition-colors">
          {isExpanded ? (<ChevronUp className="w-5 h-5" /> ) : ( <ChevronDown className="w-5 h-5" />   )}
        </button>
      </div>

      {isExpanded && (
        <div className="border-t border-[#C9E1F0] bg-[#F8FBFE] px-6 py-5">
          {items.length > 0 ? (
            <>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() =>
                    onBulkSelect(
                      sectionKey,
                      true
                    ) }
                  disabled={ isSaving || allChecked }
                  className="px-4 py-2 bg-[#C9E1F0] text-[#003A6C] text-sm font-medium rounded-lg shadow-sm"  >
                  Seleccionar todos
                </button>

                <button
                  onClick={() =>
                    onBulkSelect(
                      sectionKey,
                      false
                    )}
                  disabled={
                    isSaving || !allChecked
                  }
                  className="px-4 py-2 bg-[#C9E1F0] text-[#003A6C] text-sm font-medium rounded-lg shadow-sm"   >
                  Deseleccionar todos
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.sourceTable}-${item.id}`}
                    className="flex items-center gap-4" >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      disabled={isSaving}
                      onChange={() =>
                        onItemCheck(
                          sectionKey,
                          item.id,
                          item.sourceTable
                        )
                      }
                      className="w-4 h-4 text-[#003A6C] border-[#A5D7E8] rounded focus:ring-[#003A6C] cursor-pointer"        />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#003A6C]">
                        {item.label}
                      </span>

                      {item.sublabel && (
                        <span className="text-xs text-gray-400 font-medium">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No hay elementos para mostrar en esta sección.
            </p>
          )}
        </div>
      )}
    </div>
  );
}