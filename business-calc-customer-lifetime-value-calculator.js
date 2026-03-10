
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
      <button class="calc-btn" onclick="calculate()">Calculate CLV</button>`;

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

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
