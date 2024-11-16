interface ProgressProps {
  currentIndex: number;
  shutingsLength: number;
};

export default function Progress({ currentIndex, shutingsLength }: ProgressProps) {
  return(
    <div className="mb-4">
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{
            width: `${((currentIndex) / shutingsLength) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
