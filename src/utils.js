export function extractDenominationsWithId(obj) {
  return Object.keys(obj).map((key) => ({
    id: key,
    n: parseInt(key.replace("myr", ""), 10),
  }));
}

export function calculate(stack) {
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

export function randomizeBreakdown(amount) {
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

  // pastikan loop berterusan selagi amount belum habis
  while (amount > 0) {
    const validDenominations = denominations.filter((d) => d.value <= amount); // pilih denominasi yang masih boleh digunakan
    const randomIndex = Math.floor(Math.random() * validDenominations.length); // pilih satu secara rawak
    const denomination = validDenominations[randomIndex];

    result[denomination.key]++;
    amount -= denomination.value; // kurangkan jumlah dengan nilai denominasi
  }

  return result;
}
