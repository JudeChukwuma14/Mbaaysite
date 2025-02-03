import React from "react";
interface statsBox {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}
const StatsBoxprops: React.FC<statsBox> = ({ icon, value, label }) => {
  return (
    <div className="flex flex-col items-center p-6 shadow-md w-full sm:w-1/2 lg:w-1/4 hover:bg-orange-500 hover:text-white transition-all duration-500 ease-in-out">
      <div className="text-4xl mb-4">{icon}</div>
      <div className="text-3xl font-semibold">{value}</div>
      <div className="mt-2 text-center">{label}</div>
    </div>
  );
};
export default StatsBoxprops;
