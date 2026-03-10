
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Cost of Goods Sold (Annual $)</label>
        <input type="number" id="cogs" placeholder="500000" step="1000">
      </div>
      <div class="input-group">
        <label>Average Inventory ($)</label>
        <input type="number" id="inventory" placeholder="50000" step="1000">
      </div>
      <button class="calc-btn" onclick="calculate()">Calculate Turnover Ratio</button>`;

function calculate() {
  
      const cogs = parseFloat(document.getElementById('cogs').value);
      const inventory = parseFloat(document.getElementById('inventory').value);
      
      if (!cogs || !inventory) return alert('Please enter all values');
      
      const turnover = cogs / inventory;
      const days = 365 / turnover;
      
      let health = 'Low';
      if (turnover > 4) health = 'Good';
      if (turnover > 8) health = 'Excellent';
      
      const _results = [
        { label: 'Inventory Turnover Ratio', value: turnover.toFixed(2) + 'x per year' },
        { label: 'Days to Sell Inventory', value: days.toFixed(0) + ' days' },
        { label: 'Health Assessment', value: health },
      ];

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
