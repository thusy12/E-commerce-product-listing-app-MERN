// Function to format date as YYYY-MM-DD_HH-mm-ss
const getFormattedTimestamp = () => {
  const now = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are 0-indexed
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
};

module.exports = getFormattedTimestamp;