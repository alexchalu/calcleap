
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Desired Annual Income ($)</label>
        <input type="number" id="income" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Billable Hours per Week</label>
        <input type="number" id="hours" placeholder="30" step="1">
      </div>
      <div class="input-group">
        <label>Weeks Worked per Year</label>
        <input type="number" id="weeks" placeholder="48" step="1">
      </div>
      <button class="calc-btn" onclick="calculate()">Calculate Hourly Rate</button>`;

function calculate() {
  
      const income = parseFloat(document.getElementById('income').value);
      const hours = parseFloat(document.getElementById('hours').value);
      const weeks = parseFloat(document.getElementById('weeks').value);
      
      if (!income || !hours || !weeks) return alert('Please enter all values');
      
      const totalHours = hours * weeks;
      const hourly = income / totalHours;
      const daily = hourly * 8;
      const monthly = income / 12;
      
      const _results = [
        { label: 'Minimum Hourly Rate', value: '$' + hourly.toFixed(2) },
        { label: 'Daily Rate (8 hours)', value: '$' + daily.toFixed(2) },
        { label: 'Monthly Income Goal', value: '$' + monthly.toLocaleString() },
        { label: 'Total Billable Hours/Year', value: totalHours.toLocaleString() },
      ];

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
