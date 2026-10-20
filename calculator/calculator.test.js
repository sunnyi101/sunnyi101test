const test = require("node:test");
const assert = require("node:assert");
const { createCalculator } = require("./calculator.js");

function run(keys) {
  const calc = createCalculator();
  keys.split(" ").forEach((k) => calc.press(k));
  return calc.display;
}

test("basic operations", () => {
  assert.strictEqual(run("2 + 3 ="), "5");
  assert.strictEqual(run("9 - 4 ="), "5");
  assert.strictEqual(run("6 * 7 ="), "42");
  assert.strictEqual(run("8 / 2 ="), "4");
});

test("chained operations evaluate left to right", () => {
  assert.strictEqual(run("2 + 3 * 4 ="), "20");
});

test("decimals avoid float noise", () => {
  assert.strictEqual(run(". 1 + . 2 ="), "0.3");
});

test("divide by zero shows Error and recovers", () => {
  assert.strictEqual(run("5 / 0 ="), "Error");
  assert.strictEqual(run("5 / 0 = 3"), "3");
});

test("clear, backspace, sign, percent", () => {
  assert.strictEqual(run("1 2 3 C"), "0");
  assert.strictEqual(run("1 2 3 Backspace"), "12");
  assert.strictEqual(run("5 ±"), "-5");
  assert.strictEqual(run("5 0 %"), "0.5");
});
