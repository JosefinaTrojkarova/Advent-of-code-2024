import {readTextFile} from "../utils";

function testValuesToArray(input: string): number[] {
    return input.match(/^\d+/gm).map(Number);
}

function operationNumbersToArray(input: string): number[][] {
    return input.replace(/\r/g, '').split('\n').map(line => line.replace(/^\d+:\s/g, '').split(' ').map(Number));
}

function totalCalibrationResult(testValues: number[], operationNumbers: number[][], possibleOperations: number): number {
    return testValues.reduce((total, testValue, index) => {
        for (let i = 0; i < Math.pow(possibleOperations, (operationNumbers[index].length - 1)); i++) {
            if (testValue === calculate(operationNumbers[index], (i >>> 0).toString(possibleOperations))) {
                return total + testValue;
            }
        }
        return total;
    }, 0);
}

function calculate(numbers: number[], combination: string): number {
    combination = combination.padStart(numbers.length - 1, '0');

    let result = numbers[0];

    for (let i = 0; i < combination.length; i++) {
        const nextNumber = numbers[i + 1];

        switch (combination[i]) {
            case '0':
                result += nextNumber;
                break;
            case '1':
                result *= nextNumber;
                break;
            case '2':
                result = Number(String(result) + String(nextNumber));
                break;
        }
    }

    return result;
}

async function main() {
    const input = await readTextFile(__dirname, 'input.txt');
    const testValues = testValuesToArray(input);
    const operationNumbers = operationNumbersToArray(input);
    const result = totalCalibrationResult(testValues, operationNumbers, 2);
    console.log('Result:', result);
    const result2 = totalCalibrationResult(testValues, operationNumbers, 3);
    console.log('Result 2:', result2);
}

main();