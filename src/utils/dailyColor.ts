/**
 * Generates a deterministic, vibrant color gradient based on the current date.
 * The color changes daily, cycling through the color spectrum over the year.
 */
export const getDailyGradient = (): { colorStart: string; colorEnd: string } => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay); // Day of the year (1-366)

  // Use the day of the year to calculate a base hue (0-360)
  const baseHue = Math.round((dayOfYear / 366) * 360);

  // Define saturation and lightness for a vibrant, deep color palette
  const saturation = 70;
  const lightness = 45;

  // Generate the two colors for the gradient
  const colorStart = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
  const colorEnd = `hsl(${(baseHue + 40) % 360}, ${saturation}%, ${lightness - 10}%)`;
  
  console.log(`🎨 Daily color generated for day ${dayOfYear}: Hue ${baseHue}°`);
  
  return { colorStart, colorEnd };
}; 