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
      <button class="calc-btn" onclick="calculate()">Calculate Valuation</button>`;

function calculate() {
  const revenue = parseFloat(document.getElementById('revenue').value);
  const profit = parseFloat(document.getElementById('profit').value);
  const multiple = parseFloat(document.getElementById('multiple').value);

  if (!revenue || !profit) return alert('Please enter all values');

  const revenueValue = revenue * multiple;
  const earningsValue = profit * (multiple + 2);
  const assetValue = (revenue * 0.5) + (profit * 3);
  const average = (revenueValue + earningsValue + assetValue) / 3;

  const results = [
    { label: 'Revenue Multiple Method', value: '$' + revenueValue.toLocaleString() },
    { label: 'Earnings Multiple Method', value: '$' + earningsValue.toLocaleString() },
    { label: 'Asset-Based Method', value: '$' + assetValue.toLocaleString() },
    { label: 'Average Valuation', value: '$' + Math.round(average).toLocaleString() },
    { label: 'Valuation Range', value: '$' + Math.round(average * 0.8).toLocaleString() + ' — $' + Math.round(average * 1.2).toLocaleString() },
  ];

  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');

  resultContent.innerHTML = results.map(item =>
    '<div style="display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid rgba(0,0,0,.06)"><span style="color:#6e6e73;font-size:.9rem">' + item.label + '</span><span style="font-weight:700;font-size:1rem;color:#1d1d1f">' + item.value + '</span></div>'
  ).join('');

  // Add a simple bar chart
  const maxVal = Math.max(revenueValue, earningsValue, assetValue);
  resultContent.innerHTML += '<div style="margin-top:1.5rem"><h3 style="font-size:.9rem;font-weight:600;margin-bottom:.75rem;color:#1d1d1f">Valuation Comparison</h3>';
  const methods = [
    { name: 'Revenue Multiple', val: revenueValue, color: '#0071e3' },
    { name: 'Earnings Multiple', val: earningsValue, color: '#34c759' },
    { name: 'Asset-Based', val: assetValue, color: '#ff9500' },
  ];
  methods.forEach(m => {
    const pct = Math.round((m.val / maxVal) * 100);
    resultContent.innerHTML += '<div style="margin-bottom:.75rem"><div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.25rem"><span style="color:#6e6e73">' + m.name + '</span><span style="font-weight:600">$' + Math.round(m.val).toLocaleString() + '</span></div><div style="background:rgba(0,0,0,.04);border-radius:6px;height:8px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:' + m.color + ';border-radius:6px;transition:width .5s ease"></div></div></div>';
  });
  resultContent.innerHTML += '</div>';

  resultBox.style.display = 'block';
}
