
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
      <button class="btn" onclick="calculate()">Calculate Hourly Rate</button>`;

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
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
