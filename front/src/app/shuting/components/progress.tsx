interface ProgressProps {
  currentIndex: number;
  shutingsDataLength: number;
};

export default function Progress({ currentIndex, shutingsDataLength }: ProgressProps) {
  return(
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{
            width: `${((currentIndex) / shutingsDataLength) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
