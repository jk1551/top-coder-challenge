function calculateReimbursement(trip_duration_days, miles_traveled, total_receipts_amount) {
    const base = 112.76;
    
    // Base rates
    let dayComponent = trip_duration_days * 50.86;
    let mileComponent = calculateMileageReimbursement(miles_traveled, trip_duration_days);
    let receiptComponent = calculateReceiptReimbursement(total_receipts_amount, trip_duration_days);
    
    let result = dayComponent + mileComponent + receiptComponent + base;
    
    // Apply bonuses and penalties
    result += calculateEfficiencyBonus(miles_traveled, trip_duration_days);
    result += calculate5DayBonus(trip_duration_days, miles_traveled, total_receipts_amount);
    result += calculateInteractionEffects(trip_duration_days, miles_traveled, total_receipts_amount);
    
    return parseFloat(result.toFixed(2));
  }
  
  function calculateMileageReimbursement(miles, days) {
    // Tiered mileage system mentioned by Lisa
    const baseRate = 0.31;
    const tier1Threshold = 100;
    const tier2Threshold = 400;
    
    if (miles <= tier1Threshold) {
      return miles * baseRate;
    } else if (miles <= tier2Threshold) {
      return (tier1Threshold * baseRate) + ((miles - tier1Threshold) * baseRate * 0.9);
    } else {
      return (tier1Threshold * baseRate) + 
             ((tier2Threshold - tier1Threshold) * baseRate * 0.9) + 
             ((miles - tier2Threshold) * baseRate * 0.75);
    }
  }
  
  function calculateReceiptReimbursement(receipts, days) {
    const receiptRate = 0.98;
    const receiptsPerDay = receipts / days;
    
    // Small receipt penalty mentioned by multiple people
    if (receipts < 30 && days > 1) {
      return receipts * receiptRate * 0.7; // 30% penalty
    }
    
    // Apply soft cap
    const cappedReceipts = softCap(receipts);
    return cappedReceipts * receiptRate;
  }
  
  function calculateEfficiencyBonus(miles, days) {
    const milesPerDay = miles / days;
    
    // Kevin's efficiency sweet spot: 180-220 mpd
    if (milesPerDay >= 180 && milesPerDay <= 220) {
      return 25; // Bonus for hitting sweet spot
    } else if (milesPerDay >= 120 && milesPerDay < 180) {
      return 10; // Smaller bonus for good efficiency
    } else if (milesPerDay > 220) {
      return Math.max(0, 25 - (milesPerDay - 220) * 0.5); // Diminishing returns
    }
    
    return 0;
  }
  
  function calculate5DayBonus(days, miles, receipts) {
    if (days !== 5) return 0;
    
    const milesPerDay = miles / days;
    const receiptsPerDay = receipts / days;
    
    // Kevin's "sweet spot combo": 5-day trips with 180+ mpd and <$100 ppd
    if (milesPerDay >= 180 && receiptsPerDay < 100) {
      return 40; // Major bonus
    }
    
    // General 5-day bonus mentioned by Lisa
    return 15;
  }
  
  function calculateInteractionEffects(days, miles, receipts) {
    const milesPerDay = miles / days;
    const receiptsPerDay = receipts / days;
    
    // High mileage + low spending = bonus (mentioned by Kevin)
    if (milesPerDay > 100 && receiptsPerDay < 80) {
      return 20;
    }
    
    // Low mileage + high spending = penalty (mentioned by Kevin)
    if (milesPerDay < 50 && receiptsPerDay > 150) {
      return -30;
    }
    
    return 0;
  }
  
  function softCap(receipts) {
    const cap = 1000;
    const diminishingFactor = 0.5;
  
    if (receipts <= cap) return receipts;
    return cap + Math.pow(receipts - cap, diminishingFactor);
  }
  
  // Command-line interface
  const tripDurationDays = parseInt(process.argv[2], 10);
  const milesTraveled = parseInt(process.argv[3], 10);
  const totalReceiptsAmount = parseFloat(process.argv[4]);
  
  const reimbursement = calculateReimbursement(tripDurationDays, milesTraveled, totalReceiptsAmount);
  console.log(reimbursement);