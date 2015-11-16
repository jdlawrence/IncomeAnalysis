var app = angular.module('IA', []);

app.controller('incomeController', ['$scope', 'Calculate', function($scope, Calculate){
  var standardDeduction = 6200;

  $scope.income = 105000;
  // $scope.tax = 0;

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
    carInsurance: 1500,
    medical: 1000,
    retirementRate: 0.15,
    fedTax: federalTax
  };

  $scope.updateIncome = function(){
    $scope.tax = Calculate.calculateTax($scope.income, $scope.expenses);
    $scope.disposableIncome = $scope.income 
                            - $scope.expenses.medical
                            - $scope.income * $scope.expenses.retirementRate
                            - $scope.income * $scope.expenses.savingsRate
                            - $scope.expenses.carInsurance
                            - $scope.tax;
  };
  
}]);

app.service('Calculate', function(){
  var standardDeduction = 6200;

  this.add = function(a, b) {
    return a + b;
  };

  this.calculateTax = function(income, expensesObj){
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

      }
      return tax;
    }

    return Math.max(taxOwed(0, income, income, 0) - standardDeduction, 0) ;
  };

});



