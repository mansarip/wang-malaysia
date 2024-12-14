export default function ModalAbout({ close }) {
  return (
    <div
      className="absolute z-20 top-0 left-0 right-0 bottom-0 flex pt-20 justify-center bg-black bg-opacity-10"
      onClick={close}
    >
      <div
        className="bg-white w-[80%] h-[30%] rounded-xl border-4 border-gray-800 shadow-xl flex flex-col items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="text-xs text-slate-600">Dicipta & disusun oleh</div>
        <div className="text-sm">Luqman B. Shariffudin</div>
        <div className="text-center text-sm mt-5">
          <a href="https://github.com/mansarip/wang-malaysia" target="_blank" className="text-red-900">
            Source code (Github)
          </a>
        </div>
      </div>
    </div>
  );
}
