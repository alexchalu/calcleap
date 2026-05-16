
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Total Annual Revenue ($)</label>
        <input type="number" id="revenue" placeholder="5000000" step="10000">
      </div>
      <div class="input-group">
        <label>Number of Employees</label>
        <input type="number" id="employees" placeholder="25" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Revenue per Employee</button>`;

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
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
