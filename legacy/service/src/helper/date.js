const toLocalDate = (isoDate) => {
  if (typeof isoDate == 'string') isoDate = new Date(isoDate);

  isoDate.setHours(isoDate.getHours() - 3)

  return isoDate.toLocaleString();
}

module.exports = { toLocalDate };