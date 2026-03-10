#!/usr/bin/env node
const fs = require('fs');
const AD = 'ca-pub-3112605892426625';
const BASE = 'https://alexchalu.github.io/toolpulse';

const categories = [
    {
        name: '💰 Financial Calculators',
        id: 'finance',
        tools: [
            { name: 'Mortgage Refinance', desc: 'Should you refinance?', url: 'mortgage-refinance-calculator.html' },
            { name: 'HELOC Payment', desc: 'Home equity line of credit', url: 'heloc-payment-calculator.html' },
            { name: '401k Withdrawal', desc: 'Early withdrawal taxes', url: '401k-withdrawal-calculator.html' },
            { name: 'Roth IRA Conversion', desc: 'Traditional to Roth tax impact', url: 'roth-ira-conversion-calculator.html' },
            { name: 'Reverse Mortgage', desc: 'How much can you borrow?', url: 'reverse-mortgage-calculator.html' },
            { name: 'Debt Consolidation', desc: 'Combine debts to save', url: 'debt-consolidation-calculator.html' },
            { name: 'Mortgage Payment', desc: 'Monthly payment with taxes & PMI', url: 'calc/mortgage-payment.html' },
            { name: 'Paycheck Calculator', desc: 'Take-home pay after taxes', url: 'calc/paycheck-calculator.html' },
            { name: 'Personal Loan', desc: 'Loan payments & amortization', url: 'calc/personal-loan-calculator.html' },
            { name: 'Student Loan', desc: 'Student debt payoff timeline', url: 'calc/student-loan-calculator.html' },
            { name: 'Student Loan Forgiveness', desc: 'PSLF & IDR forgiveness estimator', url: 'student-loan-forgiveness-calculator.html' },
            { name: 'ROI Calculator', desc: 'Return on investment', url: 'calc/roi-calculator.html' },
            { name: 'Profit Margin', desc: 'Margin & markup calculator', url: 'calc/margin-calculator.html' },
            { name: 'Rent vs Buy', desc: 'Should you rent or buy?', url: 'calc/rent-vs-buy.html' },
            { name: 'Salary to Hourly', desc: 'Convert salary ↔ hourly rate', url: 'calc/salary-to-hourly.html' },
            { name: 'Hourly to Salary', desc: 'Annual salary from hourly wage', url: 'calc/hourly-to-salary.html' },
            { name: 'Sales Tax', desc: 'Calculate total with tax', url: 'calc/sales-tax-calculator.html' },
            { name: 'Discount Calculator', desc: 'Sale price & savings', url: 'calc/discount-calculator.html' },
            { name: 'Tip Calculator', desc: 'Split bills & calculate tips', url: 'calc/tip-calculator.html' },
            { name: 'Percentage Calculator', desc: 'What is X% of Y?', url: 'calc/percentage-calculator.html' },
            { name: 'Compound Interest', desc: 'Savings & investment growth', url: 'calc/compound-interest.html' },
            { name: 'Inflation Calculator', desc: 'Purchasing power over time', url: 'calc/inflation-calculator.html' },
            { name: 'Retirement Calculator', desc: 'Are you on track to retire?', url: 'calc/retirement-calculator.html' },
            { name: 'Debt-to-Income Ratio', desc: 'DTI for mortgage eligibility', url: 'calc/debt-to-income.html' },
            { name: 'Car Loan Calculator', desc: 'Auto loan payments & interest', url: 'calc/car-loan-calculator.html' },
            { name: 'Net Pay Calculator', desc: 'Take-home after all taxes', url: 'calc/net-pay-calculator.html' },
            { name: 'Solar Panel ROI', desc: 'Solar investment return & payback', url: 'calc/solar-panel-roi-calculator.html' },
            { name: '401(k) Calculator', desc: 'Retirement savings with employer match', url: 'calc/401k-calculator.html' },
            { name: 'Roth IRA Calculator', desc: 'Tax-free retirement account growth', url: 'calc/roth-ira-calculator.html' },
            { name: 'Traditional IRA', desc: 'Traditional IRA savings calculator', url: 'calc/traditional-ira-calculator.html' },
            { name: 'Investment Return', desc: 'Calculate investment ROI', url: 'calc/investment-return-calculator.html' },
            { name: 'Dividend Yield', desc: 'Stock dividend income calculator', url: 'calc/dividend-yield-calculator.html' },
            { name: 'Stock Portfolio', desc: 'Portfolio growth tracker', url: 'calc/stock-portfolio-calculator.html' },
            { name: 'Capital Gains Tax', desc: 'Investment tax calculator', url: 'calc/capital-gains-tax-calculator.html' },
            { name: 'Bond Yield', desc: 'Bond YTM calculator', url: 'calc/bond-yield-calculator.html' },
        ]
    },
    {
        name: '🏖️ Retirement Planning',
        id: 'retirement',
        tools: [
            { name: 'Early Retirement (FIRE)', desc: 'When can you retire early?', url: 'early-retirement-calculator.html' },
            { name: 'Social Security', desc: 'Estimate SS benefits', url: 'social-security-calculator.html' },
            { name: 'Pension Calculator', desc: 'Calculate pension benefits', url: 'pension-calculator.html' },
            { name: 'RMD Calculator', desc: 'Required minimum distributions', url: 'required-minimum-distribution-calculator.html' },
            { name: 'Annuity Calculator', desc: 'Annuity payment estimator', url: 'annuity-calculator.html' },
            { name: 'Retirement Withdrawal', desc: 'Safe withdrawal rates', url: 'retirement-withdrawal-calculator.html' },
        ]
    },
    {
        name: '🗽 State Tax Calculators',
        id: 'state-tax',
        tools: [
            { name: 'California Tax', desc: 'CA income tax calculator', url: 'california-income-tax-calculator.html' },
            { name: 'Texas Tax', desc: 'TX income tax (no state tax)', url: 'texas-income-tax-calculator.html' },
            { name: 'Florida Tax', desc: 'FL income tax (no state tax)', url: 'florida-income-tax-calculator.html' },
            { name: 'New York Tax', desc: 'NY income tax calculator', url: 'new-york-income-tax-calculator.html' },
            { name: 'Pennsylvania Tax', desc: 'PA income tax calculator', url: 'pennsylvania-income-tax-calculator.html' },
            { name: 'Illinois Tax', desc: 'IL income tax calculator', url: 'illinois-income-tax-calculator.html' },
            { name: 'Ohio Tax', desc: 'OH income tax calculator', url: 'ohio-income-tax-calculator.html' },
            { name: 'Georgia Tax', desc: 'GA income tax calculator', url: 'georgia-income-tax-calculator.html' },
            { name: 'North Carolina Tax', desc: 'NC income tax calculator', url: 'north-carolina-income-tax-calculator.html' },
            { name: 'Michigan Tax', desc: 'MI income tax calculator', url: 'michigan-income-tax-calculator.html' },
            { name: 'Arizona Tax', desc: 'AZ income tax calculator', url: 'arizona-income-tax-calculator.html' },
            { name: 'Colorado Tax', desc: 'CO income tax calculator', url: 'colorado-income-tax-calculator.html' },
            { name: 'Indiana Tax', desc: 'IN income tax calculator', url: 'indiana-income-tax-calculator.html' },
            { name: 'Maryland Tax', desc: 'MD income tax calculator', url: 'maryland-income-tax-calculator.html' },
            { name: 'Massachusetts Tax', desc: 'MA income tax calculator', url: 'massachusetts-income-tax-calculator.html' },
            { name: 'Minnesota Tax', desc: 'MN income tax calculator', url: 'minnesota-income-tax-calculator.html' },
            { name: 'Missouri Tax', desc: 'MO income tax calculator', url: 'missouri-income-tax-calculator.html' },
            { name: 'New Jersey Tax', desc: 'NJ income tax calculator', url: 'new-jersey-income-tax-calculator.html' },
            { name: 'Tennessee Tax', desc: 'TN income tax (no state tax)', url: 'tennessee-income-tax-calculator.html' },
            { name: 'Virginia Tax', desc: 'VA income tax calculator', url: 'virginia-income-tax-calculator.html' },
            { name: 'Washington Tax', desc: 'WA income tax (no state tax)', url: 'washington-income-tax-calculator.html' },
            { name: 'Wisconsin Tax', desc: 'WI income tax calculator', url: 'wisconsin-income-tax-calculator.html' },
            { name: 'Alabama Tax', desc: 'AL income tax calculator', url: 'alabama-income-tax-calculator.html' },
            { name: 'South Carolina Tax', desc: 'SC income tax calculator', url: 'south-carolina-income-tax-calculator.html' },
            { name: 'Louisiana Tax', desc: 'LA income tax calculator', url: 'louisiana-income-tax-calculator.html' },
            { name: 'Alaska Tax', desc: 'AK income tax (no state tax)', url: 'alaska-income-tax-calculator.html' },
            { name: 'Arkansas Tax', desc: 'AR income tax calculator', url: 'arkansas-income-tax-calculator.html' },
            { name: 'Connecticut Tax', desc: 'CT income tax calculator', url: 'connecticut-income-tax-calculator.html' },
            { name: 'Delaware Tax', desc: 'DE income tax calculator', url: 'delaware-income-tax-calculator.html' },
            { name: 'Hawaii Tax', desc: 'HI income tax calculator', url: 'hawaii-income-tax-calculator.html' },
            { name: 'Idaho Tax', desc: 'ID income tax calculator', url: 'idaho-income-tax-calculator.html' },
            { name: 'Iowa Tax', desc: 'IA income tax calculator', url: 'iowa-income-tax-calculator.html' },
            { name: 'Kansas Tax', desc: 'KS income tax calculator', url: 'kansas-income-tax-calculator.html' },
            { name: 'Kentucky Tax', desc: 'KY income tax calculator', url: 'kentucky-income-tax-calculator.html' },
            { name: 'Maine Tax', desc: 'ME income tax calculator', url: 'maine-income-tax-calculator.html' },
            { name: 'Mississippi Tax', desc: 'MS income tax calculator', url: 'mississippi-income-tax-calculator.html' },
            { name: 'Montana Tax', desc: 'MT income tax calculator', url: 'montana-income-tax-calculator.html' },
            { name: 'Nebraska Tax', desc: 'NE income tax calculator', url: 'nebraska-income-tax-calculator.html' },
            { name: 'Nevada Tax', desc: 'NV income tax (no state tax)', url: 'nevada-income-tax-calculator.html' },
            { name: 'New Hampshire Tax', desc: 'NH income tax (no state tax)', url: 'new-hampshire-income-tax-calculator.html' },
            { name: 'New Mexico Tax', desc: 'NM income tax calculator', url: 'new-mexico-income-tax-calculator.html' },
            { name: 'North Dakota Tax', desc: 'ND income tax calculator', url: 'north-dakota-income-tax-calculator.html' },
            { name: 'Oklahoma Tax', desc: 'OK income tax calculator', url: 'oklahoma-income-tax-calculator.html' },
            { name: 'Oregon Tax', desc: 'OR income tax calculator', url: 'oregon-income-tax-calculator.html' },
            { name: 'Rhode Island Tax', desc: 'RI income tax calculator', url: 'rhode-island-income-tax-calculator.html' },
            { name: 'South Dakota Tax', desc: 'SD income tax (no state tax)', url: 'south-dakota-income-tax-calculator.html' },
            { name: 'Utah Tax', desc: 'UT income tax calculator', url: 'utah-income-tax-calculator.html' },
            { name: 'Vermont Tax', desc: 'VT income tax calculator', url: 'vermont-income-tax-calculator.html' },
            { name: 'West Virginia Tax', desc: 'WV income tax calculator', url: 'west-virginia-income-tax-calculator.html' },
            { name: 'Wyoming Tax', desc: 'WY income tax (no state tax)', url: 'wyoming-income-tax-calculator.html' },
        ]
    },
    {
        name: '🏘️ Real Estate Investment',
        id: 'real-estate',
        tools: [
            { name: 'Rental Property ROI', desc: 'Calculate cash flow & returns', url: 'calc/rental-property-roi-calculator.html' },
            { name: 'Cap Rate Calculator', desc: 'Capitalization rate for properties', url: 'calc/cap-rate-calculator.html' },
            { name: 'NOI Calculator', desc: 'Net operating income', url: 'calc/noi-calculator.html' },
            { name: 'Property Appreciation', desc: 'Real estate value growth', url: 'calc/real-estate-appreciation-calculator.html' },
            { name: 'House Flipping ROI', desc: 'Fix-and-flip profit calculator', url: 'calc/house-flipping-calculator.html' },
            { name: 'Mortgage Refinance', desc: 'Should you refinance?', url: 'calc/mortgage-refinance-calculator.html' },
        ]
    },
    {
        name: '🛡️ Insurance Calculators',
        id: 'insurance',
        tools: [
            { name: 'Car Insurance Cost', desc: 'Auto insurance premium estimator', url: 'car-insurance-calculator.html' },
            { name: 'Pet Insurance Cost', desc: 'Dog & cat insurance calculator', url: 'pet-insurance-calculator.html' },
            { name: 'Renters Insurance', desc: 'Renters insurance cost estimator', url: 'calc/renters-insurance-calculator.html' },
            { name: 'Motorcycle Insurance', desc: 'Bike insurance premium calculator', url: 'calc/motorcycle-insurance-calculator.html' },
        ]
    },
    {
        name: '💼 Business Calculators',
        id: 'business',
        tools: [
            { name: 'Business Valuation', desc: 'Calculate business worth', url: 'business-valuation-calculator.html' },
            { name: 'Break-Even Analysis', desc: 'When will you be profitable?', url: 'break-even-analysis-calculator.html' },
            { name: 'Startup Costs', desc: 'Total costs to start a business', url: 'startup-cost-calculator.html' },
            { name: 'Cash Flow', desc: 'Track business cash flow', url: 'cash-flow-calculator.html' },
            { name: 'Payroll Tax', desc: 'Employer payroll taxes', url: 'payroll-tax-calculator.html' },
            { name: 'Business Loan', desc: 'Loan payments for business', url: 'business-loan-calculator.html' },
            { name: 'Inventory Turnover', desc: 'Measure inventory efficiency', url: 'inventory-turnover-calculator.html' },
            { name: 'Freelance Rate', desc: 'Calculate your hourly rate', url: 'freelance-rate-calculator.html' },
            { name: 'Customer Lifetime Value', desc: 'CLV calculator', url: 'customer-lifetime-value-calculator.html' },
            { name: 'Conversion Rate', desc: 'Marketing conversion rates', url: 'conversion-rate-calculator.html' },
            { name: 'Gross Profit Margin', desc: 'Profit margin & markup', url: 'gross-profit-margin-calculator.html' },
            { name: 'Revenue per Employee', desc: 'Productivity measure', url: 'revenue-per-employee-calculator.html' },
        ]
    },
    {
        name: '₿ Cryptocurrency',
        id: 'crypto',
        tools: [
            { name: 'Bitcoin Profit', desc: 'BTC investment ROI calculator', url: 'bitcoin-profit-calculator.html' },
            { name: 'Ethereum Calculator', desc: 'ETH profit & conversion', url: 'ethereum-calculator.html' },
            { name: 'Crypto Tax', desc: 'Capital gains tax on crypto', url: 'crypto-tax-calculator.html' },
            { name: 'Crypto Mining', desc: 'Mining profitability calculator', url: 'crypto-mining-calculator.html' },
            { name: 'Dogecoin Calculator', desc: 'DOGE profit calculator', url: 'dogecoin-calculator.html' },
            { name: 'Crypto Portfolio', desc: 'Track portfolio value', url: 'crypto-portfolio-tracker.html' },
        ]
    },
    {
        name: '⚖️ Health & Fitness',
        id: 'health',
        tools: [
            { name: 'BMI Calculator', desc: 'Body Mass Index', url: 'calc/bmi-calculator.html' },
            { name: 'Calorie Calculator', desc: 'Daily calorie needs + macros', url: 'calc/calorie-calculator.html' },
            { name: 'Food Calorie Database', desc: 'Nutrition facts for 30+ foods', url: 'calc/food-calorie-calculator.html' },
            { name: 'Portion Size Calculator', desc: 'Meal prep serving sizes', url: 'calc/portion-size-calculator.html' },
            { name: 'Body Fat Calculator', desc: 'Navy method body fat %', url: 'calc/body-fat-calculator.html' },
            { name: 'Ideal Weight', desc: '4 medical formulas', url: 'calc/ideal-weight.html' },
            { name: 'Pregnancy Due Date', desc: 'Estimated delivery date', url: 'calc/pregnancy-due-date.html' },
            { name: 'BAC Calculator', desc: 'Blood alcohol level estimate', url: 'calc/bac-calculator.html' },
            { name: 'Sleep Calculator', desc: 'Optimal sleep cycle times', url: 'calc/sleep-calculator.html' },
            { name: 'Running Pace', desc: 'Pace, speed & race times', url: 'calc/pace-calculator.html' },
        ]
    },
    {
        name: '📐 Math & Science',
        id: 'math',
        tools: [
            { name: 'Fraction Calculator', desc: 'Add, subtract, multiply fractions', url: 'calc/fraction-calculator.html' },
            { name: 'Square Root', desc: 'Square & cube roots', url: 'calc/square-root-calculator.html' },
            { name: 'Scientific Notation', desc: 'Convert to/from sci notation', url: 'calc/scientific-notation.html' },
            { name: 'GPA Calculator', desc: 'Cumulative grade point average', url: 'calc/gpa-calculator.html' },
        ]
    },
    {
        name: '📏 Unit Converters',
        id: 'convert',
        tools: [
            { name: 'Inches ↔ CM', desc: 'Length conversion', url: 'calc/inches-to-cm.html' },
            { name: 'Pounds ↔ KG', desc: 'Weight conversion', url: 'calc/lbs-to-kg.html' },
            { name: '°F ↔ °C', desc: 'Temperature conversion', url: 'calc/fahrenheit-to-celsius.html' },
            { name: 'KM ↔ Miles', desc: 'Distance conversion', url: 'calc/km-to-miles.html' },
        ]
    },
    {
        name: '📐 Area Converters',
        id: 'area',
        tools: [
            { name: 'Sq Ft to Sq M', desc: 'Square feet to square meters', url: 'convert-square-feet-to-square-meters.html' },
            { name: 'Sq M to Sq Ft', desc: 'Square meters to square feet', url: 'convert-square-meters-to-square-feet.html' },
            { name: 'Acres to Sq Ft', desc: 'Acres to square feet', url: 'convert-acres-to-square-feet.html' },
            { name: 'Acres to Hectares', desc: 'Acres to hectares', url: 'convert-acres-to-hectares.html' },
            { name: 'Hectares to Acres', desc: 'Hectares to acres', url: 'convert-hectares-to-acres.html' },
            { name: 'Sq Yd to Sq Ft', desc: 'Square yards to square feet', url: 'convert-square-yards-to-square-feet.html' },
        ]
    },
    {
        name: '🚀 Speed Converters',
        id: 'speed',
        tools: [
            { name: 'MPH to KPH', desc: 'Miles per hour to km/h', url: 'convert-mph-to-kph.html' },
            { name: 'KPH to MPH', desc: 'Kilometers per hour to mph', url: 'convert-kph-to-mph.html' },
            { name: 'MPH to Knots', desc: 'Miles per hour to knots', url: 'convert-mph-to-knots.html' },
            { name: 'Knots to MPH', desc: 'Knots to miles per hour', url: 'convert-knots-to-mph.html' },
            { name: 'KPH to Knots', desc: 'Km/h to knots', url: 'convert-kph-to-knots.html' },
            { name: 'Mach to MPH', desc: 'Mach number to mph', url: 'convert-mach-to-mph.html' },
        ]
    },
    {
        name: '🚀 Speed Converters',
        id: 'speed',
        tools: [
            { name: 'MPH to KPH', desc: 'Miles per hour to kilometers per hour', url: 'convert-mph-to-kph.html' },
            { name: 'KPH to MPH', desc: 'Kilometers per hour to miles per hour', url: 'convert-kph-to-mph.html' },
            { name: 'MPH to Knots', desc: 'Miles per hour to knots', url: 'convert-mph-to-knots.html' },
            { name: 'Knots to MPH', desc: 'Knots to miles per hour', url: 'convert-knots-to-mph.html' },
            { name: 'M/S to MPH', desc: 'Meters per second to mph', url: 'convert-mps-to-mph.html' },
            { name: 'FPS to MPH', desc: 'Feet per second to mph', url: 'convert-fps-to-mph.html' },
        ]
    },
    {
        name: '💱 Currency Converter',
        id: 'currency',
        tools: [
            { name: 'USD to EUR', url: 'convert-usd-to-eur.html', desc: 'US Dollar → Euro' },
            { name: 'USD to GBP', url: 'convert-usd-to-gbp.html', desc: 'US Dollar → British Pound' },
            { name: 'USD to JPY', url: 'convert-usd-to-jpy.html', desc: 'US Dollar → Japanese Yen' },
            { name: 'USD to INR', url: 'convert-usd-to-inr.html', desc: 'US Dollar → Indian Rupee' },
            { name: 'EUR to GBP', url: 'convert-eur-to-gbp.html', desc: 'Euro → British Pound' },
            { name: 'GBP to USD', url: 'convert-gbp-to-usd.html', desc: 'British Pound → US Dollar' },
        ]
    },
    {
        name: '📅 Date & Time',
        id: 'datetime',
        tools: [
            { name: 'Age Calculator', desc: 'Your exact age', url: 'calc/age-calculator.html' },
            { name: 'Date Difference', desc: 'Days between dates', url: 'calc/date-difference.html' },
            { name: 'Days Until', desc: 'Countdown to any date', url: 'calc/days-until.html' },
            { name: 'Hours Calculator', desc: 'Time between hours', url: 'calc/hours-calculator.html' },
            { name: 'Time Zone Converter', desc: 'Convert world time zones', url: 'calc/time-zone-converter.html' },
            { name: 'Timezone Meeting Planner', desc: 'Schedule across time zones', url: 'timezone-meeting-planner.html' },
            { name: 'Countdown Timer', desc: 'Timer & stopwatch', url: 'calc/countdown-timer.html' },
        ]
    },
    {
        name: '🏠 Home & Auto',
        id: 'home',
        tools: [
            { name: 'Gas Mileage (MPG)', desc: 'Fuel economy calculator', url: 'calc/gas-mileage-calculator.html' },
            { name: 'Electricity Cost', desc: 'Appliance energy costs', url: 'calc/electricity-cost.html' },
            { name: 'Concrete Calculator', desc: 'How much concrete you need', url: 'calc/concrete-calculator.html' },
            { name: 'Screen Size', desc: 'TV & monitor dimensions', url: 'calc/screen-size-calculator.html' },
        ]
    },
    {
        name: '🛡️ Insurance Calculators',
        id: 'insurance',
        tools: [
            { name: 'Car Insurance', desc: 'Auto insurance cost estimator', url: 'car-insurance-estimator.html' },
            { name: 'Pet Insurance', desc: 'Dog & cat insurance costs', url: 'pet-insurance-calculator.html' },
            { name: 'Homeowners Insurance', desc: 'Home insurance premium calculator', url: 'homeowners-insurance-calculator.html' },
            { name: 'Renters Insurance', desc: 'Renters insurance estimator', url: 'renters-insurance-calculator.html' },
            { name: 'Motorcycle Insurance', desc: 'Bike insurance cost calculator', url: 'motorcycle-insurance-calculator.html' },
            { name: 'Boat Insurance', desc: 'Watercraft insurance estimator', url: 'boat-insurance-calculator.html' },
            { name: 'RV Insurance', desc: 'Motorhome insurance calculator', url: 'rv-insurance-calculator.html' },
            { name: 'Umbrella Insurance', desc: 'Liability coverage calculator', url: 'umbrella-insurance-calculator.html' },
            { name: 'Travel Insurance', desc: 'Trip insurance cost estimator', url: 'travel-insurance-calculator.html' },
            { name: 'Business Insurance', desc: 'Small business insurance calculator', url: 'business-insurance-calculator.html' },
            { name: 'Long-Term Care', desc: 'LTC insurance premium calculator', url: 'long-term-care-insurance-calculator.html' },
            { name: 'Flood Insurance', desc: 'Flood coverage cost calculator', url: 'flood-insurance-calculator.html' },
            { name: 'Earthquake Insurance', desc: 'Earthquake coverage calculator', url: 'earthquake-insurance-calculator.html' },
            { name: 'Workers Comp', desc: 'Workers compensation calculator', url: 'workers-comp-calculator.html' },
        ]
    },
    {
        name: '💰 Mortgage & Home Equity',
        id: 'mortgage-tools',
        tools: [
            { name: 'Mortgage Refinance', desc: 'Should you refinance? Break-even analysis', url: 'mortgage-refinance-calculator.html' },
            { name: 'HELOC Payment', desc: 'Home equity line of credit calculator', url: 'heloc-payment-calculator.html' },
        ]
    },
    {
        name: '🛡️ Insurance Calculators',
        id: 'insurance',
        tools: [
            { name: 'Car Insurance Cost', desc: 'Estimate auto insurance premiums', url: 'calc/car-insurance-estimator.html' },
            { name: 'Pet Insurance Cost', desc: 'Dog & cat insurance calculator', url: 'calc/pet-insurance-calculator.html' },
        ]
    },
    {
        name: '🍳 Cooking & Food',
        id: 'cooking',
        tools: [
            { name: 'Recipe Scaler', desc: 'Double, halve, or scale recipes', url: 'recipe-scaling-calculator.html' },
            { name: '°F to °C', desc: 'Fahrenheit to Celsius', url: 'convert-fahrenheit-to-celsius.html' },
            { name: '°C to °F', desc: 'Celsius to Fahrenheit', url: 'convert-celsius-to-fahrenheit.html' },
            { name: 'Cups to ML', desc: 'Cups to Milliliters', url: 'convert-cups-to-ml.html' },
            { name: 'ML to Cups', desc: 'Milliliters to Cups', url: 'convert-ml-to-cups.html' },
            { name: 'Tbsp to ML', desc: 'Tablespoons to Milliliters', url: 'convert-tablespoons-to-ml.html' },
            { name: 'Tsp to ML', desc: 'Teaspoons to Milliliters', url: 'convert-teaspoons-to-ml.html' },
            { name: 'Oz to Grams', desc: 'Ounces to Grams', url: 'convert-ounces-to-grams.html' },
            { name: 'Grams to Oz', desc: 'Grams to Ounces', url: 'convert-grams-to-ounces.html' },
            { name: 'Pounds to Grams', desc: 'Pounds to Grams', url: 'convert-pounds-to-grams.html' },
            { name: 'Pounds to KG', desc: 'Pounds to Kilograms', url: 'convert-pounds-to-kg.html' },
            { name: 'KG to Pounds', desc: 'Kilograms to Pounds', url: 'convert-kg-to-pounds.html' },
            { name: 'Cups to Tbsp', desc: 'Cups to Tablespoons', url: 'convert-cups-to-tablespoons.html' },
        ]
    },
    {
        name: '🏘️ Area Conversions',
        id: 'area',
        tools: [
            { name: 'Sq Ft to Sq M', desc: 'Square Feet to Square Meters', url: 'convert-square-feet-to-square-meters.html' },
            { name: 'Sq Ft to Acres', desc: 'Square Feet to Acres', url: 'convert-square-feet-to-acres.html' },
            { name: 'Sq M to Sq Ft', desc: 'Square Meters to Square Feet', url: 'convert-square-meters-to-square-feet.html' },
            { name: 'Sq M to Acres', desc: 'Square Meters to Acres', url: 'convert-square-meters-to-acres.html' },
            { name: 'Acres to Sq Ft', desc: 'Acres to Square Feet', url: 'convert-acres-to-square-feet.html' },
            { name: 'Acres to Sq M', desc: 'Acres to Square Meters', url: 'convert-acres-to-square-meters.html' },
            { name: 'Acres to Hectares', desc: 'Acres to Hectares', url: 'convert-acres-to-hectares.html' },
            { name: 'Hectares to Acres', desc: 'Hectares to Acres', url: 'convert-hectares-to-acres.html' },
            { name: 'Sq Miles to Acres', desc: 'Square Miles to Acres', url: 'convert-square-miles-to-acres.html' },
            { name: 'Sq KM to Sq Miles', desc: 'Square Kilometers to Square Miles', url: 'convert-square-kilometers-to-square-miles.html' },
        ]
    },
    {
        name: '💾 Data Storage',
        id: 'storage',
        tools: [
            { name: 'KB to MB', desc: 'Kilobytes to Megabytes', url: 'convert-kb-to-mb.html' },
            { name: 'MB to GB', desc: 'Megabytes to Gigabytes', url: 'convert-mb-to-gb.html' },
            { name: 'GB to TB', desc: 'Gigabytes to Terabytes', url: 'convert-gb-to-tb.html' },
            { name: 'MB to KB', desc: 'Megabytes to Kilobytes', url: 'convert-mb-to-kb.html' },
            { name: 'GB to MB', desc: 'Gigabytes to Megabytes', url: 'convert-gb-to-mb.html' },
            { name: 'TB to GB', desc: 'Terabytes to Gigabytes', url: 'convert-tb-to-gb.html' },
            { name: 'Bytes to KB', desc: 'Bytes to Kilobytes', url: 'convert-bytes-to-kb.html' },
            { name: 'Bytes to MB', desc: 'Bytes to Megabytes', url: 'convert-bytes-to-mb.html' },
        ]
    },
    {
        name: '🔧 Developer Tools',
        id: 'dev',
        tools: [
            { name: 'JSON Formatter', desc: 'Format & validate JSON', url: 'json-formatter.html' },
            { name: 'Base64 Encoder', desc: 'Encode/decode Base64', url: 'base64-encoder-decoder.html' },
            { name: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256', url: 'hash-generator.html' },
            { name: 'UUID Generator', desc: 'Generate unique IDs', url: 'uuid-generator.html' },
            { name: 'URL Encoder', desc: 'Encode/decode URLs', url: 'url-encoder-decoder.html' },
            { name: 'Regex Tester', desc: 'Test regular expressions', url: 'regex-tester.html' },
            { name: 'CSS Minifier', desc: 'Compress CSS code', url: 'css-minifier.html' },
            { name: 'JS Minifier', desc: 'Compress JavaScript', url: 'javascript-minifier.html' },
            { name: 'HTML Encoder', desc: 'Encode HTML entities', url: 'html-encoder.html' },
            { name: 'Diff Checker', desc: 'Compare two texts', url: 'diff-checker.html' },
            { name: 'Markdown Preview', desc: 'Live markdown renderer', url: 'markdown-preview.html' },
            { name: 'JSON to CSV', desc: 'Convert JSON to CSV', url: 'json-to-csv.html' },
        ]
    },
    {
        name: '✏️ Text & Writing',
        id: 'text',
        tools: [
            { name: 'Word Counter', desc: 'Words, characters, read time', url: 'calc/word-counter.html' },
            { name: 'Password Generator', desc: 'Strong secure passwords', url: 'calc/password-generator.html' },
            { name: 'Lorem Ipsum', desc: 'Generate placeholder text', url: 'lorem-ipsum-generator.html' },
            { name: 'QR Code Generator', desc: 'Create QR codes', url: 'qr-code-generator.html' },
            { name: 'HEX to RGB', desc: 'Color code converter', url: 'calc/hex-to-rgb.html' },
        ]
    },
    {
        name: '🎲 Fun & Viral',
        id: 'fun',
        tools: [
            { name: 'Love Calculator', desc: 'Name compatibility test 💕', url: 'calc/love-calculator.html' },
            { name: 'Name Generator', desc: 'Random names for anything', url: 'calc/name-generator.html' },
            { name: 'Random Number', desc: 'RNG, dice, coin flip', url: 'calc/random-number-generator.html' },
        ]
    },
];

const totalTools = categories.reduce((s, c) => s + c.tools.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ToolPulse — ${totalTools}+ Free Online Tools & Calculators</title>
<meta name="description" content="Free online calculators, converters, and developer tools. ${totalTools}+ tools including mortgage calculator, BMI calculator, currency converter, JSON formatter, and more. No signup required.">
<meta name="keywords" content="free online tools, online calculator, unit converter, currency converter, developer tools, BMI calculator, mortgage calculator">
<link rel="canonical" href="${BASE}/">
<meta property="og:title" content="ToolPulse — ${totalTools}+ Free Online Tools">
<meta property="og:description" content="Free calculators, converters, and tools. No signup, works in your browser.">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD}" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"ToolPulse","url":"${BASE}/","description":"${totalTools}+ free online tools and calculators","potentialAction":{"@type":"SearchAction","target":"${BASE}/?q={search_term_string}","query-input":"required name=search_term_string"}}</script>
<style>
:root{--bg:#0a0e1a;--s:#111827;--s2:#1f2937;--b:#374151;--t:#f3f4f6;--m:#9ca3af;--a:#6366f1;--a2:#4f46e5;--g:rgba(99,102,241,.08)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--t);line-height:1.6}
header{background:var(--s);border-bottom:1px solid var(--b);padding:1rem 1.5rem;position:sticky;top:0;z-index:100;backdrop-filter:blur(10px)}
.hi{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:1rem}
.logo{font-size:1.4rem;font-weight:800;color:var(--a);text-decoration:none}
.tag{color:var(--m);font-size:.85rem;flex:1}
.search-box{padding:.5rem 1rem;background:var(--s2);border:1px solid var(--b);border-radius:8px;color:var(--t);font-size:.9rem;width:280px;outline:none}
.search-box:focus{border-color:var(--a)}
.hero{text-align:center;padding:3rem 1.5rem 2rem;max-width:800px;margin:0 auto}
.hero h1{font-size:2.5rem;font-weight:900;margin-bottom:.5rem;background:linear-gradient(135deg,#f3f4f6,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{color:var(--m);font-size:1.1rem}
.hero .count{display:inline-block;background:var(--a);color:#fff;padding:.2rem .8rem;border-radius:20px;font-size:.85rem;font-weight:700;margin-top:.5rem}
.ad{max-width:1100px;margin:1rem auto;padding:0 1.5rem}
main{max-width:1100px;margin:0 auto;padding:0 1.5rem 3rem}
.cat{margin-bottom:2.5rem}
.cat h2{font-size:1.3rem;font-weight:700;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid var(--b)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.75rem}
.card{background:var(--s);border:1px solid var(--b);border-radius:10px;padding:1rem 1.25rem;text-decoration:none;color:var(--t);transition:all .2s}
.card:hover{border-color:var(--a);transform:translateY(-2px);background:var(--g)}
.card h3{font-size:.95rem;font-weight:600;margin-bottom:.25rem}
.card p{font-size:.8rem;color:var(--m);line-height:1.4}
.more-link{display:inline-block;margin-top:.75rem;color:var(--a);text-decoration:none;font-size:.85rem;font-weight:600}
.more-link:hover{text-decoration:underline}
.banner{background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:12px;padding:2rem;text-align:center;margin:2rem 0}
.banner h3{color:#fff;font-size:1.3rem;margin-bottom:.5rem}
.banner p{color:rgba(255,255,255,.8);margin-bottom:1rem;font-size:.9rem}
.banner a{display:inline-block;background:#fff;color:#4f46e5;font-weight:700;padding:.6rem 1.5rem;border-radius:8px;text-decoration:none}
footer{text-align:center;padding:2rem 1.5rem;color:var(--m);font-size:.8rem;border-top:1px solid var(--b)}
footer a{color:var(--a);text-decoration:none;margin:0 .5rem}
@media(max-width:600px){.hero h1{font-size:1.8rem}.search-box{width:150px}.grid{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<header><div class="hi">
<a href="index.html" class="logo">🔧 ToolPulse</a>
<span class="tag">${totalTools}+ Free Tools</span>
<input type="text" class="search-box" id="search" placeholder="Search tools..." oninput="filterTools()">
</div></header>

<div class="hero">
<h1>Free Online Tools & Calculators</h1>
<p>Financial calculators, unit converters, developer tools, and more — all free, no signup, works in your browser.</p>
<span class="count">${totalTools}+ tools available</span>
</div>

<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<main>
${categories.map(cat => `
<div class="cat" id="${cat.id}">
<h2>${cat.name}</h2>
<div class="grid">
${cat.tools.map(t => `<a class="card tool-card" href="${t.url}" data-name="${t.name.toLowerCase()} ${(t.desc||'').toLowerCase()}"><h3>${t.name}</h3><p>${t.desc || ''}</p></a>`).join('\n')}
</div>
${cat.id === 'currency' ? '<a class="more-link" href="convert-usd-to-eur.html">View all 240+ currency conversions →</a>' : ''}
</div>
`).join('\n')}

<div class="banner">
<h3>💰 Need Financial Calculators?</h3>
<p>18 specialized finance calculators — mortgage, insurance, tax, retirement, and more</p>
<a href="https://alexchalu.github.io/smartcalc/">Visit SmartCalc →</a>
</div>

<div class="cat">
<h2>📝 Guides & Articles</h2>
<div class="grid">
<a class="card" href="blog/how-to-create-a-budget.html"><h3>How to Create a Budget</h3><p>Complete step-by-step guide</p></a>
<a class="card" href="blog/how-to-calculate-bmi.html"><h3>How to Calculate BMI</h3><p>Formula, chart, and what it means</p></a>
<a class="card" href="blog/how-much-house-can-i-afford.html"><h3>How Much House Can I Afford?</h3><p>Home affordability guide 2026</p></a>
<a class="card" href="blog/how-to-save-money.html"><h3>35 Money-Saving Tips</h3><p>Save $500-$2000+/month</p></a>
<a class="card" href="blog/best-free-online-calculators.html"><h3>Best Free Calculators</h3><p>Curated list of top tools</p></a>
</div>
</div>
</main>

<div class="ad"><ins class="adsbygoogle" style="display:block" data-ad-client="${AD}" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>

<footer>
<p>ToolPulse — All tools run in your browser. 100% free, 100% private.</p>
<p><a href="index.html">Home</a><a href="blog/">Blog</a><a href="https://alexchalu.github.io/smartcalc/">SmartCalc</a><a href="https://alexchalu.github.io/focustab/">FocusTab</a></p>
<p style="margin-top:.5rem">© 2026 ToolPulse. All calculations are for informational purposes only.</p>
</footer>

<script>
function filterTools() {
    const q = document.getElementById('search').value.toLowerCase();
    document.querySelectorAll('.tool-card').forEach(card => {
        const match = card.dataset.name.includes(q);
        card.style.display = match ? '' : 'none';
    });
    document.querySelectorAll('.cat').forEach(cat => {
        const visible = cat.querySelectorAll('.tool-card:not([style*="display: none"])').length;
        cat.style.display = (visible > 0 || !q) ? '' : 'none';
    });
}
</script>
</body>
</html>`;

fs.writeFileSync(__dirname + '/index.html', html);
console.log(`✅ Homepage rebuilt with ${totalTools} tools across ${categories.length} categories`);
console.log('Categories:', categories.map(c => `${c.name} (${c.tools.length})`).join(', '));
