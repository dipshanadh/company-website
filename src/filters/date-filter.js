module.exports = value => {
  const date = new Date(value);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${date.getDate()}th of ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;
};
