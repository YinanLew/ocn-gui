export const formatDateToYearMonthDay = (dateString: string | undefined) => {
  if (!dateString) {
    return "No Date";
  }

  const date = new Date(dateString);

  // Use UTC methods to avoid time zone conversion
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // UTC month
  const day = String(date.getUTCDate()).padStart(2, "0"); // UTC day

  return `${year}-${month}-${day}`;
};
