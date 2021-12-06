let calcInput = document.querySelector("#calc-input");

let calcBtns = document.querySelectorAll(".calc-btn");

let calcInputBtns = [];
calcBtns.forEach((calcBtn) => {
  if (calcBtn.classList.length === 1) {
    calcInputBtns.push(calcBtn);
  }
});

const calcUndoBtns = [];
calcBtns.forEach((calcBtn) => {
  if (calcBtn.classList[1] === "undo-key") {
    calcUndoBtns.push(calcBtn);
  }
});

let evaluateBtn;
calcBtns.forEach((calcBtn) => {
  if (calcBtn.classList[1] === "evaluate-key") {
    evaluateBtn = calcBtn;
  }
});

const removeFormatting = (calcInput) => {
  let unformattedCalcInput = "";
  for (let charIndex = 0; charIndex <= calcInput.length; charIndex++) {
    let currChar = calcInput.charAt(charIndex);
    if (currChar !== ",") {
      unformattedCalcInput += currChar;
    }
  }
  return unformattedCalcInput;
};

const removeOperators = (unformattedCalcInput) => {
  let operators = "+-x/";
  let operatorRemovedCalcInput = "";
  for (
    let charIndex = 0;
    charIndex <= unformattedCalcInput.length;
    charIndex++
  ) {
    let currChar = unformattedCalcInput.charAt(charIndex);
    if (operators.indexOf(currChar) < 0) {
      operatorRemovedCalcInput += currChar;
    }
  }
  return operatorRemovedCalcInput;
};

let isAlreadyInPoint = false;
let wasPrevBtnOperator = false;
const getCalcInput = () => {
  calcInputBtns.forEach((calcInputBtn) => {
    calcInputBtn.addEventListener("click", (event) => {
      let numbers = "0123456789";
      if (!isAlreadyInPoint && numbers.indexOf(event.target.innerText) !== -1) {
        let unformattedCalcInput = removeFormatting(calcInput.value);

        let operatorRemovedUnformattedCalcInput =
          removeOperators(unformattedCalcInput);

        if (
          !wasPrevBtnOperator &&
          unformattedCalcInput.length !== 0 &&
          operatorRemovedUnformattedCalcInput.length % 3 === 0
        ) {
          calcInput.value += ",";
        } else wasPrevBtnOperator = false;
      } else {
        wasPrevBtnOperator = true;
        isAlreadyInPoint = false;
      }
      calcInput.value += `${event.target.innerText}`;
      if (event.target.innerText === ".") isAlreadyInPoint = true;
    });
  });
};

getCalcInput();

const undoCalcInput = () => {
  calcUndoBtns.forEach((calcUndoBtn) => {
    calcUndoBtn.addEventListener("click", (event) => {
      let operators = "+-x/";
      switch (event.target.innerText) {
        case "DEL":
          let currCalcInput = calcInput.value;
          if (currCalcInput.charAt(currCalcInput.length - 1) === ".") {
            isAlreadyInPoint = false;
          }
          if (
            operators.indexOf(
              currCalcInput.charAt(currCalcInput.length - 1)
            ) !== -1
          ) {
            wasPrevBtnOperator = false;
          }
          calcInput.value = currCalcInput.substring(
            0,
            currCalcInput.length - 1
          );
          break;
        case "RESET":
          calcInput.value = "";
          isAlreadyInPoint = false;
          wasPrevBtnOperator = false;
          break;
      }
    });
  });
};

undoCalcInput();

// Doesn't support unary operations as of now.
const evaluateCalcInput = () => {
  evaluateBtn.addEventListener("click", () => {
    let operators = "+-x/";
    let expression = removeFormatting(calcInput.value);

    let expressionArr = [];
    let numStartIndex = 0;
    let numEndIndex;
    for (let charIndex = 0; charIndex <= expression.length; charIndex++) {
      let currChar = expression.charAt(charIndex);
      if (
        operators.indexOf(currChar) !== -1 ||
        charIndex === expression.length
      ) {
        numEndIndex = charIndex;
        break;
      }
    }

    expressionArr.push(expression.substring(numStartIndex, numEndIndex));
    if (numEndIndex !== expression.length) {
      expressionArr.push(expression.charAt(numEndIndex));

      numStartIndex = numEndIndex + 1;

      for (
        let charIndex = numStartIndex;
        charIndex <= expression.length;
        charIndex++
      ) {
        let currChar = expression.charAt(charIndex);
        if (
          operators.indexOf(currChar) !== -1 ||
          charIndex === expression.length
        ) {
          numStartIndex = numEndIndex + 1;
          numEndIndex = charIndex;
          expressionArr.push(expression.substring(numStartIndex, numEndIndex));
          if (charIndex !== expression.length)
            expressionArr.push(expression.charAt(numEndIndex));
        }
      }
    }

    const operatorPrecedence = ["/", "x", "+", "-"];

    // console.log(expressionArr);
    let currOperatorIndex = 0;
    outer: for (
      let index = 0;
      expressionArr.length > 1 &&
      index <= expressionArr.length &&
      currOperatorIndex < operatorPrecedence.length;
      index++
    ) {
      let token = expressionArr[index];
      while (token === operatorPrecedence[currOperatorIndex]) {
        token = expressionArr[index];
        // console.log("Current Operator: " + token);
        let prevOperand = Number(expressionArr[index - 1]);
        let nextOperand = Number(expressionArr[index + 1]);
        let operator = token;
        let result = "" + operate(prevOperand, nextOperand, operator);
        // console.log("Current Operation: ", expressionArr.splice(index - 1, 3));
        expressionArr.splice(index - 1, 3);
        expressionArr.splice(index - 1, 0, result);
        // console.log("Result: ", expressionArr);
        if (index === expressionArr.length && expressionArr.length > 1) {
          currOperatorIndex += 1;
          index = -1;
          continue outer;
        } else if (expressionArr.length === 1) {
          continue outer;
        }
      }
      if (index === expressionArr.length && expressionArr.length > 1) {
        currOperatorIndex += 1;
        index = -1;
      }
    }
    calcInput.value = expressionArr[0];
  });
};

const operate = (firstOperand, secondOperand, operator) => {
  let res;
  switch (operator) {
    case "/":
      res = firstOperand / secondOperand;
      break;
    case "x":
      res = firstOperand * secondOperand;
      break;
    case "+":
      res = firstOperand + secondOperand;
      break;
    case "-":
      res = firstOperand - secondOperand;
      break;
  }
  return res;
};

evaluateCalcInput();
