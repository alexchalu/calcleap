
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

  // Show lead capture form after calculation
  showLeadCaptureForm();
}

function showLeadCaptureForm() {
  const leadFormHTML = `
<div class="lead-capture-form" style="margin: 2rem 0; padding: 1.5rem; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px;">
    <h3 style="margin-bottom: 1rem; color: #1d1d1f;">📩 Get Free Marketing Insights</h3>
    <p style="margin-bottom: 1.5rem; color: #495057;">Enter your details to get personalized CLV benchmarks and marketing strategies for your industry.</p>
    <form id="clvLeadForm" action="https://formsubmit.co/alexmathewc@gmail.com" method="POST">
        <input type="hidden" name="_subject" value="New CLV Marketing Lead from CalcLeap">
        <input type="hidden" name="_captcha" value="false">
        <input type="hidden" name="_next" value="https://calcleap.com/thank-you.html">
        
        <div style="margin-bottom: 1rem;">
            <label for="name" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
            <input type="text" id="name" name="name" required style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label for="email" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email Address</label>
            <input type="email" id="email" name="email" required style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label for="company" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Company Name</label>
            <input type="text" id="company" name="company" required style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 4px;">
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label for="industry" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Industry</label>
            <select id="industry" name="industry" required style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 4px;">
                <option value="retail">Retail</option>
                <option value="ecommerce">E-commerce</option>
                <option value="saas">SaaS</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="technology">Technology</option>
                <option value="professional-services">Professional Services</option>
                <option value="hospitality">Hospitality</option>
                <option value="other">Other</option>
            </select>
        </div>
        
        <div style="margin-bottom: 1rem;">
            <label for="customers" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Current Customer Count</label>
            <input type="number" id="customers" name="customers" required style="width: 100%; padding: 0.75rem; border: 1px solid #dee2e6; border-radius: 4px;">
        </div>
        
        <button type="submit" style="background: #0071e3; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; font-weight: 500;">Get Personalized Marketing Report</button>
    </form>
</div>`;

  const existingForm = document.querySelector('.lead-capture-form');
  if (!existingForm) {
    document.getElementById('result').insertAdjacentHTML('afterend', leadFormHTML);
  }
}

// Lead form submission with localStorage backup
document.addEventListener('DOMContentLoaded', function() {
    // Check for localStorage backup
    const pendingLeads = localStorage.getItem('pendingLeads');
    if (pendingLeads) {
        console.log('Found pending lead data');
    }
});

// Handle lead form submission
window.addEventListener('load', function() {
    const leadForm = document.getElementById('clvLeadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const leadData = {};
            formData.forEach((value, key) => {
                leadData[key] = value;
            });
            
            // Add timestamp
            leadData.timestamp = new Date().getTime();
            leadData.formType = 'Customer Lifetime Value Calculator';
            
            // Save to localStorage
            localStorage.setItem('pendingLeads', JSON.stringify(leadData));
            
            // Submit to Formsubmit.co
            this.submit();
        });
    }
    
    // Clear old backups after 24 hours
    const pendingLeads = localStorage.getItem('pendingLeads');
    if (pendingLeads) {
        try {
            const lead = JSON.parse(pendingLeads);
            const timestamp = lead.timestamp || Date.now();
            const diff = Date.now() - timestamp;
            
            if (diff > 24 * 60 * 60 * 1000) { // 24 hours
                localStorage.removeItem('pendingLeads');
            }
        } catch (e) {
            localStorage.removeItem('pendingLeads');
        }
    }
});
