
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Total Visitors</label>
        <input type="number" id="visitors" placeholder="10000" step="100">
      </div>
      <div class="input-group">
        <label>Total Conversions</label>
        <input type="number" id="conversions" placeholder="250" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Conversion Rate</button>`;

function calculate() {
  
      const visitors = parseFloat(document.getElementById('visitors').value);
      const conversions = parseFloat(document.getElementById('conversions').value);
      
      if (!visitors || !conversions) return alert('Please enter all values');
      
      const rate = (conversions / visitors) * 100;
      
      let benchmark = 'Below Average';
      if (rate > 2) benchmark = 'Average';
      if (rate > 5) benchmark = 'Good';
      if (rate > 10) benchmark = 'Excellent';
      
      const _results = [
        { label: 'Conversion Rate', value: rate.toFixed(2) + '%' },
        { label: 'Visitors Needed for 1 Conversion', value: Math.ceil(1 / (conversions / visitors)) },
        { label: 'Performance', value: benchmark },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
