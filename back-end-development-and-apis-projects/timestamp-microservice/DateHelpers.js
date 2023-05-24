const getDateFromObject = (obj) => {

  if (obj) {
    return !isNaN(obj) ? new Date(Number(obj)) : new Date(obj);
  }
  else {
    return new Date();
  }

}
const getTimeStamp = (userDate) => {

  var date = getDateFromObject(userDate);

  const dateUtcString = date.toUTCString();

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse
  // Invalid date will not be parsed and return NaN
  var milliseconds = Date.parse(dateUtcString);

  //Only check if date is valid if it was supplied 
  if (!userDate || !isNaN(milliseconds)) {
    return { unix: milliseconds, 'utc': dateUtcString };
  } else {
    return { "error": "Invalid Date" };
  }

}

module.exports = {
  getTimeStamp: getTimeStamp
}