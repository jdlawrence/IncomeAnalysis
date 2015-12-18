var income = 7000;
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
{bracket: 0, rate: 0.0, difference: 0},
{bracket: 7850, rate: 0.01, difference: 7850},
{bracket: 18610, rate: 0.02, difference: 10760},
{bracket: 29372, rate: 0.04, difference: 10762},
{bracket: 40773, rate: 0.06, difference: 11361},
{bracket: 51530, rate: 0.08, difference: 10757},
{bracket: 262222, rate: 0.093, difference: 210692},
{bracket: 315866, rate: 0.103, difference: 53644},
{bracket: 526443, rate: 0.113, difference: 210577},
{bracket: 1000000, rate: 0.123, difference: 473557},
{bracket: 1000000, rate: 0.133, difference: 0}
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
//     if (index === 0 || bracketLens(list[index]) > income) {
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

// calculateTax2 :: integer -> object -> integer
function calculateTax2(income, expenses) {
  var tax = 0;

  // console.log(expenses.stateTax[1].bracket, '*****************');
  for (var i = 0; i < expenses.length; i++) {
    // If income is higher than highest bracket, tax the difference 
    // between income and the current bracket
    if (i === expenses.length - 1) {
      tax += (income - expenses[i].bracket) * expenses[i].rate;
    }

    // If income is below max in bracket, tax the difference
    // between the income and bracket below
    else if (expenses[i].bracket > income){
      tax += (income - expenses[i-1].bracket) * expenses[i].rate;
      break;
    }

    // Else the income is higher than the current bracket 
    // tax the difference between the current bracket and the one below
    else{
      tax += expenses[i].difference * expenses[i].rate;
    }
  }
  return tax;
}

console.log('tax2:', calculateTax2(income, expenses.stateTax));
// console.log('tax2:', expenses.stateTax);

// console.log('Your tax owed is: ', calculateTax(income, expenses));

// console.log('Your disposable is income is: ', income 
//   - calculateTax(income, expenses)
//   - expenses.savings);




