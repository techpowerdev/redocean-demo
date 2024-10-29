export const truncateText = (limit: number, str: string | undefined | null) => {
  if (!str) return ""; // Handle null or undefined
  if (str.length <= limit) return str;
  return str.substring(0, limit) + "...";
};
