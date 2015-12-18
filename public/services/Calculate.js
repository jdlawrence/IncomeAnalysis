// 'use strict';

// angular.module('noterious.common')
//   .factory('Auth', function ($firebaseAuth, ENDPOINT_URI) {
//     var ref = new Firebase(ENDPOINT_URI);
//     return $firebaseAuth(ref);
//   })
// ;

angular.module('IA').service('Calculate', function(){
  // app.service('Calculate', function(){
    this.add = function(a, b) {
      return a + b;
    };

    this.calculateTax2 = function(income, expenses) {
    // console.log('inside tax2');
    var tax = 0;

    for (var i = 0; i < expenses.length; i++) {
      // If income is higher than highest bracket, tax the difference 
      // between income and the current bracket
      // console.log('i is', i);
      console.log('IIIIIIIIIIIIIIIIIIIIIII', i);
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
