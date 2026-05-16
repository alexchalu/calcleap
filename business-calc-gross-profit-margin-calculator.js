
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Revenue ($)</label>
        <input type="number" id="revenue" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Cost of Goods Sold ($)</label>
        <input type="number" id="cogs" placeholder="60000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Gross Profit Margin</button>`;

function calculate() {
  
      const revenue = parseFloat(document.getElementById('revenue').value);
      const cogs = parseFloat(document.getElementById('cogs').value);
      
      if (!revenue || !cogs) return alert('Please enter all values');
      
      const profit = revenue - cogs;
      const margin = (profit / revenue) * 100;
      
      const _results = [
        { label: 'Gross Profit', value: '$' + profit.toLocaleString() },
        { label: 'Gross Profit Margin', value: margin.toFixed(2) + '%' },
        { label: 'Cost Ratio', value: ((cogs / revenue) * 100).toFixed(2) + '%' },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
