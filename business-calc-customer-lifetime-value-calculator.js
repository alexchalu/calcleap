
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Average Purchase Value ($)</label>
        <input type="number" id="purchase" placeholder="100" step="1">
      </div>
      <div class="input-group">
        <label>Purchase Frequency (per year)</label>
        <input type="number" id="frequency" placeholder="4" step="0.1">
      </div>
      <div class="input-group">
        <label>Customer Lifespan (years)</label>
        <input type="number" id="lifespan" placeholder="5" step="0.5">
      </div>
      <button class="btn" onclick="calculate()">Calculate CLV</button>`;

function calculate() {
  
      const purchase = parseFloat(document.getElementById('purchase').value);
      const frequency = parseFloat(document.getElementById('frequency').value);
      const lifespan = parseFloat(document.getElementById('lifespan').value);
      
      if (!purchase || !frequency || !lifespan) return alert('Please enter all values');
      
      const annual = purchase * frequency;
      const clv = annual * lifespan;
      
      const _results = [
        { label: 'Annual Value per Customer', value: '$' + annual.toFixed(2) },
        { label: 'Customer Lifetime Value (CLV)', value: '$' + clv.toFixed(2) },
        { label: 'Max Acquisition Cost (33% rule)', value: '$' + (clv * 0.33).toFixed(2) },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
