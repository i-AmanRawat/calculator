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
      if (state.overWrite) {
        return {
          ...state,
          currOperand: payload.digit,
          overWrite: false,
        };
      }

      if (payload.digit === "." && state.currOperand.includes(".")) {
        return state;
      }

      if (payload.digit === "0" && state.currOperand === "0") {
        return { ...state };
      }

      return {
        ...state,
        currOperand: `${state.currOperand || ""}${payload.digit}`,
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
        overWrite: true,
        currOperand: evaluate(state),
        operator: null,
        prevOperand: null,
      };
    }

    case ACTIONS.DELETE_DIGIT: {
      if (state.overWrite) {
        return {
          overWrite: false,
          currOperand: null,
        };
      }
      if (state.currOperand == null) return;
      if (state.currOperand.length === 1) {
        return {
          ...state,
          currOperand: null,
        };
      }
      return {
        ...state,
        currOperand: state.currOperand.slice(0, -1),
      };
    }
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

const INTEGER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
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
          {formatOperand(prevOperand)} {operator}
        </div>
        <div className="current-operand">{formatOperand(currOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
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
