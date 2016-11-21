
/**
 * Tests input contains only valid characters
 */
var inputValidation = function(input) {
  return /^[a-z\d\s?!"',.()£#$:;-]+$/i.test(input);
}


module.exports = {
  inputValidation: inputValidation
}
