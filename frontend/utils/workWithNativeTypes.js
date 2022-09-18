export const uniqueObjectsArray = (arr, key) => {
    const uniqueResults = new Map(arr.map(item => [item[key], item]));
    return [...uniqueResults.values()];
};

export const customError = (name, message) => {
    const e = new Error(message);
    e.name = name;
    return e;
};