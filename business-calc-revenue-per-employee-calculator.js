
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Total Annual Revenue ($)</label>
        <input type="number" id="revenue" placeholder="5000000" step="10000">
      </div>
      <div class="input-group">
        <label>Number of Employees</label>
        <input type="number" id="employees" placeholder="25" step="1">
      </div>
      <button class="calc-btn" onclick="calculate()">Calculate Revenue per Employee</button>`;

function calculate() {
  
      const revenue = parseFloat(document.getElementById('revenue').value);
      const employees = parseFloat(document.getElementById('employees').value);
      
      if (!revenue || !employees) return alert('Please enter all values');
      
      const perEmployee = revenue / employees;
      
      let benchmark = 'Below Average';
      if (perEmployee > 150000) benchmark = 'Average';
      if (perEmployee > 250000) benchmark = 'Good';
      if (perEmployee > 500000) benchmark = 'Excellent';
      
      const _results = [
        { label: 'Revenue per Employee', value: '$' + perEmployee.toLocaleString() },
        { label: 'Monthly Revenue per Employee', value: '$' + (perEmployee / 12).toLocaleString() },
        { label: 'Productivity Benchmark', value: benchmark },
      ];

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
