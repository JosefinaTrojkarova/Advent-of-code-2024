/// <reference lib="es2015" />
import {readTextFile} from "../utils";

function splitStringToArrays(input: string): [number[], number[]] {
    return input.trim().split('\n').reduce<[number[], number[]]>(
        (acc, line) => {
            const parts = line.trim().split(/\s+/).map(Number);
            return [
                [...acc[0], parts[0]],
                [...acc[1], parts[1]]
            ];
        },
        [[], []]
    );
}

function orderArrays(arr1: number[], arr2: number[]): [number[], number[]] {
    return [
        arr1.slice().sort((a, b) => a - b),
        arr2.slice().sort((a, b) => a - b)
    ];
}

function createArrayFromDifferences(arr1: number[], arr2: number[]): number[] {
    return arr1.map((number, index) => {
        return Math.abs(number - arr2[index]);
    })
}

function addNumbersInArray(arr: number[]): number {
    return arr.reduce((acc, number) => {
        return acc + number;
    })
}

async function calculateDifference() {
    const fileContent = await readTextFile(__dirname, 'input.txt');
    const arrays = splitStringToArrays(fileContent);
    const orderedArrays = orderArrays(arrays[0], arrays[1]);
    const differences = createArrayFromDifferences(orderedArrays[0], orderedArrays[1]);
    console.log(`Difference score:\n${addNumbersInArray(differences)}`);
}

function findSimilarityScore(arr1: number[], arr2: number[]): number {
    let score = 0;
    for (let arr1Index = 0; arr1Index < arr1.length; arr1Index++) {
        let currentNumberScore = 0;
        for (let arr2Index = 0; arr2Index < arr2.length; arr2Index++) {
            if (arr1[arr1Index] === arr2[arr2Index]) {
                currentNumberScore++;
            }
        }
        score += currentNumberScore * arr1[arr1Index];
    }
    return score;
}

async function calculateSimilarityScore() {
    const fileContent = await readTextFile(__dirname, 'input.txt');
    const arrays = splitStringToArrays(fileContent);
    const similarityScore = findSimilarityScore(arrays[0], arrays[1]);
    console.log(`Similarity score:\n${similarityScore}`);
}

calculateDifference();
calculateSimilarityScore();