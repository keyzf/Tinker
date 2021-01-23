/**
 * 
 * @param {Number} h 
 * @param {Number} m 
 * @param {Number} s
 * 
 * @returns {Number} time in milliseconds 
 */
module.exports.milliseconds = (h=0, m=0, s=0) => {
    return ((h * 60 * 60 + m * 60 + s) * 1000);
}
