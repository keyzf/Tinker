module.exports = (func, ...pass_args) => {
    return new Promise((resolve, reject) => {
        try {
            func(...pass_args, (...returned_args) => {
                resolve(...returned_args)
            })
        } catch (e) {
            reject(e)
        }
    })
}