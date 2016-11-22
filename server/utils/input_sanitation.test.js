const inputSanitation = require('./input_sanitation')

const validStrings = ["this is just words", "let's add some puntuation!!", "122343465567", "SP00N", ""]
const invalidStrings = ["^^***"]

for (const string of validStrings) {
  test(`accepts ${string} as a valid string`, function () {
    expect(inputSanitation.inputSanitation(this)).toBe(true);
  }.bind(string));
}

for (const string of invalidStrings) {
  test(`does not accept ${string} as a valid string`, function () {
    expect(inputSanitation.inputSanitation(this)).toBe(false);
  }.bind(string));
}
