

/**
 * Tests input contains only valid characters TODO move to input utils file
 */
var inputValidation = function(input) {
  return /^[a-z\d\s?!"',.()£#$:;]+$/i.test(input);
}


module.exports = {
  inputValidation: inputValidation
}
