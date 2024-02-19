export const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "No Date";
  }
  const date = new Date(dateString);
  const year = date.getUTCFullYear(); // Use UTC year
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Use UTC month
  const day = date.getUTCDate().toString().padStart(2, "0"); // Use UTC day

  return `${year}-${month}-${day}`;
};
