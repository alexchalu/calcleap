// CalcLeap Email Capture Popup
// Triggers after 30 seconds OR on exit intent (desktop)
// Stores email via FormSubmit.co, shows only once per 30 days

(function() {
  'use strict';
  
  const STORAGE_KEY = 'clEmailCaptured';
  const COOLDOWN_DAYS = 30;
  const DELAY_MS = 30000; // 30 seconds
  
  // Check if already captured
  if (localStorage.getItem(STORAGE_KEY)) {
    const timestamp = parseInt(localStorage.getItem(STORAGE_KEY));
    const daysSince = (Date.now() - timestamp) / (1000 * 60 * 60 * 24);
    if (daysSince < COOLDOWN_DAYS) return;
  }
  
  let shown = false;
  
  function showPopup() {
    if (shown) return;
    shown = true;
    
    const overlay = document.createElement('div');
    overlay.id = 'clEmailOverlay';
    overlay.innerHTML = `
      <div class="cl-email-popup">
        <button class="cl-close" onclick="document.getElementById('clEmailOverlay').remove()">×</button>
        <div class="cl-popup-header">
          <div class="cl-popup-icon">📊</div>
          <h3>Get Financial Tips & New Calculators</h3>
          <p>Join 1,000+ people getting weekly tips on saving money, investing, and using our calculators.</p>
        </div>
        <form id="clEmailForm" action="https://formsubmit.co/alexmathewc@gmail.com" method="POST">
          <input type="hidden" name="_subject" value="CalcLeap Newsletter Signup">
          <input type="hidden" name="_captcha" value="false">
          <input type="hidden" name="_template" value="table">
          <input type="text" name="_honey" style="display:none">
          <input type="email" name="email" placeholder="your@email.com" required>
          <button type="submit">Get Free Tips</button>
        </form>
        <div class="cl-popup-footer">No spam. Unsubscribe anytime. <a href="/privacy.html">Privacy Policy</a></div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Handle form submission
    document.getElementById('clEmailForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[name="email"]').value;
      
      // Store in localStorage backup
      const backups = JSON.parse(localStorage.getItem('clEmailSignups') || '[]');
      backups.push({ email, date: new Date().toISOString(), source: window.location.href });
      localStorage.setItem('clEmailSignups', JSON.stringify(backups));
      
      // Submit to FormSubmit
      fetch(this.action, {
        method: 'POST',
        body: new FormData(this),
        mode: 'no-cors'
      });
      
      // Mark as captured
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      
      // Show success message
      overlay.innerHTML = `
        <div class="cl-email-popup cl-success">
          <div class="cl-popup-icon">✅</div>
          <h3>You're In!</h3>
          <p>Check your inbox for a confirmation email. You'll get weekly tips on maximizing your money.</p>
          <button onclick="document.getElementById('clEmailOverlay').remove()">Close</button>
        </div>
      `;
      
      setTimeout(() => overlay.remove(), 5000);
    });
  }
  
  // Desktop exit-intent trigger
  document.addEventListener('mouseout', function(e) {
    if (!e.toElement && !e.relatedTarget && e.clientY < 10) {
      showPopup();
    }
  });
  
  // Time-based trigger (30 seconds)
  setTimeout(showPopup, DELAY_MS);
  
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #clEmailOverlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      animation: clFadeIn 0.3s ease;
    }
    
    @keyframes clFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .cl-email-popup {
      background: #fff;
      border-radius: 16px;
      padding: 2.5rem 2rem 2rem;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      position: relative;
      animation: clSlideUp 0.4s ease;
    }
    
    @keyframes clSlideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .cl-close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: none;
      border: none;
      font-size: 2rem;
      line-height: 1;
      color: #9ca3af;
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }
    
    .cl-close:hover {
      background: #f3f4f6;
      color: #374151;
    }
    
    .cl-popup-icon {
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .cl-popup-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.75rem;
      text-align: center;
    }
    
    .cl-popup-header p {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.6;
      margin: 0 0 1.75rem;
      text-align: center;
    }
    
    #clEmailForm {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    #clEmailForm input[type="email"] {
      padding: 0.875rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    #clEmailForm input[type="email"]:focus {
      outline: none;
      border-color: #0071e3;
      box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
    }
    
    #clEmailForm button[type="submit"] {
      background: linear-gradient(135deg, #0071e3 0%, #005bb5 100%);
      color: #fff;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    #clEmailForm button[type="submit"]:hover {
      background: linear-gradient(135deg, #005bb5 0%, #004a99 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3);
    }
    
    .cl-popup-footer {
      font-size: 0.75rem;
      color: #9ca3af;
      text-align: center;
      margin-top: 1rem;
    }
    
    .cl-popup-footer a {
      color: #0071e3;
      text-decoration: none;
    }
    
    .cl-email-popup.cl-success {
      text-align: center;
    }
    
    .cl-email-popup.cl-success button {
      background: #22c55e;
      color: #fff;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
  `;
  document.head.appendChild(style);
})();
