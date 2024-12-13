import { useEffect, useRef, useState } from "react";
import undoSound from "./assets/undo.mp3";
import keypressSound from "./assets/keypress.mp3";
import swishSound from "./assets/swish.mp3";

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
    },
    5: {
      text: "RM5",
      bgColor: "bg-green-800",
      borderColor: "border-green-900",
    },
    10: {
      text: "RM10",
      bgColor: "bg-red-800",
      borderColor: "border-red-900",
    },
    20: {
      text: "RM20",
      bgColor: "bg-yellow-800",
      borderColor: "border-yellow-900",
    },
    50: {
      text: "RM50",
      bgColor: "bg-teal-800",
      borderColor: "border-teal-900",
    },
    100: {
      text: "RM100",
      bgColor: "bg-purple-800",
      borderColor: "border-purple-900",
    },
  };

  const buttonType = types[type];

  if (!buttonType) return null;

  return (
    <div
      className="min-w-[100px] h-[90px] flex flex-col items-center justify-center p-2 button-duit"
      onClick={onClick}
    >
      <img
        src={`myr${type}_small.png`}
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

  const [showModalAmount, setShowModalAmount] = useState(false);
  const [total, setTotal] = useState(0);
  const [historyStack, setHistoryStack] = useState([]);
  const [stack, setStack] = useState({
    myr1: 0,
    myr5: 0,
    myr10: 0,
    myr20: 0,
    myr50: 0,
    myr100: 0,
  });

  const playUndoSound = () => {
    if (undoSoundRef.current) {
      undoSoundRef.current.currentTime = 0; // Reset the audio to the start
      undoSoundRef.current.play(); // Play the audio
    }
  };

  const playSwishSound = () => {
    if (swishSoundRef.current) {
      swishSoundRef.current.currentTime = 0; // Reset the audio to the start
      swishSoundRef.current.play(); // Play the audio
    }
  };

  const playButtonSound = () => {
    if (pressSoundRef.current) {
      pressSoundRef.current.currentTime = 0; // Reset the audio to the start
      pressSoundRef.current.play(); // Play the audio
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
    setHistoryStack([]);
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

  const undo = () => {
    playUndoSound();
    if (historyStack.length > 0) {
      const prevHistory = [...historyStack];
      const lastState = prevHistory.pop();
      setHistoryStack(prevHistory);
      setStack(lastState);
    }
  };

  const shuffle = () => {
    if (total <= 0) return;
    let stack = randomizeBreakdown(total);
    setStack(stack);
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
    setHistoryStack((prevHistory) => [...prevHistory, stack]);
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
            <img src="writing.png" />
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
            <div className="plane">
              {Array.from({ length: stack.myr1 }, (_, index) => (
                <div
                  onClick={() => tolak("myr1")}
                  key={index}
                  className="rm rm1"
                  style={{
                    top: `${3 - index * 3}%`,
                    left: `${2 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr5 }, (_, index) => (
                <div
                  onClick={() => tolak("myr5")}
                  key={index}
                  className="rm rm5"
                  style={{
                    top: `${3 - index * 3}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr10 }, (_, index) => (
                <div
                  onClick={() => tolak("myr10")}
                  key={index}
                  className="rm rm10"
                  style={{
                    top: `${30 - index * 3}%`,
                    left: `${-1 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr20 }, (_, index) => (
                <div
                  onClick={() => tolak("myr20")}
                  key={index}
                  className="rm rm20"
                  style={{
                    top: `${30 - index * 3}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr50 }, (_, index) => (
                <div
                  onClick={() => tolak("myr50")}
                  key={index}
                  className="rm rm50"
                  style={{
                    top: `${55 - index * 3}%`,
                    left: `${-4 - index * 3}%`,
                  }}
                />
              ))}

              {Array.from({ length: stack.myr100 }, (_, index) => (
                <div
                  onClick={() => tolak("myr100")}
                  key={index}
                  className="rm rm100"
                  style={{
                    top: `${55 - index * 3}%`,
                    left: `${51 - index * 3}%`,
                  }}
                />
              ))}
            </div>

            <img
              src="meja.png"
              className="object-cover select-none"
              draggable={false}
            />

            <div className="jahit"></div>

            <button
              onClick={shuffle}
              className="action random outline-none transform transition-transform duration-200 active:scale-120"
            ></button>

            <button
              onClick={clearDesk}
              className="action clear outline-none transform transition-transform duration-200 active:scale-120"
            ></button>
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
