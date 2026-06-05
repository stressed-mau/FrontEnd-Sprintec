type InputFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  warning?: string;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function InputField({
  id,
  label,
  value,
  onChange,
  error,
  warning,
  type = "text",
  maxLength,
  placeholder,
  disabled = false,
  className = "",
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-[#003A6C]">
        {label}
      </label>

      <input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-10 w-full rounded-lg border border-[#C2DBED] bg-white px-3 text-sm text-[#003A6C] ${className}`}
      />

      {error ? (
        <p className="text-red-500 text-xs">{error}</p>
      ) : warning ? (
        <p className="text-amber-700 text-xs">{warning}</p>
      ) : null}
    </div>
  );
}