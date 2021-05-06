'use strict';

/**
 * 
 * @param {Array} arr the array to use
 * @param {string} separator - like ", "
 * @param {number} start - index in array to start at like 2
 * @param {number} end - index in array to stop at like 5
 */
module.exports = (arr, separator, start, end) => {
    

if (!start) start = 0;
    if (!end) end = arr.length - 1;
    end++;
    return arr.slice(start, end).join(separator);
}