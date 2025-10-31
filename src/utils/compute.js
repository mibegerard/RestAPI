/**
 * Convert grams → kilograms and centimeters → meters
 */
function convertToMetric(weightGrams, heightCm) {
  const weightKg = weightGrams / 1000;
  const heightM = heightCm / 100;
  return { weightKg, heightM };
}

/**
 * Calculate BMI = weight / (height²)
 */
function calculateBMI(weightGrams, heightCm) {
  const { weightKg, heightM } = convertToMetric(weightGrams, heightCm);
  if (heightM <= 0) return null;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

/**
 * Calculate average of an array of numbers
 */
function average(arr) {
  if (!arr.length) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return parseFloat((sum / arr.length).toFixed(2));
}

/**
 * Compute median value from numeric array
 */
function median(arr) {
  if (!arr.length) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
}

module.exports = {
  calculateBMI,
  average,
  median,
};
