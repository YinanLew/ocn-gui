export const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) {
    return "No Date";
  }

  const date = new Date(dateString);
  date.setUTCHours(date.getUTCHours() - 5);

  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
