interface StartButtonProps {
  handleStart: () => void;
};

export default function StartButton({ handleStart }: StartButtonProps) {
  return(
    <button onClick={handleStart}>
      START
    </button>
  );
}
