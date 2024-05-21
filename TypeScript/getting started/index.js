function merge(objA, key) {
    return objA[key];
}
var mergedObj = merge({ name: 'elo' }, 'name');
console.log(mergedObj);
