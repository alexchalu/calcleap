#!/bin/bash
# Submit top 50 high-value pages to IndexNow for fast indexing

# Top 50 high-CPC pages
TOP_PAGES=(
    "mortgage-calculator.html"
    "reverse-mortgage-calculator.html"
    "mortgage-refinance-calculator.html"
    "1099-tax-calculator.html"
    "401k-withdrawal-calculator.html"
    "car-insurance-calculator.html"
    "life-insurance-calculator.html"
    "home-insurance-calculator.html"
    "bmi-calculator.html"
    "income-tax-calculator.html"
    "california-income-tax-calculator.html"
    "new-york-income-tax-calculator.html"
    "texas-income-tax-calculator.html"
    "florida-income-tax-calculator.html"
    "pennsylvania-income-tax-calculator.html"
    "illinois-income-tax-calculator.html"
    "ohio-income-tax-calculator.html"
    "georgia-income-tax-calculator.html"
    "north-carolina-income-tax-calculator.html"
    "michigan-income-tax-calculator.html"
    "new-jersey-income-tax-calculator.html"
    "virginia-income-tax-calculator.html"
    "washington-income-tax-calculator.html"
    "massachusetts-income-tax-calculator.html"
    "arizona-income-tax-calculator.html"
    "tennessee-income-tax-calculator.html"
    "alabama-income-tax-calculator.html"
    "alaska-income-tax-calculator.html"
    "arkansas-income-tax-calculator.html"
    "colorado-income-tax-calculator.html"
    "connecticut-income-tax-calculator.html"
    "delaware-income-tax-calculator.html"
    "hawaii-income-tax-calculator.html"
    "percentage-calculator.html"
    "mortgage-payment.html"
    "401k-calculator.html"
    "retirement-calculator.html"
    "car-payment-calculator.html"
    "roth-ira-calculator.html"
    "student-loan-calculator.html"
    "compound-interest-calculator.html"
    "sales-tax-calculator.html"
    "payroll-tax-calculator.html"
    "social-security-calculator.html"
    "heloc-calculator.html"
    "refinance-calculator.html"
    "homeowners-insurance-calculator.html"
    "renters-insurance-calculator.html"
    "business-insurance-calculator.html"
    "property-tax.html"
)

# Build URL list
URL_LIST=""
for page in "${TOP_PAGES[@]}"; do
    URL_LIST="$URL_LIST\"https://calcleap.com/$page\","
done

# Remove trailing comma
URL_LIST=${URL_LIST%,}

# Submit to IndexNow
echo "Submitting top 50 pages to IndexNow..."
curl -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json" \
  -d "{\"host\":\"calcleap.com\",\"key\":\"a1b2c3d4e5f6g7h8\",\"urlList\":[$URL_LIST]}"

echo ""
echo "✅ IndexNow submission complete!"
