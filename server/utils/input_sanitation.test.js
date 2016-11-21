var inputSanitation = require('./input_sanitation')

var validStrings = ["this is just words", "let's add some puntuation!!", "122343465567", "SP00N", ""]
var invalidStrings = ["^^***"]

for (var string of validStrings) {
  test(`accepts ${string} as a valid string`, function () {
    expect(inputSanitation.inputSanitation(this)).toBe(true);
  }.bind(string));
}

for (var string of invalidStrings) {
  test(`does not accept ${string} as a valid string`, function () {
    expect(inputSanitation.inputSanitation(this)).toBe(false);
  }.bind(string));
}
