import { ACTIONS } from "./App";

export default function DigitButton({ digit, dispatch }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.ENTER_DIGIT, payload: { digit } })
      }
    >
      {digit}
    </button>
  );
}
