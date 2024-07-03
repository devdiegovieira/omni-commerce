const toLocalDate = (isoDate) => {
  return new Date( isoDate.getTime() - ( isoDate.getTimezoneOffset() * 60000 ) ).toLocaleString()
}

module.exports = { toLocalDate };