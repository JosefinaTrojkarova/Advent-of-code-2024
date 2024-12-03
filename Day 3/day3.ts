import {promises as fs} from 'fs';
import {join} from 'path';

async function readTextFile(filePath: string): Promise<string> {
    try {
        return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}

function findAllValidMul(input: string) {
    const regex = /\bmul\((\d+),*(\d+)\)/g;
    // @ts-ignore
    return [...input.matchAll(regex)];
}

function findValidMulWithConditions(input: string) {
    const regex = /do\(\)|don't\(\)|\bmul\((\d+),*(\d+)\)/g;
    // @ts-ignore
    const matches = [...input.matchAll(regex)];
    let currentState = 'do';
    const results = matches.map(match => {
        if (match[0] === 'don\'t()') {
            currentState = 'don\'t';
            return null;
        }
        if (match[0] === 'do()') {
            currentState = 'do';
            return null;
        }
        if (currentState === 'do' && match[0].startsWith('mul')) {
            return [currentState, match[1], match[2]];
        }
        return null;
    });
    return results.filter(result => result !== null);
}

function multiplyValidMuls (validMuls: string[][]): number {
    return validMuls.reduce((acc, mul) => {
        return acc + (parseInt(mul[1]) * parseInt(mul[2]));
    }, 0);
}

async function calculateAllOperations() {
    const fileLocation = join(__dirname, 'input.txt')
    const fileContent = await readTextFile(fileLocation);
    const operations = findAllValidMul(fileContent);
    const sum = multiplyValidMuls(operations);
    console.log(`Sum of all valid muls:\n${sum}`);
}

async function calculateAllOperationsWithConditions() {
    const fileLocation = join(__dirname, 'input.txt')
    const fileContent = await readTextFile(fileLocation);
    const operations = findValidMulWithConditions(fileContent);
    const sum = multiplyValidMuls(operations);
    console.log(`Sum of all valid muls with conditions:\n${sum}`);
}

calculateAllOperations();
calculateAllOperationsWithConditions();