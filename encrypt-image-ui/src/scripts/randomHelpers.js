/**
 * Random a hex color string
 * @returns {string} random hex color string
 */
export function randomColorHex() {
    return '#' + [..."0123456789abcdef"].sort(() => Math.random() - 0.5).slice(0, 6).toString().replace(/(,)/g, '');
}

/**
 * Random a string with max length is 62
 * @param {number} length Length of the string (max: 62)
 * @returns {string} random string
 */
export function randomString(length) {
    var random = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return [...random].sort(() => Math.random() - 0.5).slice(0, length).toString().replace(/(,)/g, '');
}