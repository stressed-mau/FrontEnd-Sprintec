import { Eye, EyeOff, Loader2 } from "lucide-react";
import type {
  ProfileData,
  ProfileForm,
  EmailSuggestion,
} from '@/hooks/useProfile';
type AccountInfoTabProps = {
  form: ProfileForm;
  profile: ProfileData;
  errors: Record<string, string>;
  suggestion: EmailSuggestion | null;
  isSubmitting: boolean;
  showCurrentPass: boolean;
  toggleCurrentPass: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => void;
  applyEmailSuggestion: (email: string) => void;
  onUpdateInfo: () => void;
};

function AccountInfoTab({
  form,
  profile,
  errors,
  suggestion,
  isSubmitting,
  showCurrentPass,
  toggleCurrentPass,
  handleChange,
  handleBlur,
  applyEmailSuggestion,
  onUpdateInfo,
}: AccountInfoTabProps) {
  return (
    <div id="panel-info" className="space-y-4">
        <div>
        <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
            Nombre de usuario <span className="text-red-500">*</span>
        </label>
        <input
            id="input-username"
            name="username"
            type="text"
            maxLength={30}
            value={form.username}
            onChange={handleChange}
            onBlur={() => handleBlur("username")}
            className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
            errors.username ? 'border-red-500' : 'border-[#A5D7E8]'
            }`}
        />
        {errors.username && (
            <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.username}</p>
        )}
        </div>
        <div>
        <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
            Correo electrónico
        </label>
        <input
            id="input-email"
            type="email"
            name="email"
            maxLength={60}
            value={form.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            className={`w-full p-2.5 rounded-lg border bg-white text-[#003A6C] text-sm outline-none focus:ring-2 ring-blue-200 ${
            errors.email ? 'border-red-500' : 'border-[#A5D7E8]'
            }`}
        />
        {suggestion && (
            <p className="mt-1 text-xs text-[#003A6C]">
            ¿Quisiste decir{' '}
            <span
                className="underline cursor-pointer font-bold text-[#7C4AA6] hover:text-[#003A6C]"
                onClick={() => applyEmailSuggestion(suggestion.full)}
            >
                {suggestion.full}
            </span>
            ?
            </p>
        )}
        {errors.email && (
            <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.email}</p>
        )}
        </div>
        {(form.username.trim() !== profile.username.trim() || form.email.trim() !== profile.email.trim()) && (
        <div>
            <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
            Contraseña actual <span className="text-red-500">*</span>
            <span className="text-[#5B8FB9] font-normal ml-1">(requerida para cambiar la información)</span>
            </label>
            <div className="relative">
            <input
                id="input-current-password-info"
                name="currentPasswordInfo"
                type={showCurrentPass ? 'text' : 'password'}
                autoComplete="off"
                placeholder="••••••••"
                maxLength={20}
                value={form.currentPasswordInfo}
                onChange={handleChange}
                onBlur={() => handleBlur("currentPasswordInfo")}
                className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
                errors.currentPasswordInfo ? 'border-red-500' : 'border-[#A5D7E8]'
                }`}
            />
            <button
                type="button"
                onClick={toggleCurrentPass}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
            >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            </div>
            {errors.currentPasswordInfo && (
            <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.currentPasswordInfo}</p>
            )}
        </div>
        )}

        <button
        id="btn-update-info"
        onClick={onUpdateInfo}
        disabled={isSubmitting}
        className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm mt-1 hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
        >
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        Actualizar información
        </button>
    </div>
  );
}
export default AccountInfoTab;