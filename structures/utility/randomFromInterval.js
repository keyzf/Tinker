module.exports = (min, max) => { // inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
  }