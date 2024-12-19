export default function MoneyStack({
  type,
  count,
  onClick,
  imageUrl,
  width,
  height,
  border,
  topOffset,
  leftOffset,
  isRounded,
  isCoin = false,
}) {
  return Array.from({ length: count }, (_, index) => {
    let animation = isCoin ? "coin-drop" : "paper-drop";
    let radius = isRounded ? "rounded-full" : "";

    return (
      <div
        key={index}
        onClick={() => onClick(type)}
        className={`shadow-[2px_2px_3px_#1e1e1e] absolute bg-no-repeat bg-contain ${animation} ${radius}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          width,
          height,
          border,
          top: `${topOffset - index * 2.2}%`,
          left: `${leftOffset - index * 2.5}%`,
        }}
      />
    );
  });
}
