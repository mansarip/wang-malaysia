export const denominations = [
  {
    id: "myr1",
    n: 1,
  },
  {
    id: "myr5",
    n: 5,
  },
  {
    id: "myr10",
    n: 10,
  },
  {
    id: "myr20",
    n: 20,
  },
  {
    id: "myr50",
    n: 50,
  },
  {
    id: "myr100",
    n: 100,
  },
  {
    id: "sen5",
    n: 0.05,
  },
  {
    id: "sen10",
    n: 0.1,
  },
  {
    id: "sen20",
    n: 0.2,
  },
  {
    id: "sen50",
    n: 0.5,
  },
];

const denominationMap = denominations.reduce((map, item) => {
  map[item.id] = item.n;
  return map;
}, {});

export function calculate(stack) {
  let amt = Object.keys(stack).reduce((total, key) => {
    const value = stack[key] || 0;
    return total + (denominationMap[key] || 0) * value;
  }, 0);

  return amt;
}

export function randomizeBreakdown(amount) {
  const denominations = [
    // duit kertas dahulu
    { key: "myr100", value: 10000 },
    { key: "myr50", value: 5000 },
    { key: "myr20", value: 2000 },
    { key: "myr10", value: 1000 },
    { key: "myr5", value: 500 },
    { key: "myr1", value: 100 },
    // kemudian syiling
    { key: "sen50", value: 50 },
    { key: "sen20", value: 20 },
    { key: "sen10", value: 10 },
    { key: "sen5", value: 5 },
  ];

  const result = {
    sen50: 0,
    sen20: 0,
    sen10: 0,
    sen5: 0,
    myr1: 0,
    myr5: 0,
    myr10: 0,
    myr20: 0,
    myr50: 0,
    myr100: 0,
  };

  // tukar amount ke unit sen
  amount = Math.round(amount * 100);

  // duit kertas dahulu
  let paperDenominations = denominations.filter((d) => d.value >= 100);
  while (amount >= 100) {
    // selagi baki lebih daripada atau sama dengan rm1
    const validDenominations = paperDenominations.filter(
      (d) => d.value <= amount
    );
    const randomIndex = Math.floor(Math.random() * validDenominations.length);
    const denomination = validDenominations[randomIndex];

    result[denomination.key]++;
    amount -= denomination.value;
  }

  // kemudian duit syiling
  let coinDenominations = denominations.filter((d) => d.value < 100);
  while (amount > 0) {
    // untuk baki kurang daripada rm1
    const validDenominations = coinDenominations.filter(
      (d) => d.value <= amount
    );
    const randomIndex = Math.floor(Math.random() * validDenominations.length);
    const denomination = validDenominations[randomIndex];

    result[denomination.key]++;
    amount -= denomination.value;
  }

  return result;
}
