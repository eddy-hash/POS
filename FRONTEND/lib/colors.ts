/**
 * Professional color palette for charts
 * Colors are assigned based on index to ensure consistency
 */
export const CHART_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#f472b6', // Rose
  '#22d3ee', // Light Cyan
  '#a3e635', // Light Lime
  '#fbbf24', // Light Amber
  '#a78bfa', // Light Purple
  '#34d399', // Light Emerald
  '#fb923c', // Light Orange
  '#60a5fa', // Light Blue
  '#f87171', // Light Red
];

/**
 * Get a color for a product based on its index or name
 * Uses a hash function to ensure the same product always gets the same color
 */
export const getProductColor = (productName: string, index: number): string => {
  // If we have enough colors, use index
  if (index < CHART_COLORS.length) {
    return CHART_COLORS[index];
  }
  
  // If we have more products than colors, generate a color using a hash
  const hash = productName.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate a vibrant color from the hash
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
};

/**
 * Get an array of colors for a list of products
 */
export const getProductColors = (productNames: string[]): string[] => {
  return productNames.map((name, index) => getProductColor(name, index));
};

/**
 * Get a color for a specific product with consistent assignment
 * This ensures the same product always gets the same color across the app
 */
export const getConsistentColor = (name: string, index: number): string => {
  // Use the index if available, otherwise use the name hash
  if (index < CHART_COLORS.length) {
    return CHART_COLORS[index];
  }
  
  // Generate a consistent color from the name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 50%)`;
};
