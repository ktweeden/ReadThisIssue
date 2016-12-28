
/**
 * Tests input contains only valid characters
 */
function inputSanitation(input) {
  return /^[a-z\d\s?!"',.()£#$:;-]*$/i.test(input)
}


module.exports = {
  inputSanitation: inputSanitation
}
