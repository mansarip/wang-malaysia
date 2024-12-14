import { useEffect, useRef, useState } from "react";
import undoSound from "./assets/undo.mp3";
import keypressSound from "./assets/keypress.mp3";
import swishSound from "./assets/swish.mp3";
import shuffleSound from "./assets/shuffle.mp3";
import iconWriting from "./assets/writing.png";
import mejaImage from "./assets/meja.png";
import myr1 from "./assets/myr1_small.png";
import myr5 from "./assets/myr5_small.png";
import myr10 from "./assets/myr10_small.png";
import myr20 from "./assets/myr20_small.png";
import myr50 from "./assets/myr50_small.png";
import myr100 from "./assets/myr100_small.png";
import iconShuffle from "./assets/dice.png";
import jahitPattern from "./assets/jahit.png";
import iconClear from "./assets/clean.png";

function Pill({ type, unit = 1 }) {
  const types = {
    1: { text: "RM1", color: "text-sky-800", subColor: "text-sky-700" },
    5: { text: "RM5", color: "text-green-800", subColor: "text-green-700" },
    10: { text: "RM10", color: "text-red-800", subColor: "text-red-700" },
    20: { text: "RM20", color: "text-yellow-800", subColor: "text-yellow-700" },
    50: { text: "RM50", color: "text-teal-800", subColor: "text-teal-700" },
    100: {
      text: "RM100",
      color: "text-purple-800",
      subColor: "text-purple-700",
    },
  };

  const pillType = types[type];

  if (!pillType) return null;
  if (!unit) return null;

  return (
    <div className={`flex items-center gap-0 ${pillType.color}`}>
      (<span>{pillType.text}</span>
      <span className={`${pillType.subColor} rounded-full`}>×{unit}</span>)
    </div>
  );
}

function ButtonAdd({ type, onClick }) {
  const types = {
    1: {
      text: "RM1",
      bgColor: "bg-sky-800",
      borderColor: "border-sky-900",
      image: myr1,
    },
    5: {
      text: "RM5",
      bgColor: "bg-green-800",
      borderColor: "border-green-900",
      image: myr5,
    },
    10: {
      text: "RM10",
      bgColor: "bg-red-800",
      borderColor: "border-red-900",
      image: myr10,
    },
    20: {
      text: "RM20",
      bgColor: "bg-yellow-800",
      borderColor: "border-yellow-900",
      image: myr20,
    },
    50: {
      text: "RM50",
      bgColor: "bg-teal-800",
      borderColor: "border-teal-900",
      image: myr50,
    },
    100: {
      text: "RM100",
      bgColor: "bg-purple-800",
      borderColor: "border-purple-900",
      image: myr100,
    },
  };

  const buttonType = types[type];

  if (!buttonType) return null;

  return (
    <div
      className="min-w-[100px] h-[90px] flex flex-col items-center justify-center p-2 button-duit transform scale-100 transition-transform duration-[50ms] ease-in-out active:scale-95"
      onClick={onClick}
    >
      <img
        src={buttonType.image}
        className={`shadow-lg border-2 ${buttonType.borderColor}`}
      />
      <div
        className={`${buttonType.bgColor} ${buttonType.borderColor} border-2 text-white text-md delius-unicase-bold px-2 py-1 rounded-b-lg border-t-0`}
      >
        RM {type}
      </div>
    </div>
  );
}

function extractDenominationsWithId(obj) {
  return Object.keys(obj).map((key) => ({
    id: key,
    n: parseInt(key.replace("myr", ""), 10),
  }));
}

export default function App() {
  const undoSoundRef = useRef(null);
  const pressSoundRef = useRef(null);
  const swishSoundRef = useRef(null);
  const shuffleSoundRef = useRef(null);

  const [showModalAmount, setShowModalAmount] = useState(false);
  const [total, setTotal] = useState(0);
  const [stack, setStack] = useState({
    myr1: 0,
    myr5: 0,
    myr10: 0,
    myr20: 0,
    myr50: 0,
    myr100: 0,
  });

  const playSwishSound = () => {
    if (swishSoundRef.current) {
      swishSoundRef.current.currentTime = 0;
      swishSoundRef.current.play();
    }
  };

  const playButtonSound = () => {
    if (pressSoundRef.current) {
      pressSoundRef.current.currentTime = 0;
      pressSoundRef.current.play();
    }
  };

  const playShuffleSound = () => {
    if (shuffleSoundRef.current) {
      shuffleSoundRef.current.currentTime = 0;
      shuffleSoundRef.current.play();
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("ms-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const clearDesk = () => {
    playSwishSound();
    setStack({
      myr1: 0,
      myr5: 0,
      myr10: 0,
      myr20: 0,
      myr50: 0,
      myr100: 0,
    });
  };

  const tambah = (key) => {
    playButtonSound();
    setStack({
      ...stack,
      [key]: stack[key] + 1,
    });
  };

  const tolak = (key) => {
    playSwishSound();
    setStack({
      ...stack,
      [key]: stack[key] - 1,
    });
  };

  const shuffle = () => {
    if (total <= 0) return;

    playShuffleSound();
    let newStack = randomizeBreakdown(total);

    // prevent infinite loop (kalau lebih rm5 baru cek) <-- benda ni kita remove bila implement duit syiling
    if (total >= 5) {
      let str1 = JSON.stringify(newStack);
      let str2 = JSON.stringify(stack);

      // jaminan supaya hasil shuffle tak sama dengan yang sebelumnya
      while (str1 === str2) {
        newStack = randomizeBreakdown(total);
        str1 = JSON.stringify(newStack);
      }
    }

    setStack(newStack);
  };

  const paparAmaun = (e) => {
    e.preventDefault();
    let value = Number(e.target.amount.value);
    let stack = randomizeBreakdown(value);
    setStack(stack);
    setShowModalAmount(false);
  };

  useEffect(() => {
    setTotal(calculate(stack));
  }, [stack]);

  const denominations = extractDenominationsWithId(stack);

  return (
    <div className="flex items-center justify-center md:mt-10">
      <div
        className="h-svh flex flex-col md:w-[400px] md:h-[750px] overflow-hidden md:rounded-xl relative"
        style={{ background: "#d6c8af" }}
      >
        {showModalAmount && (
          <div
            className="absolute z-20 top-0 left-0 right-0 bottom-0 flex pt-20 justify-center bg-black bg-opacity-10"
            onClick={() => setShowModalAmount(false)}
          >
            <div
              className="bg-white w-[80%] h-[40%] rounded-xl border-4 border-gray-800 shadow-xl delius-unicase-bold flex flex-col items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="text-lg">MASUKKAN AMAUN (RM)</div>
              <div className="text-sm text-gray-500">Enter amount</div>
              <form className="mt-3 px-10" onSubmit={paparAmaun}>
                <input
                  type="number"
                  min={0}
                  className="outline-none text-center p-1 border-b-2 border-black w-full text-lg"
                  placeholder="Contoh: 91"
                  autoFocus
                  name="amount"
                />
                <button
                  type="submit"
                  className="mt-1 bg-red-700 text-white w-full p-1"
                >
                  Papar
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <button
            className="absolute top-2 right-2 w-[40px]"
            onClick={() => setShowModalAmount(true)}
          >
            <img src={iconWriting} />
          </button>

          <div className="flex-1 delius-unicase-bold text-4xl text-center flex justify-center items-center flex-col">
            <div className="text-xs flex flex-wrap mb-2 gap-2 pt-6 px-14 items-center justify-center">
              {denominations.map((d) => (
                <Pill key={d.id} type={d.n} unit={stack[d.id]} />
              ))}
            </div>
            <span className="select-none tracking-tight">
              RM {formatAmount(total)}
            </span>
          </div>
          <div className="topside flex flex-col flex-1 items-center justify-end relative">
            <div className="w-[45%] h-[54%] absolute transform skew-y-[-22deg] skew-x-[-2deg] rotate-[54deg] top-[11%]">
              {Array.from({ length: stack.myr1 }, (_, index) => (
                <div
                  onClick={() => tolak("myr1")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[45%] h-[18%] bg-contain border border-[#3d60ca]"
                  style={{
                    backgroundImage: `url(${myr1})`,
                    top: `${3 - index * 2.7}%`,
                    left: `${2 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr5 }, (_, index) => (
                <div
                  onClick={() => tolak("myr5")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[47%] h-[19%] bg-contain border border-[#57791d]"
                  style={{
                    backgroundImage: `url(${myr5})`,
                    top: `${3 - index * 2.7}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr10 }, (_, index) => (
                <div
                  onClick={() => tolak("myr10")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[49%] h-[19%] bg-contain border border-[#791d1d]"
                  style={{
                    backgroundImage: `url(${myr10})`,
                    top: `${30 - index * 2.7}%`,
                    left: `${-1 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr20 }, (_, index) => (
                <div
                  onClick={() => tolak("myr20")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[49%] h-[19%] bg-contain border border-[#bc8f1e]"
                  style={{
                    backgroundImage: `url(${myr20})`,
                    top: `${30 - index * 2.7}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr50 }, (_, index) => (
                <div
                  onClick={() => tolak("myr50")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[51.5%] h-[20%] bg-contain border border-[#1e9fbc]"
                  style={{
                    backgroundImage: `url(${myr50})`,
                    top: `${55 - index * 2.7}%`,
                    left: `${-4 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr100 }, (_, index) => (
                <div
                  onClick={() => tolak("myr100")}
                  key={index}
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[53%] h-[20%] bg-contain border border-[#701ebc]"
                  style={{
                    backgroundImage: `url(${myr100})`,
                    top: `${55 - index * 2.7}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}
            </div>

            <img
              src={mejaImage}
              className="object-cover select-none"
              draggable={false}
            />

            <div
              className={`h-[25px] w-full bg-contain`}
              style={{ backgroundImage: `url(${jahitPattern})` }}
            ></div>

            {total > 0 && (
              <button
                onClick={shuffle}
                className="bg-cover h-[13%] w-[13%] absolute z-[10] border-none cursor-pointer transform scale-[1] active:scale-[1.2] active:rotate-[270deg] transition-transform duration-[200ms] ease-in-out bottom-[50px] left-[25px]"
              >
                <img src={iconShuffle} />
              </button>
            )}

            <button
              onClick={clearDesk}
              className="bg-cover h-[13%] w-[13%] absolute z-[10] border-none cursor-pointer transform scale-[1] active:right-[20px] transition-transform duration-[200ms] ease-in-out bottom-[50px] right-[25px]"
            >
              <img src={iconClear} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-scroll p-3 pb-6 bg-[#8c573c]">
            {denominations.map((item) => (
              <ButtonAdd
                key={item.n}
                type={item.n}
                onClick={() => tambah(item.id)}
              />
            ))}
          </div>
        </div>

        <audio ref={undoSoundRef} src={undoSound} />
        <audio ref={pressSoundRef} src={keypressSound} />
        <audio ref={shuffleSoundRef} src={shuffleSound} />
        <audio ref={swishSoundRef} src={swishSound} />
      </div>
    </div>
  );
}

function calculate(stack) {
  const denominations = {
    myr1: 1,
    myr5: 5,
    myr10: 10,
    myr20: 20,
    myr50: 50,
    myr100: 100,
  };

  let amt = Object.keys(stack).reduce((total, key) => {
    const value = stack[key] || 0;
    return total + denominations[key] * value;
  }, 0);

  return amt;
}

function randomizeBreakdown(amount) {
  const denominations = [
    { key: "myr100", value: 100 },
    { key: "myr50", value: 50 },
    { key: "myr20", value: 20 },
    { key: "myr10", value: 10 },
    { key: "myr5", value: 5 },
    { key: "myr1", value: 1 },
  ];

  const result = {
    myr1: 0,
    myr5: 0,
    myr10: 0,
    myr20: 0,
    myr50: 0,
    myr100: 0,
  };

  // Pastikan loop berterusan selagi amount belum habis
  while (amount > 0) {
    const validDenominations = denominations.filter((d) => d.value <= amount); // Pilih denominasi yang masih boleh digunakan
    const randomIndex = Math.floor(Math.random() * validDenominations.length); // Pilih satu secara rawak
    const denomination = validDenominations[randomIndex];

    result[denomination.key]++;
    amount -= denomination.value; // Kurangkan jumlah dengan nilai denominasi
  }

  return result;
}
