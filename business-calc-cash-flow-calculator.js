
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Monthly Revenue ($)</label>
        <input type="number" id="revenue" placeholder="50000" step="1000">
      </div>
      <div class="input-group">
        <label>Monthly Expenses ($)</label>
        <input type="number" id="expenses" placeholder="35000" step="1000">
      </div>
      <div class="input-group">
        <label>Starting Cash Balance ($)</label>
        <input type="number" id="balance" placeholder="20000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Cash Flow</button>`;

function calculate() {
  
      const revenue = parseFloat(document.getElementById('revenue').value);
      const expenses = parseFloat(document.getElementById('expenses').value);
      const balance = parseFloat(document.getElementById('balance').value);
      
      if (revenue == null || expenses == null || balance == null) return alert('Please enter all values');
      
      const monthly = revenue - expenses;
      const annual = monthly * 12;
      const endBalance = balance + monthly;
      const runway = balance / expenses;
      
      const _results = [
        { label: 'Monthly Cash Flow', value: '$' + monthly.toLocaleString() + (monthly >= 0 ? ' (Positive)' : ' (Negative)') },
        { label: 'Annual Cash Flow', value: '$' + annual.toLocaleString() },
        { label: 'Ending Cash Balance', value: '$' + endBalance.toLocaleString() },
        { label: 'Cash Runway (if negative)', value: runway > 0 ? runway.toFixed(1) + ' months' : 'N/A' },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
