/* GENERAL PURPOSE ERROR CHECKING FUNCTIONS */
//TODO: Consolidate type checking functions into one

export let states = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
    'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI',
    'MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC',
    'ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
    'VT','VA','WA','WV','WI','WY'
];

export let checkEachElement = (val, varName, checkFunction) => {
    val.forEach(elem => checkFunction(elem, varName));
};

export let checkEachKey = (val, varName, checkFunction) => {
    Object.keys(val).forEach(elem => checkFunction(elem, varName));
};

export let checkEachObjValue = (val, varName, checkFunction) => {
    Object.values(val).forEach(elem => checkFunction(elem, varName));
};

export let checkIsArray = (val, varName) => {
   if (!Array.isArray(val)) { throw `${varName || 'provided variable'} is not an array`; }
};

export let checkArrayEmpty = (val, varName) => {
    if (val.length === 0) { throw `${varName || 'provided variable'} is an empty array`; }
};
export let checkIsObject = (val, varName) => {
    if (typeof val !== "object" || Array.isArray(val)) {
        throw `${varName || 'something'} is not an object`;
    }
};

export let checkForTwoElements = (val, varName, exact) => {
    if (exact) {
        if (val.length !== 2) { throw `${varName || 'array'} length is not exactly two`;}
    }
    else {
        if (val.length < 2) { throw `${val || 'array'} length is not two or greater`; }
    }
};

export let checkEmptyObject = (val, varName) => {
    if (Object.keys(val) === 0) { throw `${varName || 'provided variable'} is an empty array`; }
};

export let checkSameKeys = (val, varName) => {
    if (!val.every(obj => Object.keys(obj).toString() === Object.keys(val[0]).toString())){
        throw `${varName || 'provided object array'} members do not share same keys`;
    }
};

export let checkValidString = (val, varName) => {
    if (typeof val !== "string") { throw `${varName || 'provided variable'} is not a string`; }
    if (val.trim() === "") { throw `${varName || 'provided variable'} is an empty string`; }
    return val.trim();
};

export let checkKeyInObjectArr = (val, varName, key, keyName, every) => {
    if (every) {
        if (!val.every(obj => Object.keys(obj).includes(key))){
            throw `${keyName || 'provided key'} is not in ${varName || 'array'}`;
        }
    }
    else {
        if (!val.some(obj => Object.keys(obj).includes(key))){
            throw `${keyName || 'provided key'} is not in ${varName || 'array'}`;
        }
    }
};

export let checkAscDesc = (val, varName) => {
    if (val !== "asc" && val !== "desc") {
        throw `Invalid order specified`;
    }
};

// Parameter names here are confusing but w/e
export let checkValueInObjectArr = (val, varName, value, valueName) => {
    if (!val.some(obj => Object.values(obj).includes(value))){
        throw `${valueName || 'provided key'} is not in ${varName || 'array'}`;
    }
};

export let checkUndef = (val, varName) => {
    if (val === undefined) {
        throw `an argument is undefined/missing`;
    }
};

export let checkArgsUndef = (...args) => {
    if (args.length === 0) { // not sure if this even catches anything
        throw `no arguments given`;
    }
    checkEachElement(args, 'argument', checkUndef);
};

export let checkNum = (val, valName) => {
    if (typeof val !== 'number' || val === NaN){
        throw `${valName || "value"} is not a number`;
    }
};

// this breaks for the ones that require more spicy parameters
// works for now tho
export let checkAtLeastOne = (val, valName, ...checks) => {
    let checkCount = [...checks].length;
    let failedChecks = 0;
    for (let checkFunc of [...checks]) {
        try { checkFunc(val, valName); }
        catch { failedChecks++; }
    }
    if (failedChecks == checkCount) {
        throw `${valName || 'a variable'} fails a multi-check`;
    }
};

export let checkEqualLengths = (array, arrayName) => {
    let length = array[0].length;
    for (let inner of array) {
        if (inner.length - length) {
            throw `${arrayName || 'array'}'s inner elements are not the same length`;
        }
    }
};

export let checkValidMatMul = (A, B) => {
    if (A[0].length !== B.length) {
        throw `Invalid matrix dimensions for matrix multiplication`;
    }
};

export let checkAlphanumeric = (val, valName) => {
    const re = /([A-z]|[0-9])+/g;
    if (!re.test(val)) {
        throw `${valName || 'value'} lacks alphanumeric characters`;
    }
};

export let checkInString = (val, valName, string) => {
    if (!string.includes(val)) {
        throw `${val || 'value'} is not in string`;
    }

};

// export let checkNotPuncOnly = (val, valName) => {
//     const re = ;
//     if (!re.test(va

export let checkNotEqual = (thing1, thing2) => {
    if (thing1 == thing2) {
        throw 'values are equal that shouldnt be';
    }
};

export let checkInArr = (arr, ...args) => {
    for (let arg of args) {
        for (let word of arg) {
            if (!arr.includes(word)) {
                throw 'array does not contain a required value';
            }
        }
    }
};

export let checkIsFunc = (val, varName) => {
    if (typeof val !== "function") {
        throw `${varName || "a variable"} is not a function`;
    }
};

 /////////////////
// OTHER HELPERS //
 /////////////////
export let objValFilter = (obj, key, value, insens) => {
    if (insens) {
        return obj[key].toLowerCase() === value.toLowerCase();
    }
    return obj[key] === value;
};

export let objValFilterArr = (obj, key, value) => {
    return obj[key].includes(value);
};

export let reactions =
[
    'like','love','happy','funny'
];