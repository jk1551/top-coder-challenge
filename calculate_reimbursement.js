function calculateReimbursement(trip_duration_days, miles_traveled, total_receipts_amount) {
    const dayRate = 50.86;
  const mileRate = 0.31;
  const receiptRate = 0.98;
  const base = 112.76;

  const cappedReceipts = softCap(total_receipts_amount);

  const result =
    (trip_duration_days * dayRate) +
    (miles_traveled * mileRate) +
    (cappedReceipts * receiptRate) +
    base;

  return parseFloat(result.toFixed(2));
  }

  function softCap(receipts) {
    const cap = 1000;
    const diminishingFactor = 0.5;
  
    if (receipts <= cap) return receipts;
    return cap + Math.pow(receipts - cap, diminishingFactor);
  }
  

// Read command-line arguments
const tripDurationDays = parseInt(process.argv[2], 10);
const milesTraveled = parseInt(process.argv[3], 10);
const totalReceiptsAmount = parseFloat(process.argv[4]);

// Calculate and print the reimbursement amount
const reimbursement = calculateReimbursement(tripDurationDays, milesTraveled, totalReceiptsAmount);
console.log(reimbursement);