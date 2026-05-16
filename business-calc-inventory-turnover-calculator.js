
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Cost of Goods Sold (Annual $)</label>
        <input type="number" id="cogs" placeholder="500000" step="1000">
      </div>
      <div class="input-group">
        <label>Average Inventory ($)</label>
        <input type="number" id="inventory" placeholder="50000" step="1000">
      </div>
      <button class="btn" onclick="calculate()">Calculate Turnover Ratio</button>`;

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
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
