const fs = require('fs');
const path = require('path');

const dir = 'dui';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const states = [
  {ab:'AL',name:'Alabama',fines:'$600-$2,100',jail:'Up to 1 year',license:'90 days',sr22:'$1,800-$2,400/yr',avgCost:'$10,000-$15,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:'4th offense',minFine:600,maxFine:2100,jailMin:0,jailMax:365,suspDays:90,sr22Min:1800,sr22Max:2400,totalMin:10000,totalMax:15000,pop:'5.0M'},
  {ab:'AK',name:'Alaska',fines:'$1,500-$25,000',jail:'72 hrs - 1 year',license:'90 days',sr22:'$2,000-$3,000/yr',avgCost:'$15,000-$25,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'3rd offense',minFine:1500,maxFine:25000,jailMin:3,jailMax:365,suspDays:90,sr22Min:2000,sr22Max:3000,totalMin:15000,totalMax:25000,pop:'733K'},
  {ab:'AZ',name:'Arizona',fines:'$1,250-$3,250',jail:'10 days - 6 months',license:'90 days',sr22:'$2,200-$3,500/yr',avgCost:'$12,000-$20,000',bac:0.08,lookback:7,ignition:'Required (all)',felony:'3rd in 7 years',minFine:1250,maxFine:3250,jailMin:10,jailMax:180,suspDays:90,sr22Min:2200,sr22Max:3500,totalMin:12000,totalMax:20000,pop:'7.3M'},
  {ab:'AR',name:'Arkansas',fines:'$150-$5,000',jail:'24 hrs - 1 year',license:'120 days',sr22:'$1,500-$2,200/yr',avgCost:'$8,000-$14,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:'4th offense',minFine:150,maxFine:5000,jailMin:1,jailMax:365,suspDays:120,sr22Min:1500,sr22Max:2200,totalMin:8000,totalMax:14000,pop:'3.0M'},
  {ab:'CA',name:'California',fines:'$390-$5,000',jail:'96 hrs - 1 year',license:'6 months',sr22:'$2,500-$4,500/yr',avgCost:'$15,000-$25,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th in 10 years',minFine:390,maxFine:5000,jailMin:4,jailMax:365,suspDays:180,sr22Min:2500,sr22Max:4500,totalMin:15000,totalMax:25000,pop:'39.5M'},
  {ab:'CO',name:'Colorado',fines:'$600-$1,500',jail:'5 days - 1 year',license:'9 months',sr22:'$2,000-$3,000/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:0,ignition:'Required (all)',felony:'4th offense (lifetime)',minFine:600,maxFine:1500,jailMin:5,jailMax:365,suspDays:270,sr22Min:2000,sr22Max:3000,totalMin:10000,totalMax:18000,pop:'5.8M'},
  {ab:'CT',name:'Connecticut',fines:'$500-$8,000',jail:'48 hrs - 3 years',license:'45 days',sr22:'$2,200-$3,200/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'3rd offense',minFine:500,maxFine:8000,jailMin:2,jailMax:1095,suspDays:45,sr22Min:2200,sr22Max:3200,totalMin:12000,totalMax:22000,pop:'3.6M'},
  {ab:'DE',name:'Delaware',fines:'$500-$7,000',jail:'60 days - 5 years',license:'12 months',sr22:'$1,800-$2,800/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:10,ignition:'Required (1st+)',felony:'3rd in 10 years',minFine:500,maxFine:7000,jailMin:60,jailMax:1825,suspDays:365,sr22Min:1800,sr22Max:2800,totalMin:10000,totalMax:18000,pop:'990K'},
  {ab:'FL',name:'Florida',fines:'$500-$5,000',jail:'6 months - 5 years',license:'180 days',sr22:'$2,400-$4,000/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:0,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:500,maxFine:5000,jailMin:0,jailMax:1825,suspDays:180,sr22Min:2400,sr22Max:4000,totalMin:12000,totalMax:22000,pop:'22.2M'},
  {ab:'GA',name:'Georgia',fines:'$300-$5,000',jail:'10 days - 5 years',license:'120 days',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:10,ignition:'Required (1st+ high BAC)',felony:'4th in 10 years',minFine:300,maxFine:5000,jailMin:10,jailMax:1825,suspDays:120,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:18000,pop:'10.8M'},
  {ab:'HI',name:'Hawaii',fines:'$250-$5,000',jail:'48 hrs - 5 years',license:'90 days',sr22:'$1,200-$1,800/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:10,ignition:'Required (1st+)',felony:'Habitual offender',minFine:250,maxFine:5000,jailMin:2,jailMax:1825,suspDays:90,sr22Min:1200,sr22Max:1800,totalMin:8000,totalMax:15000,pop:'1.4M'},
  {ab:'ID',name:'Idaho',fines:'$1,000-$5,000',jail:'10 days - 10 years',license:'90 days',sr22:'$1,800-$2,600/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:10,ignition:'Required (1st+)',felony:'3rd in 10 years',minFine:1000,maxFine:5000,jailMin:10,jailMax:3650,suspDays:90,sr22Min:1800,sr22Max:2600,totalMin:10000,totalMax:18000,pop:'1.9M'},
  {ab:'IL',name:'Illinois',fines:'$500-$25,000',jail:'3-365 days',license:'6 months',sr22:'$2,200-$3,600/yr',avgCost:'$12,000-$25,000',bac:0.08,lookback:0,ignition:'Required (all)',felony:'3rd offense (Class 2)',minFine:500,maxFine:25000,jailMin:3,jailMax:365,suspDays:180,sr22Min:2200,sr22Max:3600,totalMin:12000,totalMax:25000,pop:'12.8M'},
  {ab:'IN',name:'Indiana',fines:'$500-$10,000',jail:'5 days - 3 years',license:'90 days',sr22:'$1,800-$2,800/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:0,ignition:'Required (2nd+)',felony:'2nd+ with prior',minFine:500,maxFine:10000,jailMin:5,jailMax:1095,suspDays:90,sr22Min:1800,sr22Max:2800,totalMin:10000,totalMax:18000,pop:'6.8M'},
  {ab:'IA',name:'Iowa',fines:'$625-$9,375',jail:'48 hrs - 5 years',license:'180 days',sr22:'$1,600-$2,400/yr',avgCost:'$9,000-$16,000',bac:0.08,lookback:12,ignition:'Required (all)',felony:'3rd offense',minFine:625,maxFine:9375,jailMin:2,jailMax:1825,suspDays:180,sr22Min:1600,sr22Max:2400,totalMin:9000,totalMax:16000,pop:'3.2M'},
  {ab:'KS',name:'Kansas',fines:'$750-$2,500',jail:'48 hrs - 1 year',license:'30 days',sr22:'$1,800-$2,600/yr',avgCost:'$9,000-$16,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd+ offense',minFine:750,maxFine:2500,jailMin:2,jailMax:365,suspDays:30,sr22Min:1800,sr22Max:2600,totalMin:9000,totalMax:16000,pop:'2.9M'},
  {ab:'KY',name:'Kentucky',fines:'$200-$10,000',jail:'48 hrs - 5 years',license:'120 days',sr22:'$1,600-$2,400/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'4th in 10 years',minFine:200,maxFine:10000,jailMin:2,jailMax:1825,suspDays:120,sr22Min:1600,sr22Max:2400,totalMin:8000,totalMax:15000,pop:'4.5M'},
  {ab:'LA',name:'Louisiana',fines:'$300-$5,000',jail:'10 days - 30 years',license:'90 days',sr22:'$2,200-$3,600/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'3rd offense',minFine:300,maxFine:5000,jailMin:10,jailMax:10950,suspDays:90,sr22Min:2200,sr22Max:3600,totalMin:10000,totalMax:20000,pop:'4.7M'},
  {ab:'ME',name:'Maine',fines:'$500-$5,000',jail:'48 hrs - 5 years',license:'150 days',sr22:'$1,400-$2,200/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:500,maxFine:5000,jailMin:2,jailMax:1825,suspDays:150,sr22Min:1400,sr22Max:2200,totalMin:8000,totalMax:15000,pop:'1.4M'},
  {ab:'MD',name:'Maryland',fines:'$500-$5,000',jail:'60 days - 5 years',license:'180 days',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$18,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th offense',minFine:500,maxFine:5000,jailMin:60,jailMax:1825,suspDays:180,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:18000,pop:'6.2M'},
  {ab:'MA',name:'Massachusetts',fines:'$500-$25,000',jail:'30 days - 5 years',license:'1 year',sr22:'$2,400-$3,800/yr',avgCost:'$15,000-$25,000',bac:0.08,lookback:0,ignition:'Required (2nd+)',felony:'3rd+ offense (lifetime)',minFine:500,maxFine:25000,jailMin:30,jailMax:1825,suspDays:365,sr22Min:2400,sr22Max:3800,totalMin:15000,totalMax:25000,pop:'7.0M'},
  {ab:'MI',name:'Michigan',fines:'$200-$5,000',jail:'72 hrs - 5 years',license:'180 days',sr22:'$2,400-$4,200/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:7,ignition:'Required (all)',felony:'3rd offense',minFine:200,maxFine:5000,jailMin:3,jailMax:1825,suspDays:180,sr22Min:2400,sr22Max:4200,totalMin:12000,totalMax:22000,pop:'10.0M'},
  {ab:'MN',name:'Minnesota',fines:'$300-$14,000',jail:'90 days - 7 years',license:'90 days',sr22:'$2,000-$3,000/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th in 10 years',minFine:300,maxFine:14000,jailMin:90,jailMax:2555,suspDays:90,sr22Min:2000,sr22Max:3000,totalMin:10000,totalMax:20000,pop:'5.7M'},
  {ab:'MS',name:'Mississippi',fines:'$250-$5,000',jail:'48 hrs - 5 years',license:'90 days',sr22:'$1,400-$2,200/yr',avgCost:'$7,000-$14,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:'3rd in 5 years',minFine:250,maxFine:5000,jailMin:2,jailMax:1825,suspDays:90,sr22Min:1400,sr22Max:2200,totalMin:7000,totalMax:14000,pop:'3.0M'},
  {ab:'MO',name:'Missouri',fines:'$500-$5,000',jail:'48 hrs - 7 years',license:'90 days',sr22:'$1,800-$2,800/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:'Persistent offender',minFine:500,maxFine:5000,jailMin:2,jailMax:2555,suspDays:90,sr22Min:1800,sr22Max:2800,totalMin:9000,totalMax:17000,pop:'6.2M'},
  {ab:'MT',name:'Montana',fines:'$600-$5,000',jail:'24 hrs - 5 years',license:'180 days',sr22:'$1,400-$2,200/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'4th offense',minFine:600,maxFine:5000,jailMin:1,jailMax:1825,suspDays:180,sr22Min:1400,sr22Max:2200,totalMin:8000,totalMax:15000,pop:'1.1M'},
  {ab:'NE',name:'Nebraska',fines:'$500-$10,000',jail:'7 days - 5 years',license:'180 days',sr22:'$1,600-$2,600/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:12,ignition:'Required (2nd+)',felony:'3rd offense',minFine:500,maxFine:10000,jailMin:7,jailMax:1825,suspDays:180,sr22Min:1600,sr22Max:2600,totalMin:9000,totalMax:17000,pop:'2.0M'},
  {ab:'NV',name:'Nevada',fines:'$400-$5,000',jail:'2 days - 6 years',license:'185 days',sr22:'$2,200-$3,400/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:7,ignition:'Required (all)',felony:'3rd in 7 years',minFine:400,maxFine:5000,jailMin:2,jailMax:2190,suspDays:185,sr22Min:2200,sr22Max:3400,totalMin:10000,totalMax:20000,pop:'3.1M'},
  {ab:'NH',name:'New Hampshire',fines:'$500-$4,000',jail:'21 days - 7 years',license:'180 days',sr22:'$1,600-$2,400/yr',avgCost:'$9,000-$16,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:500,maxFine:4000,jailMin:21,jailMax:2555,suspDays:180,sr22Min:1600,sr22Max:2400,totalMin:9000,totalMax:16000,pop:'1.4M'},
  {ab:'NJ',name:'New Jersey',fines:'$250-$10,000',jail:'48 hrs - 180 days',license:'7-12 months',sr22:'$2,800-$4,500/yr',avgCost:'$15,000-$28,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'No felony DUI',minFine:250,maxFine:10000,jailMin:2,jailMax:180,suspDays:300,sr22Min:2800,sr22Max:4500,totalMin:15000,totalMax:28000,pop:'9.3M'},
  {ab:'NM',name:'New Mexico',fines:'$500-$5,000',jail:'48 hrs - 3 years',license:'180 days',sr22:'$1,600-$2,600/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th offense',minFine:500,maxFine:5000,jailMin:2,jailMax:1095,suspDays:180,sr22Min:1600,sr22Max:2600,totalMin:9000,totalMax:17000,pop:'2.1M'},
  {ab:'NY',name:'New York',fines:'$500-$10,000',jail:'15 days - 7 years',license:'6 months',sr22:'$2,600-$4,500/yr',avgCost:'$15,000-$28,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'3rd in 10 years',minFine:500,maxFine:10000,jailMin:15,jailMax:2555,suspDays:180,sr22Min:2600,sr22Max:4500,totalMin:15000,totalMax:28000,pop:'20.2M'},
  {ab:'NC',name:'North Carolina',fines:'$200-$10,000',jail:'24 hrs - 3 years',license:'1 year',sr22:'$2,200-$3,600/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:7,ignition:'Required (2nd+)',felony:'Habitual offender',minFine:200,maxFine:10000,jailMin:1,jailMax:1095,suspDays:365,sr22Min:2200,sr22Max:3600,totalMin:10000,totalMax:20000,pop:'10.5M'},
  {ab:'ND',name:'North Dakota',fines:'$500-$2,000',jail:'2-365 days',license:'91 days',sr22:'$1,400-$2,200/yr',avgCost:'$7,000-$13,000',bac:0.08,lookback:7,ignition:'Required (2nd+)',felony:'3rd in 7 years',minFine:500,maxFine:2000,jailMin:2,jailMax:365,suspDays:91,sr22Min:1400,sr22Max:2200,totalMin:7000,totalMax:13000,pop:'779K'},
  {ab:'OH',name:'Ohio',fines:'$375-$10,500',jail:'3 days - 5 years',license:'1-3 years',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th in 10 years',minFine:375,maxFine:10500,jailMin:3,jailMax:1825,suspDays:500,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:20000,pop:'11.8M'},
  {ab:'OK',name:'Oklahoma',fines:'$1,000-$5,000',jail:'10 days - 5 years',license:'180 days',sr22:'$1,800-$2,800/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'2nd+ offense',minFine:1000,maxFine:5000,jailMin:10,jailMax:1825,suspDays:180,sr22Min:1800,sr22Max:2800,totalMin:9000,totalMax:17000,pop:'4.0M'},
  {ab:'OR',name:'Oregon',fines:'$1,000-$10,000',jail:'48 hrs - 5 years',license:'1 year',sr22:'$2,000-$3,200/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:0,ignition:'Required (all)',felony:'3rd+ offense (lifetime)',minFine:1000,maxFine:10000,jailMin:2,jailMax:1825,suspDays:365,sr22Min:2000,sr22Max:3200,totalMin:12000,totalMax:22000,pop:'4.2M'},
  {ab:'PA',name:'Pennsylvania',fines:'$300-$10,000',jail:'48 hrs - 5 years',license:'1 year',sr22:'$2,200-$3,600/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:300,maxFine:10000,jailMin:2,jailMax:1825,suspDays:365,sr22Min:2200,sr22Max:3600,totalMin:12000,totalMax:22000,pop:'13.0M'},
  {ab:'RI',name:'; Rhode Island',fsee:'$100-$5,000',jail:'10 days - 5 years',license:'90 days',sr22:'$1,600-$2,600/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:' 3rd offense',minFine:100,maxFine:5000,jailMin:10,jailMax:1825,suspDays:90,sr22Min:1600,sr22Max:2600,totalMin:9000,totalMax:17000,pop:'1.1M'},
  {ab:'SC',name:'South Carolina',fines:'$400-$10,000',jail:'48 hrs - 7 years',license:'6 months',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'4th offense',minFine:400,maxFine:10000,jailMin:2,jailMax:2555,suspDays:180,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:20000,pop:'5.1M'},
  {ab:'SD',name:'South Dakota',fines:'$500-$4,000',jail:'30 days - 5 years',license:'1 year',sr22:'$1,400-$2,200/yr',avgCost:'$7,000-$14,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:500,maxFine:4000,jailMin:30,jailMax:1825,suspDays:365,sr22Min:1400,sr22Max:2200,totalMin:7000,totalMax:14000,pop:'887K'},
  {ab:'TN',name:'Tennessee',fines:'$350-$15,000',jail:'48 hrs - 6 years',license:'1 year',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'4th offense',minFine:350,maxFine:15000,jailMin:2,jailMax:2190,suspDays:365,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:20000,pop:'6.9M'},
  {ab:'TX',name:'Texas',fines:'$2,000-$10,000',jail:'72 hrs - 10 years',license:'90-365 days',sr22:'$2,400-$4,000/yr',avgCost:'$12,000-$25,000',bac:0.08,lookback:0,ignition:'Required (2nd+)',felony:'3rd offense (lifetime)',minFine:2000,maxFine:10000,jailMin:3,jailMax:3650,suspDays:180,sr22Min:2400,sr22Max:4000,totalMin:12000,totalMax:25000,pop:'29.5M'},
  {ab:'UT',name:'Utah',fines:'$1,310-$2,850',jail:'48 hrs - 5 years',license:'120 days',sr22:'$1,800-$2,800/yr',avgCost:'$10,000-$18,000',bac:0.05,lookback:10,ignition:'Required (all)',felony:'3rd in 10 years',minFine:1310,maxFine:2850,jailMin:2,jailMax:1825,suspDays:120,sr22Min:1800,sr22Max:2800,totalMin:10000,totalMax:18000,pop:'3.3M'},
  {ab:'VT',name:'Vermont',fines:'$750-$3,000',jail:'48 hrs - 5 years',license:'90 days',sr22:'$1,400-$2,200/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:0,ignition:'Required (2nd+)',felony:'4th offense (lifetime)',minFine:750,maxFine:3000,jailMin:2,jailMax:1825,suspDays:90,sr22Min:1400,sr22Max:2200,totalMin:8000,totalMax:15000,pop:'643K'},
  {ab:'VA',name:'Virginia',fines:'$250-$2,500',jail:'5 days - 5 years',license:'1 year',sr22:'$2,200-$3,600/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (all)',felony:'3rd in 10 years',minFine:250,maxFine:2500,jailMin:5,jailMax:1825,suspDays:365,sr22Min:2200,sr22Max:3600,totalMin:10000,totalMax:20000,pop:'8.6M'},
  {ab:'WA',name:'Washington',fines:'$940-$10,000',jail:'1-365 days',license:'90 days',sr22:'$2,400-$3,800/yr',avgCost:'$12,000-$22,000',bac:0.08,lookback:7,ignition:'Required (all)',felony:'4th in 10 years',minFine:940,maxFine:10000,jailMin:1,jailMax:365,suspDays:90,sr22Min:2400,sr22Max:3800,totalMin:12000,totalMax:22000,pop:'7.6M'},
  {ab:'WV',name:'West Virginia',fines:'$100-$5,000',jail:'1-365 days',license:'6 months',sr22:'$1,600-$2,400/yr',avgCost:'$8,000-$15,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:100,maxFine:5000,jailMin:1,jailMax:365,suspDays:180,sr22Min:1600,sr22Max:2400,totalMin:8000,totalMax:15000,pop:'1.8M'},
  {ab:'WI',name:'Wisconsin',fines:'$150-$10,000',jail:'5 days - 6 years',license:'6-9 months',sr22:'$2,000-$3,200/yr',avgCost:'$10,000-$20,000',bac:0.08,lookback:10,ignition:'Required (1st+ >.15)',felony:'4th offense',minFine:150,maxFine:10000,jailMin:5,jailMax:2190,suspDays:210,sr22Min:2000,sr22Max:3200,totalMin:10000,totalMax:20000,pop:'5.9M'},
  {ab:'WY',name:'Wyoming',fines:'$750-$10,000',jail:'7 days - 7 years',license:'90 days',sr22:'$1,400-$2,200/yr',avgCost:'$8,000-$16,000',bac:0.08,lookback:10,ignition:'Required (2nd+)',felony:'3rd in 10 years',minFine:750,maxFine:10000,jailMin:7,jailMax:2555,suspDays:90,sr22Min:1400,sr22Max:2200,totalMin:8000,totalMax:16000,pop:'577K'}
];

// Fix RI
states[38] = {ab:'RI',name:'Rhode Island',fines:'$100-$5,000',jail:'10 days - 5 years',license:'90 days',sr22:'$1,600-$2,600/yr',avgCost:'$9,000-$17,000',bac:0.08,lookback:5,ignition:'Required (2nd+)',felony:'3rd offense',minFine:100,maxFine:5000,jailMin:10,jailMax:1825,suspDays:90,sr22Min:1600,sr22Max:2600,totalMin:9000,totalMax:17000,pop:'1.1M'};

const CSS = `*{margin:0;padding:0;box-sizing:border-box}
:root{--white:#fff;--bg:#f5f5f7;--surface:#fff;--border:rgba(0,0,0,.08);--border-hover:rgba(0,0,0,.15);--text:#1d1d1f;--text-2:#424245;--text-3:#86868b;--accent:#0071e3;--accent-hover:#0077ED;--accent-bg:rgba(0,113,227,.06);--shadow:0 2px 12px rgba(0,0,0,.06);--r:16px;--r-sm:12px;--r-xs:8px;--mw:980px;--font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',Arial,sans-serif}
body{font-family:var(--font);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;line-height:1.5}
a{color:inherit;text-decoration:none}
.nav{position:sticky;top:0;z-index:100;background:rgba(245,245,247,.8);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:var(--mw);margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0 2rem;height:48px}
.logo{font-size:1.1rem;font-weight:700;letter-spacing:-.02em}.logo span{color:var(--accent)}
.nav-links{display:flex;gap:.15rem}
.nav-links a{font-size:.8rem;color:var(--text-3);padding:.4rem .7rem;border-radius:6px;transition:all .15s}
.nav-links a:hover{color:var(--text);background:rgba(0,0,0,.04)}
.page{max-width:var(--mw);margin:0 auto;padding:0 2rem}
.breadcrumb{padding:1.25rem 0 .5rem;font-size:.8rem;color:var(--text-3)}
.breadcrumb a{color:var(--text-2)}.breadcrumb a:hover{color:var(--accent)}
.breadcrumb .sep{margin:0 .35rem;opacity:.4}
.page-title{font-size:2.25rem;font-weight:700;letter-spacing:-.04em;line-height:1.1;margin-bottom:.5rem}
.page-desc{font-size:1.05rem;color:var(--text-2);line-height:1.5;margin-bottom:2rem;max-width:600px}
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.card h2{font-size:1.1rem;font-weight:700;letter-spacing:-.02em;margin-bottom:1.25rem}
.form-group{display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem}
.form-group label{font-size:.78rem;font-weight:600;color:var(--text-2);letter-spacing:.02em;text-transform:uppercase}
.form-group select,.form-group input{padding:.7rem .85rem;font-size:.95rem;font-family:var(--font);background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);color:var(--text);outline:none;transition:all .2s}
.form-group select:focus,.form-group input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(0,113,227,.1);background:var(--white)}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.btn{display:inline-flex;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}
.btn:hover{background:var(--accent-hover);box-shadow:0 4px 12px rgba(0,113,227,.3)}
.results{display:none;margin-top:1.5rem}
.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;margin-bottom:1.5rem}
.result-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.25rem;text-align:center}
.result-card .label{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3);margin-bottom:.25rem}
.result-card .value{font-size:1.5rem;font-weight:800;letter-spacing:-.03em;color:var(--accent)}
.result-card .sub{font-size:.78rem;color:var(--text-3);margin-top:.15rem}
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.75rem;margin-bottom:1.5rem}
.stat-card{background:var(--accent-bg);border:1px solid rgba(0,113,227,.12);border-radius:var(--r-sm);padding:1rem;text-align:center}
.stat-card .val{font-size:1.3rem;font-weight:800;color:var(--accent)}
.stat-card .lbl{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--text-3);margin-top:.15rem}
.ad-slot{margin:1.5rem 0}
.info-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.75rem;margin-bottom:1.25rem;box-shadow:var(--shadow)}
.info-card h3{font-size:1rem;font-weight:700;letter-spacing:-.015em;margin-bottom:1rem}
.info-card p,.info-card li{font-size:.9rem;color:var(--text-2);line-height:1.6;margin-bottom:.5rem}
.info-card ul{padding-left:1.25rem}
.calc-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:2rem;box-shadow:var(--shadow);margin-bottom:1.5rem}
.calc-btn{display:inline-flex;padding:.75rem 2rem;font-size:.95rem;font-weight:600;font-family:var(--font);background:var(--accent);color:#fff;border:none;border-radius:var(--r-sm);cursor:pointer;transition:all .2s;margin-top:.5rem}
.input-group{display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem}
.input-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.radio-group{display:flex;gap:.5rem;flex-wrap:wrap}
.radio-label{padding:.5rem 1rem;border:1px solid var(--border);border-radius:var(--r-xs);font-size:.85rem;cursor:pointer;transition:all .2s}
.radio-label:hover{border-color:var(--accent)}
.radio-label.active{background:var(--accent-bg);border-color:var(--accent);color:var(--accent)}
.result-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:1.5rem;margin-top:1rem}
.result-row{display:flex;justify-content:space-between;padding:.5rem 0;border-bottom:1px solid var(--border)}
.result-row:last-child{border:none}
.result-value{font-weight:700;color:var(--accent)}
.converter-box{background:var(--white);padding:1.5rem;border-radius:var(--r);border:1px solid var(--border)}
.swap-btn{background:var(--accent-bg);border:1px solid rgba(0,113,227,.12);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}
.rate-display{font-size:.85rem;color:var(--text-3);text-align:center;margin:.5rem 0}
.conversion-table{width:100%;border-collapse:collapse}
.conversion-table th,.conversion-table td{padding:.6rem;text-align:left;border-bottom:1px solid var(--border);font-size:.85rem}
.tool-card{background:var(--white);border:1px solid var(--border);border-radius:var(--r);padding:1.5rem;transition:all .2s}
.tool-card:hover{border-color:var(--accent);box-shadow:0 4px 16px rgba(0,113,227,.1)}
.tool-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem}
.tool-content{flex:1}
.output-area{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-sm);padding:1rem;margin-top:.75rem}
.bar{background:var(--bg);border-radius:4px;height:24px;overflow:hidden;margin:.25rem 0}
.bar-fill{height:100%;border-radius:4px;background:var(--accent);transition:width .5s}
.bar-label{font-size:.78rem;color:var(--text-3)}
.badge{display:inline-block;padding:.15rem .5rem;border-radius:4px;font-size:.72rem;font-weight:600}
.field{display:flex;flex-direction:column;gap:.3rem;margin-bottom:1rem}
.row{display:flex;gap:1rem;align-items:center}
.toggle-group{display:flex;gap:.25rem;background:var(--bg);border-radius:var(--r-xs);padding:.2rem}
.toggle-btn{padding:.4rem .8rem;border:none;background:transparent;border-radius:6px;font-size:.82rem;cursor:pointer;transition:all .2s}
.toggle-btn.active{background:var(--white);box-shadow:var(--shadow)}
.tab-btn{padding:.5rem 1rem;border:1px solid var(--border);background:var(--white);border-radius:var(--r-xs);font-size:.85rem;cursor:pointer;transition:all .2s}
.tab-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}
.related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.5rem;margin-top:.75rem}
.related-grid a{display:block;padding:.6rem .85rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.82rem;font-weight:500;color:var(--text-2);transition:all .15s}
.related-grid a:hover{border-color:var(--accent);color:var(--accent);background:var(--accent-bg)}
.faq-item{border-bottom:1px solid var(--border);padding:1rem 0}
.faq-item:last-child{border:none}
.faq-q{font-weight:700;font-size:.92rem;margin-bottom:.5rem;color:var(--text)}
.faq-a{font-size:.88rem;color:var(--text-2);line-height:1.6}
.footer{background:var(--white);border-top:1px solid var(--border);margin-top:3rem;padding:2.5rem 2rem}
.footer-inner{max-width:var(--mw);margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;font-size:.8rem;color:var(--text-3)}
.footer-col h4{font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:.75rem;color:var(--text-2)}
.footer-col a{display:block;padding:.2rem 0;color:var(--text-3);transition:color .15s}
.footer-col a:hover{color:var(--accent)}
.footer-bottom{text-align:center;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border);font-size:.75rem}
@media(max-width:768px){.page-title{font-size:1.5rem}.form-row,.input-grid{grid-template-columns:1fr}.result-grid{grid-template-columns:1fr}.stat-grid{grid-template-columns:repeat(2,1fr)}.footer-inner{grid-template-columns:repeat(2,1fr)}}`;

const NAV = `<nav class="nav"><div class="nav-inner"><a class="logo" href="/">Calc<span>Leap</span></a><div class="nav-links"><a href="/">Home</a><a href="/auto-insurance/">Auto Insurance</a><a href="/life-insurance/">Life Insurance</a></div></div></nav>`;

const FOOTER = `<footer class="footer"><div class="footer-inner"><div class="footer-col"><h4>Calculators</h4><a href="/auto-insurance/">Auto Insurance</a><a href="/life-insurance/">Life Insurance</a><a href="/home-insurance/">Home Insurance</a><a href="/health-insurance/">Health Insurance</a></div><div class="footer-col"><h4>By State</h4><a href="/dui/">DUI Costs</a><a href="/workers-comp/">Workers' Comp</a><a href="/disability-insurance/">Disability Insurance</a><a href="/social-security/">Social Security</a></div><div class="footer-col"><h4>Resources</h4><a href="/529/">529 Plans</a><a href="/childcare/">Childcare Costs</a><a href="/nursing-home/">Nursing Home</a><a href="/medicaid/">Medicaid</a></div><div class="footer-col"><h4>About</h4><a href="/about.html">About CalcLeap</a><a href="/privacy.html">Privacy Policy</a><a href="/contact.html">Contact</a></div></div><div class="footer-bottom">© 2026 CalcLeap. Free financial calculators and tools.</div></footer>`;

const AD = `<div class="ad-slot"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-3112605892426625" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>`;

function slug(name) {
  return name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z-]/g,'');
}

// Generate state pages
for (const s of states) {
  const sl = slug(s.name);
  const fname = `${sl}-dui-cost-calculator.html`;
  const url = `https://calcleap.com/dui/${fname}`;
  const otherStates = states.filter(x => x.ab !== s.ab).sort(() => Math.random() - 0.5).slice(0, 8);
  
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.name} DUI Cost Calculator — Fines, Penalties & Total Expenses | CalcLeap</title>
<meta name="description" content="Calculate the total cost of a DUI in ${s.name}. Fines: ${s.fines}. License suspension: ${s.license}. SR-22 insurance: ${s.sr22}. Total estimated cost: ${s.avgCost}.">
<link rel="canonical" href="${url}">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<meta property="og:title" content="${s.name} DUI Cost Calculator — CalcLeap">
<meta property="og:description" content="Estimate total DUI costs in ${s.name}. Fines, attorney fees, insurance increases, and more.">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebApplication","name":"${s.name} DUI Cost Calculator","description":"Calculate the total cost of a DUI in ${s.name} including fines, attorney fees, insurance increases, and other expenses.","url":"${url}","applicationCategory":"FinanceApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<style>${CSS}</style>
</head>
<body>
${NAV}
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span><a href="/dui/">DUI Costs</a><span class="sep">›</span>${s.name}</div>
<h1 class="page-title">${s.name} DUI Cost Calculator</h1>
<p class="page-desc">Estimate the total financial impact of a DUI in ${s.name}. Calculate fines, attorney fees, insurance increases, and all associated costs. BAC limit: ${s.bac}. Lookback period: ${s.lookback === 0 ? 'Lifetime' : s.lookback + ' years'}.</p>

<div class="stat-grid">
<div class="stat-card"><div class="val">${s.fines}</div><div class="lbl">Court Fines</div></div>
<div class="stat-card"><div class="val">${s.license}</div><div class="lbl">License Suspension</div></div>
<div class="stat-card"><div class="val">${s.sr22}</div><div class="lbl">SR-22 Insurance</div></div>
<div class="stat-card"><div class="val">${s.avgCost}</div><div class="lbl">Total Est. Cost</div></div>
</div>

${AD}

<div class="card">
<h2>Calculate Your DUI Costs in ${s.name}</h2>
<div class="form-row">
<div class="form-group"><label>Offense Number</label><select id="offense"><option value="1">1st Offense</option><option value="2">2nd Offense</option><option value="3">3rd Offense</option></select></div>
<div class="form-group"><label>BAC Level</label><select id="bac"><option value="low">0.08 - 0.14 (Standard)</option><option value="high">0.15 - 0.19 (High)</option><option value="extreme">0.20+ (Extreme)</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Accident Involved?</label><select id="accident"><option value="no">No Accident</option><option value="property">Property Damage</option><option value="injury">Injury Accident</option></select></div>
<div class="form-group"><label>Attorney Representation</label><select id="attorney"><option value="public">Public Defender</option><option value="private">Private Attorney ($3,000-$10,000)</option><option value="trial">Trial Attorney ($10,000-$25,000)</option></select></div>
</div>
<div class="form-row">
<div class="form-group"><label>Bail/Bond Cost</label><select id="bail"><option value="500">$500 (Minor)</option><option value="2500">$2,500 (Standard)</option><option value="5000">$5,000 (High BAC)</option><option value="10000">$10,000+ (Accident)</option></select></div>
<div class="form-group"><label>Towing & Impound</label><select id="tow"><option value="300">$300 (1 day)</option><option value="600">$600 (3 days)</option><option value="1200">$1,200 (7 days)</option></select></div>
</div>
<button class="btn" onclick="calculate()">Calculate Total DUI Cost</button>
<div class="results" id="results">
<div class="result-grid">
<div class="result-card"><div class="label">Total Estimated Cost</div><div class="value" id="totalCost">$0</div><div class="sub">All expenses combined</div></div>
<div class="result-card"><div class="label">Insurance Increase</div><div class="value" id="insuranceIncrease">$0</div><div class="sub">Over 3 years</div></div>
<div class="result-card"><div class="label">Court & Legal</div><div class="value" id="courtLegal">$0</div><div class="sub">Fines + attorney</div></div>
</div>
<div id="breakdown"></div>
</div>
</div>

${AD}

<div class="info-card">
<h3>🚨 ${s.name} DUI Laws & Penalties</h3>
<p>${s.name} takes DUI offenses seriously. Here's what you need to know about ${s.name}'s DUI laws:</p>
<ul>
<li><strong>BAC Limit:</strong> ${s.bac} (${s.bac < 0.08 ? 'stricter than most states' : 'standard legal limit'})</li>
<li><strong>Lookback Period:</strong> ${s.lookback === 0 ? 'Lifetime — prior DUIs never expire' : s.lookback + ' years — prior DUIs count within this window'}</li>
<li><strong>Court Fines (1st offense):</strong> ${s.fines}</li>
<li><strong>Jail Time:</strong> ${s.jail}</li>
<li><strong>License Suspension (1st):</strong> ${s.license}</li>
<li><strong>Ignition Interlock:</strong> ${s.ignition}</li>
<li><strong>Felony DUI:</strong> ${s.felony}</li>
<li><strong>SR-22 Insurance Required:</strong> Yes, for 3 years minimum</li>
</ul>
</div>

<div class="info-card">
<h3>💰 Complete DUI Cost Breakdown in ${s.name}</h3>
<p>A DUI in ${s.name} costs far more than just the court fine. The total financial impact typically ranges from <strong>${s.avgCost}</strong> for a first offense. Here's where the money goes:</p>
<ul>
<li><strong>Court Fines & Penalties:</strong> ${s.fines} — The base fine, plus surcharges, assessments, and fees that can double or triple the stated amount</li>
<li><strong>Attorney Fees:</strong> $3,000 - $25,000 — A private DUI attorney in ${s.name} typically charges $3,000-$10,000 for a plea deal, or $10,000-$25,000 for a trial</li>
<li><strong>SR-22 Insurance:</strong> ${s.sr22} — Required for 3+ years, adding $5,000-$12,000 to your total insurance costs</li>
<li><strong>Ignition Interlock Device:</strong> $1,200 - $3,000/year — ${s.ignition}. Installation: $70-$150. Monthly monitoring: $60-$80</li>
<li><strong>DUI Classes:</strong> $500 - $2,500 — Mandatory alcohol education programs in ${s.name}</li>
<li><strong>License Reinstatement:</strong> $100 - $500 — Fee to get your license back after suspension</li>
<li><strong>Bail/Bond:</strong> $500 - $10,000 — Depends on BAC level and circumstances</li>
<li><strong>Towing & Impound:</strong> $300 - $2,000 — Vehicle towing and impound fees</li>
<li><strong>Lost Income:</strong> $1,000 - $10,000+ — Missed work for court dates, classes, and jail time</li>
</ul>
</div>

<div class="info-card">
<h3>📊 ${s.name} DUI Statistics</h3>
<ul>
<li><strong>Population:</strong> ${s.pop}</li>
<li><strong>BAC Limit:</strong> ${s.bac}${s.bac === 0.05 ? ' (lowest in the nation — Utah)' : ''}</li>
<li><strong>Lookback Period:</strong> ${s.lookback === 0 ? 'Lifetime' : s.lookback + ' years'}</li>
<li><strong>Felony DUI Threshold:</strong> ${s.felony}</li>
<li><strong>Ignition Interlock:</strong> ${s.ignition}</li>
<li><strong>License Suspension (1st):</strong> ${s.license}</li>
</ul>
</div>

${AD}

<div class="info-card">
<h3>🛡️ 5 Steps After a DUI Arrest in ${s.name}</h3>
<ul>
<li><strong>1. Request a DMV Hearing:</strong> You typically have 10-30 days to request a hearing to contest your license suspension in ${s.name}. Missing this deadline means automatic suspension.</li>
<li><strong>2. Hire a DUI Attorney:</strong> An experienced ${s.name} DUI lawyer can potentially reduce charges, negotiate plea deals, or identify procedural errors that could dismiss the case.</li>
<li><strong>3. Attend All Court Dates:</strong> Missing a court date in ${s.name} will result in a bench warrant and additional charges. Mark every date on your calendar.</li>
<li><strong>4. Complete Required Programs:</strong> ${s.name} requires completion of alcohol education or treatment programs. Start early — courts look favorably on proactive completion.</li>
<li><strong>5. Get SR-22 Insurance:</strong> Contact your insurance company or shop for new coverage. SR-22 filing is required in ${s.name} for at least 3 years. Compare rates — they vary significantly between insurers.</li>
</ul>
</div>

<div class="info-card">
<h3>❓ ${s.name} DUI FAQ</h3>
<div class="faq-item"><div class="faq-q">How much does a DUI cost in ${s.name}?</div><div class="faq-a">The total cost of a first-offense DUI in ${s.name} typically ranges from ${s.avgCost}, including fines (${s.fines}), attorney fees ($3,000-$10,000), SR-22 insurance increases (${s.sr22}), DUI classes, and other expenses.</div></div>
<div class="faq-item"><div class="faq-q">How long does a DUI stay on your record in ${s.name}?</div><div class="faq-a">${s.name} has a ${s.lookback === 0 ? 'lifetime' : s.lookback + '-year'} lookback period for DUI offenses. This means ${s.lookback === 0 ? 'any prior DUI will count as a prior offense regardless of when it occurred' : 'prior DUIs within ' + s.lookback + ' years will be counted when determining penalties for subsequent offenses'}. A DUI conviction typically stays on your driving record for 5-10 years.</div></div>
<div class="faq-item"><div class="faq-q">Do I need SR-22 insurance after a DUI in ${s.name}?</div><div class="faq-a">Yes. ${s.name} requires SR-22 insurance filing for a minimum of 3 years after a DUI conviction. SR-22 is a certificate proving you carry minimum liability coverage. Expect to pay ${s.sr22} more per year for insurance with an SR-22 filing.</div></div>
<div class="faq-item"><div class="faq-q">Can I get a hardship license in ${s.name} after a DUI?</div><div class="faq-a">${s.name} may offer a restricted/hardship license for work or essential travel during your suspension period. Requirements typically include installing an ignition interlock device and completing certain conditions. Consult a ${s.name} DUI attorney for specific eligibility.</div></div>
<div class="faq-item"><div class="faq-q">Is a first DUI a felony in ${s.name}?</div><div class="faq-a">A first-offense DUI in ${s.name} is typically a misdemeanor. It becomes a felony at: ${s.felony}. However, any DUI involving serious injury or death can be charged as a felony regardless of offense number.</div></div>
<div class="faq-item"><div class="faq-q">What is the BAC limit in ${s.name}?</div><div class="faq-a">The legal BAC limit in ${s.name} is ${s.bac} for drivers 21 and over. For commercial drivers, the limit is 0.04. For drivers under 21, ${s.name} has a zero-tolerance policy (typically 0.02 or lower).</div></div>
</div>

<div class="info-card">
<h3>🔗 DUI Costs in Other States</h3>
<div class="related-grid">
${otherStates.map(o => `<a href="${slug(o.name)}-dui-cost-calculator.html">${o.name} — ${o.avgCost}</a>`).join('\n')}
<a href="/dui/">View All 50 States →</a>
</div>
</div>
</div>

${FOOTER}

<script>
function calculate(){
  const offense = parseInt(document.getElementById('offense').value);
  const bac = document.getElementById('bac').value;
  const accident = document.getElementById('accident').value;
  const attorney = document.getElementById('attorney').value;
  const bail = parseInt(document.getElementById('bail').value);
  const tow = parseInt(document.getElementById('tow').value);

  // Base fines by offense
  let fineMin = ${s.minFine}, fineMax = ${s.maxFine};
  if(offense === 2) { fineMin *= 1.8; fineMax *= 1.8; }
  if(offense === 3) { fineMin *= 3; fineMax *= 3; }

  // BAC multiplier
  let bacMult = 1;
  if(bac === 'high') bacMult = 1.5;
  if(bac === 'extreme') bacMult = 2;

  // Court fines + surcharges (typically 2-3x base fine)
  const courtFine = Math.round((fineMin + fineMax) / 2 * bacMult * 2);

  // Attorney
  let attorneyFee = 0;
  if(attorney === 'public') attorneyFee = 500;
  if(attorney === 'private') attorneyFee = 6500;
  if(attorney === 'trial') attorneyFee = 17500;

  // SR-22 insurance increase (3 years)
  let sr22Avg = (${s.sr22Min} + ${s.sr22Max}) / 2;
  let insuranceTotal = Math.round(sr22Avg * 3 * bacMult);

  // Ignition interlock
  let iid = offense >= 2 ? 2400 : 1200;

  // DUI classes
  let classes = offense === 1 ? 800 : (offense === 2 ? 1500 : 2500);

  // License reinstatement
  let reinstate = 250;

  // Accident costs
  let accidentCost = 0;
  if(accident === 'property') accidentCost = 3000;
  if(accident === 'injury') accidentCost = 15000;

  // Lost income
  let lostIncome = offense === 1 ? 2000 : (offense === 2 ? 5000 : 10000);

  const total = courtFine + attorneyFee + bail + tow + insuranceTotal + iid + classes + reinstate + accidentCost + lostIncome;

  document.getElementById('totalCost').textContent = '$' + total.toLocaleString();
  document.getElementById('insuranceIncrease').textContent = '$' + insuranceTotal.toLocaleString();
  document.getElementById('courtLegal').textContent = '$' + (courtFine + attorneyFee).toLocaleString();

  document.getElementById('breakdown').innerHTML = '<div class="result-box"><h3 style="font-size:.95rem;margin-bottom:.75rem">Detailed Cost Breakdown</h3>' +
    '<div class="result-row"><span>Court Fines & Surcharges</span><span class="result-value">$' + courtFine.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>Attorney Fees</span><span class="result-value">$' + attorneyFee.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>Bail/Bond</span><span class="result-value">$' + bail.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>Towing & Impound</span><span class="result-value">$' + tow.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>SR-22 Insurance (3 years)</span><span class="result-value">$' + insuranceTotal.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>Ignition Interlock Device</span><span class="result-value">$' + iid.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>DUI Classes</span><span class="result-value">$' + classes.toLocaleString() + '</span></div>' +
    '<div class="result-row"><span>License Reinstatement</span><span class="result-value">$' + reinstate.toLocaleString() + '</span></div>' +
    (accidentCost > 0 ? '<div class="result-row"><span>Accident Costs</span><span class="result-value">$' + accidentCost.toLocaleString() + '</span></div>' : '') +
    '<div class="result-row"><span>Lost Income (estimated)</span><span class="result-value">$' + lostIncome.toLocaleString() + '</span></div>' +
    '<div class="result-row" style="border-top:2px solid var(--accent);margin-top:.5rem;padding-top:.75rem"><strong>TOTAL ESTIMATED COST</strong><span class="result-value" style="font-size:1.2rem">$' + total.toLocaleString() + '</span></div></div>';

  // Bar chart
  const items = [
    {label:'SR-22 Insurance',val:insuranceTotal},
    {label:'Court Fines',val:courtFine},
    {label:'Attorney',val:attorneyFee},
    {label:'Ignition Interlock',val:iid},
    {label:'Lost Income',val:lostIncome},
    {label:'DUI Classes',val:classes},
    {label:'Bail/Bond',val:bail},
    {label:'Towing',val:tow}
  ].sort((a,b) => b.val - a.val);
  const maxVal = items[0].val;
  let chart = '<div style="margin-top:1.5rem"><h3 style="font-size:.95rem;margin-bottom:.75rem">Cost Distribution</h3>';
  items.forEach(item => {
    const pct = Math.round(item.val / maxVal * 100);
    chart += '<div class="bar-label">' + item.label + ' — $' + item.val.toLocaleString() + '</div><div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>';
  });
  chart += '</div>';
  document.getElementById('breakdown').innerHTML += chart;

  document.getElementById('results').style.display = 'block';
}
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, fname), html);
}

// Generate index page
const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DUI Cost Calculator by State — Fines, Penalties & Total Expenses All 50 States | CalcLeap</title>
<meta name="description" content="Calculate the total cost of a DUI in every US state. Compare fines, penalties, insurance increases, and total expenses. Free DUI cost calculators for all 50 states.">
<link rel="canonical" href="https://calcleap.com/dui/">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3112605892426625" crossorigin="anonymous"></script>
<style>${CSS}</style>
</head>
<body>
${NAV}
<div class="page">
<div class="breadcrumb"><a href="/">Home</a><span class="sep">›</span>DUI Costs</div>
<h1 class="page-title">DUI Cost Calculator by State</h1>
<p class="page-desc">Compare the true cost of a DUI across all 50 states. Select your state to calculate fines, attorney fees, insurance increases, and total expenses.</p>

<div class="stat-grid">
<div class="stat-card"><div class="val">$7,000-$28,000</div><div class="lbl">Cost Range (1st Offense)</div></div>
<div class="stat-card"><div class="val">$40-$100+</div><div class="lbl">CPC Value</div></div>
<div class="stat-card"><div class="val">50</div><div class="lbl">State Calculators</div></div>
<div class="stat-card"><div class="val">Free</div><div class="lbl">Instant Estimates</div></div>
</div>

${AD}

<div class="card">
<h2>Select Your State</h2>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.5rem">
${states.map(s => `<a href="${slug(s.name)}-dui-cost-calculator.html" style="display:flex;justify-content:space-between;padding:.75rem .85rem;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-xs);font-size:.85rem;font-weight:500;color:var(--text-2);transition:all .15s"><span>${s.name}</span><span style="color:var(--accent);font-weight:700">${s.avgCost}</span></a>`).join('\n')}
</div>
</div>

${AD}

<div class="info-card">
<h3>🚨 Most Expensive States for DUI</h3>
<ul>
<li><strong>New Jersey:</strong> $15,000-$28,000 — Highest insurance surcharges in the nation</li>
<li><strong>New York:</strong> $15,000-$28,000 — High fines plus mandatory surcharges</li>
<li><strong>California:</strong> $15,000-$25,000 — Penalty assessments can triple base fines</li>
<li><strong>Massachusetts:</strong> $15,000-$25,000 — Lifetime lookback period</li>
<li><strong>Alaska:</strong> $15,000-$25,000 — High base fines + remote towing costs</li>
</ul>
</div>

<div class="info-card">
<h3>💡 Least Expensive States for DUI (Still Costly)</h3>
<ul>
<li><strong>Mississippi:</strong> $7,000-$14,000 — Lowest base fines</li>
<li><strong>North Dakota:</strong> $7,000-$13,000 — Lower insurance impacts</li>
<li><strong>South Dakota:</strong> $7,000-$14,000 — Lower cost of living</li>
<li><strong>Arkansas:</strong> $8,000-$14,000 — Lower attorney fees</li>
<li><strong>Hawaii:</strong> $8,000-$15,000 — Lower SR-22 costs</li>
</ul>
</div>

<div class="info-card">
<h3>📊 State DUI Law Comparison</h3>
<p><strong>Strictest BAC Limit:</strong> Utah (0.05 — only state below 0.08)</p>
<p><strong>Lifetime Lookback:</strong> Colorado, Florida, Illinois, Indiana, Massachusetts, Oregon, Vermont (prior DUIs never expire)</p>
<p><strong>Mandatory Ignition Interlock (All Offenses):</strong> Alaska, Arizona, California, Colorado, Connecticut, Hawaii, Idaho, Illinois, Iowa, Louisiana, Maryland, Michigan, Minnesota, Nevada, New Jersey, New Mexico, New York, Ohio, Oregon, Tennessee, Utah, Virginia, Washington</p>
<p><strong>No Felony DUI Statute:</strong> New Jersey (DUI is always a traffic offense, though penalties are severe)</p>
</div>

${AD}

<div class="info-card">
<h3>❓ Frequently Asked Questions</h3>
<div class="faq-item"><div class="faq-q">How much does a first DUI cost?</div><div class="faq-a">The total cost of a first DUI ranges from $7,000 to $28,000 depending on your state, BAC level, whether there was an accident, and attorney fees. The average across all states is approximately $10,000-$15,000.</div></div>
<div class="faq-item"><div class="faq-q">What is SR-22 insurance?</div><div class="faq-a">SR-22 is a certificate of financial responsibility filed by your insurance company with the state DMV. It proves you carry minimum liability coverage. After a DUI, most states require SR-22 for 3 years. It typically increases your insurance premiums by $1,200-$4,500 per year.</div></div>
<div class="faq-item"><div class="faq-q">Can I avoid jail time for a first DUI?</div><div class="faq-a">Many states allow alternatives to jail for first-time DUI offenders, including community service, probation, and house arrest. However, some states have mandatory minimum jail sentences even for first offenses (e.g., Arizona requires 10 days).</div></div>
<div class="faq-item"><div class="faq-q">How long does a DUI affect my insurance?</div><div class="faq-a">A DUI typically affects your insurance rates for 3-5 years, depending on your state and insurance company. Some insurers check records back 7-10 years. Expect to pay 30-100% more for auto insurance after a DUI conviction.</div></div>
</div>
</div>

${FOOTER}
</body>
</html>`;

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

console.log(`Generated ${states.length} state pages + index = ${states.length + 1} total pages in dui/`);
