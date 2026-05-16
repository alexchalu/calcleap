
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Annual Revenue ($)</label>
        <input type="number" id="revenue" placeholder="500000" step="1000">
      </div>
      <div class="input-group">
        <label>Annual Profit ($)</label>
        <input type="number" id="profit" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Industry Multiple</label>
        <select id="multiple">
          <option value="2">Low Growth (2x)</option>
          <option value="3" selected>Average (3x)</option>
          <option value="5">High Growth (5x)</option>
          <option value="7">Tech/SaaS (7x)</option>
        </select>
      </div>
      <button class="btn" onclick="calculate()">Calculate Valuation</button>`;

function calculate() {
  
      const revenue = parseFloat(document.getElementById('revenue').value);
      const profit = parseFloat(document.getElementById('profit').value);
      const multiple = parseFloat(document.getElementById('multiple').value);
      
      if (!revenue || !profit) return alert('Please enter all values');
      
      const revenueValue = revenue * multiple;
      const earningsValue = profit * (multiple + 2);
      const assetValue = (revenue * 0.5) + (profit * 3);
      const average = (revenueValue + earningsValue + assetValue) / 3;
      
      const _results = [
        { label: 'Revenue Multiple Method', value: '$' + revenueValue.toLocaleString() },
        { label: 'Earnings Multiple Method', value: '$' + earningsValue.toLocaleString() },
        { label: 'Asset-Based Method', value: '$' + assetValue.toLocaleString() },
        { label: 'Average Valuation', value: '$' + average.toLocaleString() },
        { label: 'Valuation Range', value: '$' + (average * 0.8).toLocaleString() + ' - $' + (average * 1.2).toLocaleString() },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
