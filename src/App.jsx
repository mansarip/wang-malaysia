import { useEffect, useRef, useState } from "react";
import ButtonAdd from "./ButtoAdd";
import {
  calculate,
  denominations,
  formatCurrency,
  randomizeBreakdown,
} from "./utils";
import ModalAmount from "./ModalAmount";
import ModalAbout from "./ModalAbout";
import ModalSummary from "./ModalSummary";
import MoneyStack from "./MoneyStack";

import undoSound from "./assets/undo.mp3";
import keypressSound from "./assets/keypress.mp3";
import swishSound from "./assets/swish.mp3";
import shuffleSound from "./assets/shuffle.mp3";
import coinSound from "./assets/coin.mp3";
import iconWriting from "./assets/writing.png";
import mejaImage from "./assets/meja.png";
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
import iconShuffle from "./assets/dice.png";
import jahitPattern from "./assets/jahit.png";
import iconClear from "./assets/clean.png";

const LS_KEY_STORE = "stack";

function defaultStack() {
  return {
    myr1: 0,
    myr5: 0,
    myr10: 0,
    myr20: 0,
    myr50: 0,
    myr100: 0,
    sen50: 0,
    sen20: 0,
    sen10: 0,
    sen5: 0,
  };
}

function loadStack() {
  const saved = localStorage.getItem(LS_KEY_STORE);
  try {
    if (!saved) {
      return defaultStack();
    }

    return JSON.parse(saved);
  } catch (err) {
    console.error(err?.message);
    return defaultStack();
  }
}

export default function App() {
  const undoSoundRef = useRef(null);
  const pressSoundRef = useRef(null);
  const swishSoundRef = useRef(null);
  const shuffleSoundRef = useRef(null);
  const coinSoundRef = useRef(null);

  const [showModalAmount, setShowModalAmount] = useState(false);
  const [showModalAbout, setShowModalAbout] = useState(false);
  const [showModalSummary, setShowModalSummary] = useState(false);
  const [total, setTotal] = useState(0);
  const [stack, setStack] = useState(loadStack());

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

  const playCoinSound = () => {
    if (coinSoundRef.current) {
      coinSoundRef.current.currentTime = 0;
      coinSoundRef.current.play();
    }
  };

  const clearDesk = () => {
    playSwishSound();
    setStack(defaultStack());
  };

  const tambah = (key, isCoin = false) => {
    if (isCoin) {
      playCoinSound();
    } else {
      playButtonSound();
    }

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
    playButtonSound();
    setShowModalAmount(false);
  };

  const openModalSummary = () => {
    setShowModalSummary(true);
    playShuffleSound();
  };

  const closeModalSummary = () => {
    setShowModalSummary(false);
    playSwishSound();
  };

  useEffect(() => {
    setTotal(calculate(stack));
    localStorage.setItem(LS_KEY_STORE, JSON.stringify(stack));
  }, [stack]);

  return (
    <div className="flex md:flex-col items-center justify-center md:h-dvh md:bg-gradient-to-b md:from-[#d6c8af] md:to-[#f7e9d0]">
      <div
        className="h-svh flex flex-col md:w-[400px] md:h-[750px] overflow-hidden md:rounded-xl md:border md:border-[#574d3b] md:shadow-2xl relative"
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

        {showModalSummary && (
          <ModalSummary
            close={closeModalSummary}
            stack={stack}
            denominations={denominations}
            total={total}
          />
        )}

        <div className="flex flex-col flex-1 overflow-hidden">
          <button
            className="absolute top-3 left-3 z-20"
            onClick={() => setShowModalAbout(true)}
          >
            ℹ️
          </button>

          <button
            className="absolute top-3 right-3 w-[40px] z-20"
            onClick={() => setShowModalAmount(true)}
          >
            <img src={iconWriting} />
          </button>

          <div className="flex-1 delius-unicase-bold text-4xl text-center flex justify-center items-center flex-col z-10">
            <span className="select-none tracking-tight">
              RM {formatCurrency(total, true)}
            </span>
            {total > 0 && (
              <button
                onClick={openModalSummary}
                className="bg-orange-50 text-xs rounded-full px-2 mt-2 text-amber-900"
              >
                RINGKASAN
              </button>
            )}
          </div>
          <div className="topside flex flex-col flex-1 items-center justify-end relative">
            <div className="w-[45%] h-[54%] absolute transform skew-y-[-22deg] skew-x-[-2deg] rotate-[54deg] top-[11%]">
              <MoneyStack
                type="myr1"
                count={stack.myr1}
                onClick={tolak}
                imageUrl={myr1}
                width="45%"
                height="18%"
                border="1px solid #3d60ca"
                topOffset={3}
                leftOffset={2}
              />
              <MoneyStack
                type="myr5"
                count={stack.myr5}
                onClick={tolak}
                imageUrl={myr5}
                width="47%"
                height="19%"
                border="1px solid #57791d"
                topOffset={3}
                leftOffset={51}
              />
              <MoneyStack
                type="myr10"
                count={stack.myr10}
                onClick={tolak}
                imageUrl={myr10}
                width="49%"
                height="19%"
                border="1px solid #791d1d"
                topOffset={30}
                leftOffset={-1}
              />
              <MoneyStack
                type="myr20"
                count={stack.myr20}
                onClick={tolak}
                imageUrl={myr20}
                width="49%"
                height="19%"
                border="1px solid #bc8f1e"
                topOffset={30}
                leftOffset={51}
              />
              <MoneyStack
                type="myr50"
                count={stack.myr50}
                onClick={tolak}
                imageUrl={myr50}
                width="51.5%"
                height="20%"
                border="1px solid #1e9fbc"
                topOffset={55}
                leftOffset={-4}
              />
              <MoneyStack
                type="myr100"
                count={stack.myr100}
                onClick={tolak}
                imageUrl={myr100}
                width="53%"
                height="20%"
                border="1px solid #701ebc"
                topOffset={55}
                leftOffset={51}
              />
              <MoneyStack
                type="sen50"
                count={stack.sen50}
                onClick={tolak}
                imageUrl={sen50}
                width="14%"
                height="11%"
                border="1px solid #ca8a04"
                topOffset={82}
                leftOffset={10}
                isRounded
                isCoin
              />
              <MoneyStack
                type="sen20"
                count={stack.sen20}
                onClick={tolak}
                imageUrl={sen20}
                width="13%"
                height="10%"
                border="1px solid #ca8a04"
                topOffset={82}
                leftOffset={33}
                isRounded
                isCoin
              />
              <MoneyStack
                type="sen10"
                count={stack.sen10}
                onClick={tolak}
                imageUrl={sen10}
                width="12%"
                height="9%"
                border="1px solid #64748b"
                topOffset={82}
                leftOffset={56}
                isRounded
                isCoin
              />
              <MoneyStack
                type="sen5"
                count={stack.sen5}
                onClick={tolak}
                imageUrl={sen5}
                width="10%"
                height="8%"
                border="1px solid #64748b"
                topOffset={82}
                leftOffset={80}
                isRounded
                isCoin
              />
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
              <>
                <button
                  onClick={shuffle}
                  className="h-[13%] w-[13%] absolute z-[10] border-none cursor-pointer transform scale-[1] active:scale-[1.2] active:rotate-[270deg] transition-transform duration-[200ms] ease-in-out bottom-[50px] left-[25px]"
                >
                  <img src={iconShuffle} />
                </button>
              </>
            )}

            <button
              onClick={clearDesk}
              className="h-[13%] w-[13%] absolute z-[10] border-none cursor-pointer transform scale-[1] active:right-[20px] transition-transform duration-[200ms] ease-in-out bottom-[50px] right-[25px]"
            >
              <img src={iconClear} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-scroll p-3 pb-6 bg-[#8c573c] md:scrollbar md:scrollbar-thumb-[#d6c8af] md:scrollbar-track-[#74452e]">
            {denominations.map((item) => (
              <ButtonAdd
                key={item.n}
                type={item.n}
                onClick={() => tambah(item.id, item.isCoin)}
              />
            ))}
          </div>
        </div>

        <audio ref={undoSoundRef} src={undoSound} />
        <audio ref={pressSoundRef} src={keypressSound} />
        <audio ref={shuffleSoundRef} src={shuffleSound} />
        <audio ref={swishSoundRef} src={swishSound} />
        <audio ref={coinSoundRef} src={coinSound} />
      </div>

      <div className="hidden md:block mt-10 scale-[0.9] opacity-80 max-w-[700px]">
        <div className="guide flex gap-3 items-center">
          <div className="flex items-center justify-center gap-2 bg-white bg-opacity-20 p-2 rounded-lg">
            <img src={iconShuffle} className="w-[30px]" />
            <span className="text-xs text-amber-950">Rombak visual</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white bg-opacity-20 p-2 rounded-lg">
            <img src={iconClear} className="w-[30px]" />
            <span className="text-xs text-amber-950">Padam semula</span>
          </div>

          <div className="flex items-center justify-center gap-2 bg-white bg-opacity-20 p-2 rounded-lg">
            <img src={iconWriting} className="w-[30px]" />
            <span className="text-xs text-amber-950">Amaun sendiri</span>
          </div>
        </div>
        <div className="text-center text-xs mt-3 opacity-80">
          Oleh Man Sarip - Telegram:
          <a
            href="https://t.me/mansarip"
            target="_blank"
            className="text-red-900"
          >
            @mansarip
          </a>{" "}
          -{" "}
          <a
            href="https://github.com/mansarip/wang-malaysia"
            target="_blank"
            className="text-red-900"
          >
            Github
          </a>
        </div>
      </div>
    </div>
  );
}
