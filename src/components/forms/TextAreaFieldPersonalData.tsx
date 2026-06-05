type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  warning?: string;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
};

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  error,
  warning,
  rows = 4,
  maxLength,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div className="space-y-1.5 md:col-span-2">
      <label className="block text-sm font-medium text-[#003A6C]">
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-[#C2DBED] bg-white px-3 py-2 text-sm text-[#003A6C]"
      />

      {error ? (
        <p className="text-red-500 text-xs">{error}</p>
      ) : warning ? (
        <p className="text-amber-700 text-xs">{warning}</p>
      ) : null}
    </div>
  );
}