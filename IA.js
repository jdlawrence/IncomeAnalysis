var income = 105000;
var standardDeduction = 6200;

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

var californiaTax = [
{bracket: 0, rate: 0.0},
{bracket: 7850, rate: 0.01},
{bracket: 18610, rate: 0.02},
{bracket: 29372, rate: 0.04},
{bracket: 40773, rate: 0.06},
{bracket: 51530, rate: 0.08},
{bracket: 262222, rate: 0.093},
{bracket: 315866, rate: 0.103},
{bracket: 526443, rate: 0.113}
{bracket: 526444, rate: 0.123}
];
var expenses = {
  rent: 0,
  bills: 0,
  savingsRate: 0.10,
  housing: 18000,
  utilities: 5400,
  food: 10950,
  carInsurance: 2500,
  medical: 1000,
  retirementRate: 0.15,
  fedTax: federalTax,
  stateTax: californiaTax 
};

expenses.savings = income * expenses.savingsRate;
expenses.retirement = income * expenses.retirementRate;


// **************** Original ********************
function calculateTax(income, expensesObj){
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
        amounts.push(leftOver * expensesObj.fedTax[level].rate);
        tax += leftOver * expensesObj.fedTax[level].rate;
        // console.log('leftOver ********************', leftOver);
        leftOver -= (expensesObj.fedTax[level].bracket - expensesObj.fedTax[level-1].bracket);
        level++; 
        break;
      }

      else if (starting > expensesObj.fedTax[level].bracket) {
        amounts.push((expensesObj.fedTax[level].bracket - expensesObj.fedTax[level-1].bracket) * expensesObj.fedTax[level].rate);
        tax += (expensesObj.fedTax[level].bracket - expensesObj.fedTax[level-1].bracket) * expensesObj.fedTax[level].rate;
        leftOver -= (expensesObj.fedTax[level].bracket - expensesObj.fedTax[level-1].bracket);
        level++;
      }
      else {
        amounts.push(leftOver * expensesObj.fedTax[level].rate);
        tax += leftOver * expensesObj.fedTax[level].rate;
        leftOver -= (expensesObj.fedTax[level].bracket - expensesObj.fedTax[level-1].bracket);
        level++; 
      }
      // console.log('starting', starting, 'tax', tax, 'leftOver', leftOver, 'level', level);

    }
    return tax;
  }

  console.log('tax is:', taxOwed(0, income, income, 0));
  return Math.max(taxOwed(0, income - standardDeduction, income - standardDeduction, 0), 0) ;
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

console.log('Your tax owed is: ', calculateTax(income, expenses));

console.log('Your disposable is income is: ', income 
  - calculateTax(income, expenses)
  - expenses.savings);




