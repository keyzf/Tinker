'use strict';

module.exports.loopObjArr = (obj, property, proc, ...prev) => {
    obj[property].forEach(elt => {
        prev.push(elt);
        if (elt[property].length) {
            this.loopObjArr(elt, property, proc, ...prev);
        } else {
            proc(prev);
        }
        prev.pop()
    });
}



module.exports.loopObj = (obj, property, proc, ...prev) => {
    obj[property].forEach(elt => {
        prev.push(elt);
        if (elt.hasOwnProperty(property)) {
            this.loopObj(elt, property, proc, ...prev);
        } else {
            proc(prev);
        }
        prev.pop()
    });
}