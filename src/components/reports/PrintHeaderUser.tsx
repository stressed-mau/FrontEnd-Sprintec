import logo from "@/assets/logo/LogoPG.png";

type PrintHeaderProps = {
  title: string;
  subtitle: string;
};

function PrintHeaderUser({
  title,
  subtitle,
}: PrintHeaderProps) {
  return (
    <div className="hidden print:flex items-center justify-between mb-4 border-b border-gray-300 pb-3">
      <div className="w-1/3 flex justify-start">
        <img
          src={logo}
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      <div className="w-1/3 text-center">
        <h1 className="text-2xl font-bold text-[#003A6C] leading-tight">
          {title}
        </h1>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      <div className="w-1/3 flex justify-end">
        <div className="text-right">
          <p className="text-sm font-semibold text-[#003A6C]">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
export default PrintHeaderUser;