let calcInput = document.querySelector("#calc-input");

let calcBtns = document.querySelectorAll(".calc-btn");

let calcInputBtns = [];
calcBtns.forEach((calcBtn) => {
  if (calcBtn.classList.length === 1) {
    calcInputBtns.push(calcBtn);
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

let wasPrevBtnOperator = false;
calcInputBtns.forEach((calcInputBtn) => {
  calcInputBtn.addEventListener("click", (event) => {
    let numbers = "0123456789";
    if (numbers.indexOf(event.target.innerText) !== -1) {
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
    } else wasPrevBtnOperator = true;
    calcInput.value += `${event.target.innerText}`;
  });
});
