export default function Pill({ type, unit = 1 }) {
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
    <div className={`flex items-center gap-0 ${pillType.color} text-sm`}>
      (<span>{pillType.text}</span>
      <span className={`${pillType.subColor} rounded-full`}>×{unit}</span>)
    </div>
  );
}
