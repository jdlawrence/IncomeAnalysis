var app = angular.module('IA', []);

app.controller('incomeController', ['$scope', 'Calculate', function($scope, Calculate){
  var standardDeduction = 6200;
  var exemption = 3900;

  // 1st City
  $scope.income = 105000;
  $scope.numExemptions = 1;
  $scope.taxableIncome = $scope.income - $scope.numExemptions * exemption; 
  $scope.usableIncome = 0;

  // 2nd City
  $scope.income2 = 105000;
  $scope.numExemptions2 = 1;
  $scope.taxableIncome2 = $scope.income2 - $scope.numExemptions2 * exemption; 
  $scope.usableIncome2 = 0;

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
  
  // 1st city expenses
  $scope.expenses = {
    housing: 1500,
    bills: 5400,
    food: 30,
    savingsRate: 10,
    utilities: 5400,
    carInsurance: 1500,
    medical: 1000,
    retirementRate: 10,
    fedTax: federalTax
  };

  // 2nd city expenses
  $scope.expenses2 = {
    housing: 1500,
    bills: 5400,
    food: 30,
    savingsRate: 10,
    utilities: 5400,
    carInsurance: 1500,
    medical: 1000,
    retirementRate: 10,
    fedTax: federalTax
  };

  $scope.updateIncome = function(){
    $scope.taxableIncome = $scope.income - $scope.numExemptions * exemption - standardDeduction;
    $scope.tax = Calculate.calculateTax($scope.taxableIncome, $scope.expenses);
    $scope.usableIncome = $scope.income - $scope.tax;
    $scope.disposableIncome = $scope.income 
    - $scope.expenses.medical
    - $scope.income * $scope.expenses.retirementRate / 100
    - $scope.income * $scope.expenses.savingsRate / 100
    - $scope.expenses.carInsurance
    - $scope.expenses.housing * 12 
    - $scope.expenses.bills
    - $scope.expenses.food * 365
    - $scope.tax;

    $scope.taxableIncome2 = $scope.income2 - $scope.numExemptions2 * exemption - standardDeduction;
    $scope.tax2 = Calculate.calculateTax($scope.taxableIncome2, $scope.expenses2);
    $scope.usableIncome2 = $scope.income2 - $scope.tax2;
    $scope.disposableIncome2 = $scope.income2 
    - $scope.expenses2.medical
    - $scope.income2 * $scope.expenses2.retirementRate / 100
    - $scope.income2 * $scope.expenses2.savingsRate / 100
    - $scope.expenses2.carInsurance
    - $scope.expenses2.housing * 12
    - $scope.expenses2.bills
    - $scope.expenses2.food * 365
    - $scope.tax2;
  };
  
}]);

app.service('Calculate', function(){
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

    return Math.max(taxOwed(0, income, income, 0), 0) ;
  };

});



