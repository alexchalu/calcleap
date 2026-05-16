
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Loan Amount ($)</label>
        <input type="number" id="amount" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Interest Rate (%)</label>
        <input type="number" id="rate" placeholder="7.5" step="0.1">
      </div>
      <div class="input-group">
        <label>Loan Term (Years)</label>
        <input type="number" id="years" placeholder="5" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Payment</button>`;

function calculate() {
  
      const amount = parseFloat(document.getElementById('amount').value);
      const rate = parseFloat(document.getElementById('rate').value) / 100 / 12;
      const years = parseFloat(document.getElementById('years').value);
      
      if (!amount || !rate || !years) return alert('Please enter all values');
      
      const months = years * 12;
      const payment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const total = payment * months;
      const interest = total - amount;
      
      const _results = [
        { label: 'Monthly Payment', value: '$' + payment.toFixed(2) },
        { label: 'Total Paid', value: '$' + total.toLocaleString() },
        { label: 'Total Interest', value: '$' + interest.toLocaleString() },
        { label: 'Interest as % of Loan', value: ((interest / amount) * 100).toFixed(1) + '%' },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
