var testAmount = 10000;

var federalTax = [
{bracket: 0, rate: 0.0},
{bracket: 9225, rate: 0.10},
{bracket: 37450, rate: 0.15},
{bracket: 90750, rate: 0.25},
{bracket: 189300, rate: 0.28},
{bracket: 411500, rate: 0.33},
{bracket: 413200, rate: 0.35},
{bracket: 413200, rate: 0.396}
];

// **************** Original ********************
function calculate(income, taxArray){
  var level = 0;
  
  function taxOwed(tax, starting, leftOver, level) {
    var amounts = [];
    while (leftOver >= 0) {
      // If starting amount is greater than bracket, add entire amount to tax,
      // and subtract bracket from leftOver
      if (level === 0) {
        level++;
      }
      else if (level === 7) {
        amounts.push(leftOver * taxArray[level].rate);
        tax += leftOver * taxArray[level].rate;
        console.log('leftOver ********************', leftOver);
        leftOver -= (taxArray[level].bracket - taxArray[level-1].bracket);
        level++; 
        break;
      }

      else if (starting > taxArray[level].bracket) {
        amounts.push((taxArray[level].bracket - taxArray[level-1].bracket) * taxArray[level].rate);
        tax += (taxArray[level].bracket - taxArray[level-1].bracket) * taxArray[level].rate;
        leftOver -= (taxArray[level].bracket - taxArray[level-1].bracket);
        level++;
      }
      else {
        amounts.push(leftOver * taxArray[level].rate);
        tax += leftOver * taxArray[level].rate;
        leftOver -= (taxArray[level].bracket - taxArray[level-1].bracket);
        level++; 
      }
      console.log('starting', starting, 'tax', tax, 'leftOver', leftOver, 'level', level);

    }
    return tax;
  }

  return Math.max(taxOwed(0, income, income, 0) - 6200, 0);
}

// // Ramda Refactor
// var R = require('ramda');
// var income = 900000;

// var bracketLens = R.lensProp('bracket');
// var rateLens = R.lensProp('rate');

// var findTax = function (income, current, index, list) {
//     if (index === 0 || bracketLens(list[index-1]) > income) {
//         return 0;
//     } else {
//         return R.compose(
//             R.multiply(rateLens(current)),
//             R.add(R.negate(bracketLens(list[index-1]))),
//             min(bracketLens(current)) 
//         )(income);
//     }
// };

// var curriedFindTax = R.curry(findTax);

// taxScale = R.compose(
//     R.reduce(R.add),
//     R.addIndex(R.map)(findTax(income))
// );

console.log('Your tax owed is: ', calculate(testAmount, federalTax));