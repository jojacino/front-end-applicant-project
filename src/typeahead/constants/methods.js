
// returns boolean if string can be parsed by JSON
export function canJSON(str) {
    try {
        JSON.parse(str)
    } catch (e) {
        return false
    }
    return true
}

// returns CSS property value
export function cssPropertyValue(elem, prop) {
    return window.getComputedStyle(elem).getPropertyValue(prop)
}

// returns all of the numbers from the beginning of a string
export function firstNumInString(str) {
    if (!str) return

    var answer = str.match(/^[0-9]+/)
    return answer
}
    