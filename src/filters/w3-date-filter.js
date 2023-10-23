module.exports = value => {
  const date = new Date(value);

  return date.toISOString();
};
