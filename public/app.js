var app = angular.module('IA', []);

app.controller('incomeController', ['$scope', 'Calculate', function($scope, Calculate){
  var standardDeduction = 6200;
  var exemption = 3900;

  $scope.income = 105000;
  $scope.numExemptions = 1;
  $scope.taxableIncome = $scope.income - $scope.numExemptions * exemption; 
  $scope.usableIncome = 0;

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
    housing: 18000,
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
    console.log('$scope.exemptionTotal', $scope.taxableIncome);
    $scope.tax = Calculate.calculateTax($scope.taxableIncome, $scope.expenses);
    console.log('$scope.tax', $scope.tax);
    $scope.usableIncome = $scope.income - $scope.tax;
    $scope.disposableIncome = $scope.income 
                            - $scope.expenses.medical
                            - $scope.income * $scope.expenses.retirementRate / 100
                            - $scope.income * $scope.expenses.savingsRate / 100
                            - $scope.expenses.carInsurance
                            - $scope.expenses.housing 
                            - $scope.expenses.bills
                            - $scope.expenses.food * 30
                            - $scope.tax;
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



