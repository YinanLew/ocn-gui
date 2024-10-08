export const formatDate = (dateString: string | undefined) => {
  if (!dateString) {
    return "No Date";
  }

  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() - 5);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};
