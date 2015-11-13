var app = angular.module('IA', []);

app.controller('incomeController', ['$scope', 'CalculateTax', function($scope, CalculateTax){
  var standardDeduction = 6200;

  $scope.income = 105000;
  // $scope.tax = $scope.income * 0.2;
  $scope.something = CalculateTax.getName();

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

  $scope.expenses = {
    rent: 0,
    bills: 0,
    savingsRate: 0.10,
    housing: 18000,
    utilities: 5400,
    food: 10950,
    carInsurance: 2500,
    medical: 1000,
    retirementRate: 0.15,
    fedTax: federalTax
  };

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

  return Math.max(taxOwed(0, income, income, 0) - standardDeduction, 0) ;
}

$scope.tax = calculateTax($scope.income, $scope.expenses);

}]);

// app.service('CalculateTax', function(){
//   var name = 'smooth';

//   this.getName = function(){
//     return name;
//   };
// });


app.factory('CalculateTax', function(){
  var name = 'smooth';

  return {
    getName: function(){
      return name;
    }
  };
});
