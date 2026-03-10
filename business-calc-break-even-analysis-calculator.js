
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Fixed Costs (Monthly $)</label>
        <input type="number" id="fixed" placeholder="10000" step="100">
      </div>
      <div class="input-group">
        <label>Variable Cost per Unit ($)</label>
        <input type="number" id="variable" placeholder="20" step="0.01">
      </div>
      <div class="input-group">
        <label>Price per Unit ($)</label>
        <input type="number" id="price" placeholder="50" step="0.01">
      </div>
      <button class="calc-btn" onclick="calculate()">Calculate Break-Even</button>`;

function calculate() {
  
      const fixed = parseFloat(document.getElementById('fixed').value);
      const variable = parseFloat(document.getElementById('variable').value);
      const price = parseFloat(document.getElementById('price').value);
      
      if (!fixed || !variable || !price) return alert('Please enter all values');
      if (price <= variable) return alert('Price must be greater than variable cost');
      
      const contribution = price - variable;
      const units = Math.ceil(fixed / contribution);
      const revenue = units * price;
      
      const _results = [
        { label: 'Break-Even Units', value: units.toLocaleString() + ' units/month' },
        { label: 'Break-Even Revenue', value: '$' + revenue.toLocaleString() + '/month' },
        { label: 'Contribution Margin', value: '$' + contribution.toFixed(2) + ' per unit' },
        { label: 'Contribution Margin %', value: ((contribution / price) * 100).toFixed(1) + '%' },
      ];

  var resultBox = document.getElementById('result');
  var resultContent = document.getElementById('result-content');
  resultContent.innerHTML = _results.map(function(item) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.875rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>';
  }).join('');
  resultBox.style.display = 'block';
}
