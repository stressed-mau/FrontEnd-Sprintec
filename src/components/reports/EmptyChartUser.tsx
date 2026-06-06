import { Eye } from "lucide-react";

type EmptyChartProps = {
  message: string;
};

function EmptyChartUser({
  message,
}: EmptyChartProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] text-center">
      <Eye
        className="w-14 h-14 text-gray-300 mb-4"
        strokeWidth={1.5}
      />

      <p className="text-[#4B5563] text-base">
        {message}
      </p>
    </div>
  );
}
export default EmptyChartUser;