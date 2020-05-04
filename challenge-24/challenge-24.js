(function (win, doc) {
  'use strict'
  /*
  Nossa calculadora agora está funcional! A ideia desse desafio é modularizar
  o código, conforme vimos na aula anterior. Quebrar as responsabilidades
  em funções, onde cada função faça somente uma única coisa, e faça bem feito.

  - Remova as duplicações de código;
  - agrupe os códigos que estão soltos em funções (declarações de variáveis,
  listeners de eventos, etc);
  - faça refactories para melhorar esse código, mas de forma que o mantenha com a
  mesma funcionalidade.
  */

  const $visor = document.querySelector('[data-js="visor"]');
  const $buttonsNumbers = document.querySelectorAll(
    '[data-js="button-number"]');
  const $buttonsOperations = document.querySelectorAll(
    '[data-js="button-operation"]');
  const $buttonCE = document.querySelector('[data-js="button-ce"]');
  const $buttonEqual = document.querySelector('[data-js="button-equal"]');

  function initialize() {
    initEvents();
  }

  function initEvents() {
    Array.prototype.forEach.call($buttonsNumbers, function (button) {
      button.addEventListener('click', handleClickNumber, false);
    });
    Array.prototype.forEach.call($buttonsOperations, function (button) {
      button.addEventListener('click', handleClickOperation, false);
    });
    $buttonCE.addEventListener('click', handleClickCE, false);
    $buttonEqual.addEventListener('click', handleClickEqual, false);
    win.addEventListener('keyup', handleKeyNumber, false);
  }

  function handleClickNumber() {
    $visor.value += this.value;
  }

  function handleKeyNumber(event) {
    const RegExpNumbersAndOperators = new RegExp('[^.+*/-\\d+]', 'g');
    const justNumbersAndOperators = event.key.replace(RegExpNumbersAndOperators, '');
    const RegExpOperators = new RegExp('[^+*/-]', 'g');
    const justOperators = event.key.replace(RegExpOperators, '');

    verifyKey(justOperators)
    $visor.value += justNumbersAndOperators;
  }

  function verifyKey(justOperators) {
    if (event.key === 'q') {
      handleClickCE();
    }
    if (justOperators) {
      $visor.value = removeLastItemIfItIsAnOperator($visor.value);
    }
    if (event.key === '=' || event.key === 'Enter') {
      if ($visor.value !== '') {
        handleClickEqual();
      }
    }
    if (event.key === 'Backspace') {
      $visor.value = removeLastItemIfItIsAnOperator($visor.value);
      $visor.value = removeLastItemWithDel($visor.value);
    }
  }

  function handleClickOperation() {
    $visor.value = removeLastItemIfItIsAnOperator($visor.value);
    $visor.value += this.value;
  }

  function handleClickCE() {
    $visor.value = '';
  }

  function handleClickEqual() {
    var allValues = $visor.value.match(getRegexOperations());

    $visor.value = removeLastItemIfItIsAnOperator($visor.value);
    $visor.value = allValues.reduce(calculateAllValues);
  }

  function isLastItemAnNumber(number) {
    var numbers = getNumbers();
    var lastItem = number.split('').pop();

    return numbers.some(function (number) {
      return number === lastItem;
    });
  }

  function isLastItemAnOperation(number) {
    var operations = getOperations();
    var lastItem = number.split('').pop();

    return operations.some(function (operator) {
      return operator === lastItem;
    });
  }

  function removeLastItemWithDel(number) {
    if (isLastItemAnNumber(number)) {
      return number.slice(0, -1);
    }
    return number;
  }

  function removeLastItemIfItIsAnOperator(string) {
    if (isLastItemAnOperation(string))
      return string.slice(0, -1);
    return string;
  }

  function getOperations() {
    return Array.prototype.map.call($buttonsOperations, (function (button) {
      return button.value;
    }));
  }

  function getRegexOperations() {
    return new RegExp('[.\\d]+[' + getOperations().join('') + ']?', 'g');
  }

  function getNumbers() {
    return Array.prototype.map.call($buttonsNumbers, (function (button) {
      return button.value;
    }));
  }

  function calculateAllValues(accumulated, actual) {
    var firstValue = accumulated.slice(0, -1);
    var operator = accumulated.split('').pop();
    var lastValue = removeLastItemIfItIsAnOperator(actual);
    var lastOperator = getLastOperator(actual)
    return doOperation(operator, firstValue, lastValue) + lastOperator
  }

  function getLastOperator(value) {
    return isLastItemAnOperation(value) ? value.split('').pop() :
      '';
  }

  function doOperation(operator, firstValue, lastValue) {
    switch (operator) {
      case '+':
        return Number(firstValue) + Number(lastValue);
      case '-':
        return Number(firstValue) - Number(lastValue);
      case '*':
        return Number(firstValue) * Number(lastValue);
      case '/':
        return Number(firstValue) / Number(lastValue);
    }
  }

  initialize();

})(window, document);
