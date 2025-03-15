export function hasSameNumbers(arr1: number[], arr2: number[]) {
    if (arr1.length !== arr2.length) return false; // Si tienen distinta longitud, no pueden ser iguales

    return arr1.sort((a, b) => a - b).toString() === arr2.sort((a, b) => a - b).toString();
}