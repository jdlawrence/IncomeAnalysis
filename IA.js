var testAmount = 38242.54;

function calculate(income, taxObj){
  var level = 0;
  var federalTax = [
  {bracket: 9225, rate: 0.10},
  {bracket: 37450, rate: 0.15},
  {bracket: 90750, rate: 0.25},
  {bracket: 189300, rate: 0.28},
  {bracket: 411500, rate: 0.33},
  {bracket: 413200, rate: 0.35},
  {bracket: 413201, rate: 0.396}
  ];
  function taxOwed(tax, starting, leftOver, level) {
    while (leftOver >= 0) {
      // If starting amount is greater than bracket, add entire amount to tax,
      // and subtract bracket from leftOver
      console.log('tax', tax);
      if (starting > federalTax[level].bracket) {
        console.log('inside if');

        tax += federalTax[level].bracket * federalTax[level].rate;
        leftOver -= federalTax[level].bracket;
        level++;
      }
      else {
        tax += leftOver * federalTax[level].rate;
        leftOver -= federalTax[level].bracket;
        level++; 
      }

      console.log('tax2', tax);
    }

    return tax;

  }

  return taxOwed(0, income, income, 0);
}

console.log('Your income is: ', calculate(testAmount));