
module.exports = {
  nullCheck: (value) => {
    if (value === undefined) return false
    else if (value === 'string' && value.trim() === '') return false
    return value
  },
}
