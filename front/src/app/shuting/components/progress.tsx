type ProgressProps = {
  currentIndex: number;
  shutingWordsLength: number;
};

export default function Progress({ currentIndex, shutingWordsLength }: ProgressProps) {
  return(
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{
            width: `${((currentIndex+1) / shutingWordsLength) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
