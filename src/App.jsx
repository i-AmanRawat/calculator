import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ENTER_DIGIT: "enter-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ENTER_DIGIT: {
      if (payload.digit === "." && state.currOperand.includes(".")) {
        return state;
      }

      if (payload.digit === "0" && state.currOperand === "0") {
        return { ...state };
      }

      return {
        ...state,
        currOperand: `${state.currOperand || ""} ${payload.digit}`,
      };
    }

    case ACTIONS.CHOOSE_OPERATION: {
      if (state.prevOperand == null && state.currOperand == null) {
        return state;
      }
      if (state.currOperand == null) {
        return {
          ...state,
          operator: payload.operation,
        };
      }
      if (state.prevOperand == null) {
        return {
          ...state,
          prevOperand: state.currOperand,
          operator: payload.operation,
          currOperand: null,
        };
      }
      return {
        ...state,
        currOperand: evaluate(state),
        operator: payload.operation,
        prevOperand: null,
      };
    }

    case ACTIONS.CLEAR: {
      return {};
    }

    case ACTIONS.EVALUATE: {
      if (
        state.operator == null ||
        state.prevOperand == null ||
        state.currOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        currOperand: evaluate(state),
        operator: null,
        prevOperand: null,
      };
    }
    // case ACTIONS.CHOOSE_OPERATION:
    //   return { state };

    // case ACTIONS.DELETE_DIGIT:
    //   return { state };
  }
}

function evaluate({ prevOperand, operator, currOperand }) {
  const prev = parseFloat(prevOperand);
  const curr = parseFloat(currOperand);

  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operator) {
    case "➗": {
      computation = prev / curr;
      break;
    }
    case "✖️": {
      computation = prev * curr;
      break;
    }
    case "➕": {
      computation = prev + curr;
      break;
    }
    case "➖": {
      computation = prev - curr;
      break;
    }
  }
  return computation.toString();
}

export default function App() {
  const [{ prevOperand, operator, currOperand }, dispatch] = useReducer(
    reducer,
    {}
  );

  // dispatch({ type: "ENTER_DIGIT", payload: { digit: 1 } });
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {prevOperand} {operator}
        </div>
        <div className="current-operand">{currOperand}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button>DEL</button>
      <OperationButton operation="➗" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="✖️" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="➕" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="➖" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
