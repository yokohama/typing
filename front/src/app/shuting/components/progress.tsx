type ProgressProps = {
  currentIndex: number;
  shutingWordsLength: number;
  isFinish: boolean;
};

export default function Progress({
  currentIndex,
  shutingWordsLength,
  isFinish,
}: ProgressProps) {
  return(
    <div className="
      w-full
      mt-2 mb-6
      h-8
      bg-gray-200 
      rounded-full
      relative
    ">
      <div 
        style={{
          width: `${((currentIndex+1) / shutingWordsLength) * 100}%`,
        }}
        className="
          absolute top-0 left-0 h-full
          rounded-full
          bg-gradient-to-r from-green-300 via-green-400 to-green-300
          bg-[length:20px_20px]
          animate-stripes
        "
      />
      <div 
        style={{
          width: isFinish
            ? '100%'
            : `${((currentIndex) / shutingWordsLength) * 100}%`
        }}
        className="
          absolute top-0 left-0 h-full
          bg-green-400
          rounded-full
          z-10
        "
      />
    </div>
  );
}
