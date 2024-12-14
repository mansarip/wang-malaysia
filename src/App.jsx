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
import Pill from "./Pill";
import ButtonAdd from "./ButtoAdd";
import {
  calculate,
  extractDenominationsWithId,
  randomizeBreakdown,
} from "./utils";
import ModalAmount from "./ModalAmount";
import ModalAbout from "./ModalAbout";

export default function App() {
  const undoSoundRef = useRef(null);
  const pressSoundRef = useRef(null);
  const swishSoundRef = useRef(null);
  const shuffleSoundRef = useRef(null);

  const [showModalAmount, setShowModalAmount] = useState(false);
  const [showModalAbout, setShowModalAbout] = useState(false);
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

  const paparAmaun = (value) => {
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
          <ModalAmount
            close={() => setShowModalAmount(false)}
            submit={paparAmaun}
          />
        )}

        {showModalAbout && (
          <ModalAbout close={() => setShowModalAbout(false)} />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <button
            className="absolute top-3 left-3 opacity-20"
            onClick={() => setShowModalAbout(true)}
          >
            ℹ️
          </button>

          <button
            className="absolute top-3 right-3 w-[40px]"
            onClick={() => setShowModalAmount(true)}
          >
            <img src={iconWriting} />
          </button>

          <div className="flex-1 delius-unicase-bold text-4xl text-center flex justify-center items-center flex-col">
            <div className="flex flex-wrap mb-2 gap-2 pt-6 px-14 items-center justify-center">
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[45%] h-[18%] bg-contain border border-[#3d60ca] paper-drop"
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[47%] h-[19%] bg-contain border border-[#57791d] paper-drop"
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[49%] h-[19%] bg-contain border border-[#791d1d] paper-drop"
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[49%] h-[19%] bg-contain border border-[#bc8f1e] paper-drop"
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[51.5%] h-[20%] bg-contain border border-[#1e9fbc] paper-drop"
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
                  className="shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat w-[53%] h-[20%] bg-contain border border-[#701ebc] paper-drop"
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
