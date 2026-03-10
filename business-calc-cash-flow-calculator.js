
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
      <button class="calc-btn" onclick="calculate()">Calculate Cash Flow</button>`;

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

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
