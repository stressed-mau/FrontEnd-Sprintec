import { ShieldCheck, Loader2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import type { ProfileForm } from '@/hooks/useProfile';

type PasswordTabProps = {
  form: ProfileForm;
  errors: Record<string, string>;
  isSubmitting: boolean;
  showCurrentPass: boolean;
  showNewPass: boolean;
  showConfirmPass: boolean;
  toggleCurrentPass: () => void;
  toggleNewPass: () => void;
  toggleConfirmPass: () => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: string) => void;
  onChangePassword: () => void;
};

function PasswordTab({
  form,
  errors,
  isSubmitting,

  showCurrentPass,
  showNewPass,
  showConfirmPass,

  toggleCurrentPass,
  toggleNewPass,
  toggleConfirmPass,

  handleChange,
  handleBlur,

  onChangePassword,
}: PasswordTabProps) {
  return (
    <div id="panel-password" className="space-y-4">
      {/* Contraseña actual */}
      <div>
        <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
          Contraseña actual <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            id="input-current-password"
            name="currentPasswordPassword"
            type={showCurrentPass ? "text" : "password"}
            autoComplete="off"
            placeholder="••••••••"
            maxLength={20}
            value={form.currentPasswordPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("currentPasswordPassword")}
            className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
              errors.currentPasswordPassword
                ? "border-red-500"
                : "border-[#A5D7E8]"
            }`}
          />

          <button
            type="button"
            onClick={toggleCurrentPass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
          >
            {showCurrentPass ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.currentPasswordPassword && (
          <p className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.currentPasswordPassword}
          </p>
        )}
      </div>

      {/* Nueva contraseña */}
      <div>
        <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
          Nueva contraseña <span className="text-red-500">*</span>
        </label>

        <p className="text-[10px] leading-4 text-[#5E7D95] mb-2 italic">
          La contraseña debe contener entre 8 y 20 caracteres, e incluir al
          menos una letra mayúscula, un número y un carácter especial.
        </p>

        <div className="relative">
          <input
            id="input-new-password"
            name="newPassword"
            type={showNewPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            maxLength={20}
            value={form.newPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("newPassword")}
            className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
              errors.newPassword
                ? "border-red-500"
                : "border-[#A5D7E8]"
            }`}
          />

          <button
            type="button"
            onClick={toggleNewPass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
          >
            {showNewPass ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.newPassword && (
          <p className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div>
        <label className="text-[#003A6C] text-xs font-semibold mb-1 block">
          Confirmar nueva contraseña <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            id="input-confirm-password"
            name="confirmPassword"
            type={showConfirmPass ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            maxLength={20}
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur("confirmPassword")}
            className={`w-full p-2.5 pr-10 rounded-lg border bg-white text-sm outline-none focus:ring-2 ring-blue-200 ${
              errors.confirmPassword
                ? "border-red-500"
                : "border-[#A5D7E8]"
            }`}
          />

          <button
            type="button"
            onClick={toggleConfirmPass}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B88A0] hover:text-[#003A6C]"
          >
            {showConfirmPass ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <p className="text-red-500 text-[10px] mt-1 font-medium">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        id="btn-change-password"
        onClick={onChangePassword}
        disabled={isSubmitting}
        className="w-full bg-[#003A6C] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#1a4f7a] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
      >
        {isSubmitting && (
          <Loader2 size={16} className="animate-spin" />
        )}
        Cambiar contraseña
      </button>

      {/* Banner de seguridad */}
      <div className="bg-[#EEF6FB] rounded-xl p-4 flex gap-3 border border-[#A5D7E8] mt-2">
        <div className="text-[#378ADD] shrink-0">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h4
            id="security-banner"
            className="text-[#003A6C] font-bold text-xs"
          >
            Seguridad de tu cuenta
          </h4>

          <p
            id="security-message"
            className="text-[#5B8FB9] text-[10px] leading-relaxed mt-0.5"
          >
            Mantén tu contraseña segura y no la compartas con nadie. Te
            recomendamos usar una contraseña única y cambiarla periódicamente.
          </p>
        </div>
      </div>
    </div>
  );
}
export default PasswordTab;