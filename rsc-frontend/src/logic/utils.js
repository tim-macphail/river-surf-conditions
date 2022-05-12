/**
 * Contains helper functions for front-end components
 *
 */

/**
 * Converts a Date object into a string usable by an
 * <input type="datetime-local" /> component
 * @param {Date} date
 * @returns {string} dateStr
 */
const stringify = (date) => {
  // Adjust for UTC conversion
  let adjustedDate = date;
  adjustedDate.setHours(adjustedDate.getHours() - 6); // ? depends on daylight saving time?
  let dateStr = adjustedDate.toISOString();
  // Format for html input type=datetime-local
  dateStr = dateStr.slice(0, dateStr.lastIndexOf(":"));
  return dateStr;
};

module.exports = {
  stringify,
  apiEndpoint: "http://localhost:3001",
  // apiEndpoint: "https://river-surf-conditions.herokuapp.com",
};
