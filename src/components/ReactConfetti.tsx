"use client";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

const ReactConfetti = () => {
  const { width, height } = useWindowSize();
  return (
    <Confetti
      className="pointer-events-none z-[100]"
      numberOfPieces={2000}
      recycle={false}
      width={width - 20}
      height={height}
    ></Confetti>
  );
};
export default ReactConfetti;
