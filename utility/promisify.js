'use strict';

module.exports.promisifyLastCallback = (func, ...pass_args) => {
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



// function hello(text, cb) {
//     setTimeout(() => {
//         cb(`Hello ${text}`)
//     }, 5000)
// }

// hello("First text", (msg) => {
//     send(msg)
// }); // normal way
// promisify(hello, "Second text").then((msg) => { send(msg) }) // promisified way