(function (root) {
  function createCalculator() {
    let display = "0";
    let stored = null;
    let operator = null;
    let waitingForOperand = false;

    function format(n) {
      if (!Number.isFinite(n)) return "Error";
      return String(parseFloat(n.toPrecision(12)));
    }

    function compute(a, b, op) {
      switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? NaN : a / b;
      }
      return b;
    }

    function inputDigit(d) {
      if (display === "Error") clear();
      if (waitingForOperand) {
        display = d;
        waitingForOperand = false;
      } else {
        display = display === "0" ? d : display + d;
      }
    }

    function inputDecimal() {
      if (display === "Error") clear();
      if (waitingForOperand) {
        display = "0.";
        waitingForOperand = false;
      } else if (!display.includes(".")) {
        display += ".";
      }
    }

    function setOperator(op) {
      if (display === "Error") return;
      const value = parseFloat(display);
      if (operator && !waitingForOperand) {
        display = format(compute(stored, value, operator));
        stored = parseFloat(display);
      } else {
        stored = value;
      }
      operator = op;
      waitingForOperand = true;
    }

    function equals() {
      if (!operator || display === "Error") return;
      display = format(compute(stored, parseFloat(display), operator));
      stored = null;
      operator = null;
      waitingForOperand = true;
    }

    function clear() {
      display = "0";
      stored = null;
      operator = null;
      waitingForOperand = false;
    }

    function backspace() {
      if (waitingForOperand || display === "Error") return;
      display = display.length > 1 && !(display.length === 2 && display.startsWith("-"))
        ? display.slice(0, -1)
        : "0";
    }

    function toggleSign() {
      if (display === "0" || display === "Error") return;
      display = display.startsWith("-") ? display.slice(1) : "-" + display;
    }

    function percent() {
      if (display === "Error") return;
      display = format(parseFloat(display) / 100);
    }

    function press(key) {
      if (/^[0-9]$/.test(key)) inputDigit(key);
      else if (key === ".") inputDecimal();
      else if (["+", "-", "*", "/"].includes(key)) setOperator(key);
      else if (key === "=" || key === "Enter") equals();
      else if (key === "C" || key === "Escape") clear();
      else if (key === "Backspace") backspace();
      else if (key === "±") toggleSign();
      else if (key === "%") percent();
      return display;
    }

    return {
      press,
      get display() { return display; },
      get operator() { return operator; },
    };
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { createCalculator };
  } else {
    root.createCalculator = createCalculator;
  }
})(this);
