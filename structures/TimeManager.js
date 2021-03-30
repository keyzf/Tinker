module.exports = {

    /**
     *
     * @param time {Number|Date} timestamp or date object of a time
     * @returns {string} the Heidi sql formatting for datetime
     */
    timeToSqlDateTime(time) {
        const date = new Date(time);
        return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`
    },

    /**
     *
     * @param d1 {Date} compare date 1
     * @param d2 {Date} compare date 2
     * @returns {boolean} true when the two dates provided are on the same day
     */
    sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    },

    /**
     *
     * @param d1 {Date} compare date 1
     * @param d2 {Date} compare date 2
     * @returns {boolean} true when the two dates provided are at the same hour
     */
    sameHour(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate() &&
            d1.getHours() === d2.getHours();
    }

}