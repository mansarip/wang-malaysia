import myr1 from "./assets/myr1_small.png";
import myr5 from "./assets/myr5_small.png";
import myr10 from "./assets/myr10_small.png";
import myr20 from "./assets/myr20_small.png";
import myr50 from "./assets/myr50_small.png";
import myr100 from "./assets/myr100_small.png";
import sen50 from "./assets/50sen.png";
import sen20 from "./assets/20sen.png";
import sen10 from "./assets/10sen.png";
import sen5 from "./assets/5sen.png";

const types = {
  1: {
    text: "RM 1",
    bgColor: "bg-sky-800",
    borderColor: "border-sky-900",
    image: myr1,
  },
  5: {
    text: "RM 5",
    bgColor: "bg-green-800",
    borderColor: "border-green-900",
    image: myr5,
  },
  10: {
    text: "RM 10",
    bgColor: "bg-red-800",
    borderColor: "border-red-900",
    image: myr10,
  },
  20: {
    text: "RM 20",
    bgColor: "bg-yellow-800",
    borderColor: "border-yellow-900",
    image: myr20,
  },
  50: {
    text: "RM 50",
    bgColor: "bg-teal-800",
    borderColor: "border-teal-900",
    image: myr50,
  },
  100: {
    text: "RM 100",
    bgColor: "bg-purple-800",
    borderColor: "border-purple-900",
    image: myr100,
  },
  0.5: {
    text: "50 sen",
    bgColor: "bg-yellow-800",
    borderColor: "border-yellow-900",
    image: sen50,
    isSyiling: true,
  },
  0.2: {
    text: "20 sen",
    bgColor: "bg-yellow-800",
    borderColor: "border-yellow-900",
    image: sen20,
    isSyiling: true,
  },
  0.1: {
    text: "10 sen",
    bgColor: "bg-slate-700",
    borderColor: "border-slate-800",
    image: sen10,
    isSyiling: true,
  },
  0.05: {
    text: "5 sen",
    bgColor: "bg-slate-700",
    borderColor: "border-slate-800",
    image: sen5,
    isSyiling: true,
  },
};

export default function ButtonAdd({ type, onClick }) {
  const buttonType = types[type];

  if (!buttonType) return null;

  return (
    <div
      className={`min-w-[100px] h-[90px] flex flex-col items-center justify-center p-2 button-duit transform scale-100 transition-transform duration-[50ms] ease-in-out active:scale-95 cursor-pointer`}
      onClick={onClick}
    >
      {buttonType.isSyiling ? (
        <>
          <img
            src={buttonType.image}
            className={`w-[50%] shadow-lg border ${buttonType.borderColor} rounded-full`}
          />
          <div
            className={`mt-1 ${buttonType.bgColor} ${buttonType.borderColor} border-2 text-white text-md delius-unicase-bold px-2 py-1 rounded-lg`}
          >
            {buttonType.text}
          </div>
        </>
      ) : (
        <>
          <img
            src={buttonType.image}
            className={`shadow-lg border-2 ${buttonType.borderColor}`}
          />
          <div
            className={`${buttonType.bgColor} ${buttonType.borderColor} border-2 text-white text-md delius-unicase-bold px-2 py-1 rounded-b-lg border-t-0`}
          >
            {buttonType.text}
          </div>
        </>
      )}
    </div>
  );
}
