export default function ModalAmount({ close, submit }) {
  const preSubmit = (e) => {
    e.preventDefault();
    let n = Number(e.target.amount.value);
    if (isNaN(n)) return;
    if (n > 10000) {
      alert(
        "Kami belum boleh kendali amaun yang besar. Nanti crash. Harap maaf"
      );
      return;
    }
    submit(n);
  };

  return (
    <div
      className="absolute z-40 top-0 left-0 right-0 bottom-0 flex pt-20 justify-center bg-black bg-opacity-10"
      onClick={close}
    >
      <div
        className="bg-white w-[80%] h-[40%] rounded-xl border-4 border-gray-800 shadow-xl delius-unicase-bold flex flex-col items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="text-lg">MASUKKAN AMAUN (RM)</div>
        <div className="text-sm text-gray-500">Enter amount</div>
        <form className="mt-3 px-10" onSubmit={preSubmit}>
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
  );
}
