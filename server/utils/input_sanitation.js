
/**
 * Tests input contains only valid characters
 */
const inputSanitation = function(input) {
  return /^[a-z\d\s?!"',.()£#$:;-]*$/i.test(input);
}


module.exports = {
  inputSanitation: inputSanitation
}
