
document.getElementById('calculator-form').innerHTML = `
      <div class="input-group">
        <label>Gross Payroll ($)</label>
        <input type="number" id="payroll" placeholder="100000" step="1000">
      </div>
      <div class="input-group">
        <label>State</label>
        <select id="state">
          <option value="0.062">Federal Only (6.2% FICA)</option>
          <option value="0.08">California (8%)</option>
          <option value="0.075">New York (7.5%)</option>
          <option value="0.07">Other State Average (7%)</option>
        </select>
      </div>
      <button class="btn" onclick="calculate()">Calculate Payroll Taxes</button>`;

function calculate() {
  
      const payroll = parseFloat(document.getElementById('payroll').value);
      const stateRate = parseFloat(document.getElementById('state').value);
      
      if (!payroll) return alert('Please enter payroll amount');
      
      const fica = payroll * 0.0765;
      const futa = payroll * 0.006;
      const state = payroll * (stateRate - 0.062);
      const total = fica + futa + state;
      
      const _results = [
        { label: 'FICA (Social Security + Medicare)', value: '$' + fica.toLocaleString() },
        { label: 'FUTA (Federal Unemployment)', value: '$' + futa.toLocaleString() },
        { label: 'State Taxes (estimate)', value: '$' + state.toLocaleString() },
        { label: 'Total Employer Taxes', value: '$' + total.toLocaleString() },
        { label: 'Effective Tax Rate', value: ((total / payroll) * 100).toFixed(2) + '%' },
      ];
  
  const resultBox = document.getElementById('result');
  const resultContent = document.getElementById('result-content');
  
  resultContent.innerHTML = arguments[0].map(item => 
    '<div class="result-item"><span class="result-label">' + item.label + '</span><span class="result-value">' + item.value + '</span></div>'
  ).join('');
  
  resultBox.classList.add('show');
}
