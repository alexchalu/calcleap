
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Revenue ($)</label>
        <input type="number" id="revenue" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>Cost of Goods Sold ($)</label>
        <input type="number" id="cogs" placeholder="60000" step="1000">
      </div>
      <button class="calc-btn" onclick="calculate()">Calculate Gross Profit Margin</button>`;

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

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
