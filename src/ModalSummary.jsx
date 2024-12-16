import { Fragment } from "react";
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
import { formatCurrency } from "./utils";

const types = {
  0.05: {
    text: "5 Sen",
    color: "text-slate-800",
    subColor: "text-slate-700",
    image: sen5,
  },
  0.1: {
    text: "10 Sen",
    color: "text-slate-800",
    subColor: "text-slate-700",
    image: sen10,
  },
  0.2: {
    text: "20 Sen",
    color: "text-yellow-800",
    subColor: "text-yellow-700",
    image: sen20,
  },
  0.5: {
    text: "50 Sen",
    color: "text-yellow-800",
    subColor: "text-yellow-700",
    image: sen50,
  },
  1: {
    text: "RM 1",
    color: "text-sky-800",
    subColor: "text-sky-700",
    image: myr1,
  },
  5: {
    text: "RM 5",
    color: "text-green-800",
    subColor: "text-green-700",
    image: myr5,
  },
  10: {
    text: "RM 10",
    color: "text-red-800",
    subColor: "text-red-700",
    image: myr10,
  },
  20: {
    text: "RM 20",
    color: "text-yellow-800",
    subColor: "text-yellow-700",
    image: myr20,
  },
  50: {
    text: "RM 50",
    color: "text-teal-800",
    subColor: "text-teal-700",
    image: myr50,
  },
  100: {
    text: "RM 100",
    color: "text-purple-800",
    subColor: "text-purple-700",
    image: myr100,
  },
};

export default function ModalSummary({
  close,
  stack = {},
  denominations = [],
  total = 0,
}) {
  return (
    <div
      className="absolute z-40 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-amber-950 bg-opacity-50"
      onClick={close}
    >
      <div
        className="bg-white w-[90%] h-[80%] rounded-xl border-4 border-gray-800 shadow-xl flex flex-col coin-drop overflow-hidden"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between bg-gradient-to-b from-amber-700 to-amber-800 text-white px-5 py-2 rounded-t-lg border-t-2 border-t-amber-500 border-b-4 border-b-amber-900 text-sm font-bold [text-shadow:_0_2px_0_black]">
          <span>RINGKASAN</span>
          <button
            onClick={close}
            className="rounded-full bg-red-700 text-sm px-3 font-bold text-red-100 border border-red-100"
          >
            Tutup
          </button>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-[25%,auto,auto,min-content,auto] items-center whitespace-nowrap gap-x-2 gap-y-2 p-3 overflow-y-scroll">
            {denominations.map((d) => {
              let qty = stack[d.id] || 0;
              if (!qty) {
                return;
              }

              let row = types[d.n];
              if (!row) return;

              row.value = d.n;
              row.id = d.id;
              row.quantity = qty;
              row.isCoin = d.isCoin || false;

              let total = row.value * row.quantity;

              return (
                <Fragment key={d.id}>
                  <div className="flex items-center justify-center">
                    {row.isCoin ? (
                      <img src={row.image} className="w-[50%]" />
                    ) : (
                      <img src={row.image} />
                    )}
                  </div>
                  <div>{row.text}</div>
                  <div>× {row.quantity}</div>
                  <div>=</div>
                  <div className="font-bold">
                    {formatCurrency(total, row.isCoin)}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center p-2 border-t border-slate-300 bg-slate-100">
          Jumlah:{" "}
          <span className="font-bold">RM {formatCurrency(total, true)}</span>
        </div>
      </div>
    </div>
  );
}
