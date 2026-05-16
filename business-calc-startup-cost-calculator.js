
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>One-Time Costs ($)</label>
        <input type="number" id="onetime" placeholder="50000" step="1000">
        <div class="hint">Equipment, legal, licenses, initial inventory</div>
      </div>
      <div class="input-group">
        <label>Monthly Operating Costs ($)</label>
        <input type="number" id="monthly" placeholder="8000" step="100">
      </div>
      <div class="input-group">
        <label>Months Until Profitable</label>
        <input type="number" id="months" placeholder="12" step="1">
      </div>
      <button class="btn" onclick="calculate()">Calculate Total Startup Cost</button>`;

function calculate() {
  
      const onetime = parseFloat(document.getElementById('onetime').value);
      const monthly = parseFloat(document.getElementById('monthly').value);
      const months = parseFloat(document.getElementById('months').value);
      
      if (!onetime || !monthly || !months) return alert('Please enter all values');
      
      const operating = monthly * months;
      const total = onetime + operating;
      const cushion = total * 1.2;
      
      const _results = [
        { label: 'One-Time Startup Costs', value: '$' + onetime.toLocaleString() },
        { label: 'Operating Costs (' + months + ' months)', value: '$' + operating.toLocaleString() },
        { label: 'Total Startup Cost', value: '$' + total.toLocaleString() },
        { label: 'Recommended w/ Cushion (20%)', value: '$' + cushion.toLocaleString() },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
