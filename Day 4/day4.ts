import {readTextFile} from "../utils";

function findAllXMAS(input: string): number {
    const grid = input.replace(/\r/g, '').split('\n').map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;
    let total = 0;

    const directions = [
        [0, 1],   // horizontal
        [1, 0],   // vertical
        [1, 1],   // diagonal up-right
        [1, -1]   // diagonal up-left
    ];

    function isValidPosition(r: number, c: number): boolean {
        return r >= 0 && r < rows && c >= 0 && c < cols;
    }

    function checkWord(startR: number, startC: number, dirR: number, dirC: number): number {
        const word = 'XMAS';
        let count = 0;

        for (let repeat = 0; repeat < 2; repeat++) {
            let found = true;
            for (let i = 0; i < word.length; i++) {
                const r = startR + i * dirR;
                const c = startC + i * dirC;

                if (!isValidPosition(r, c) || grid[r][c] !== word[repeat ? word.length - 1 - i : i]) {
                    found = false;
                    break;
                }
            }
            if (found) {
                count++;
            }
        }

        return count;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dirR, dirC] of directions) {
                total += checkWord(r, c, dirR, dirC);
            }
        }
    }

    return total;
}

function findAllX_MAS(input: string) {
    const grid = input.replace(/\r/g, '').split('\n').map(line => line.split(''));
    let total = 0;

    const directions = [
        [1, 1],   // diagonal up-right
        [1, -1]   // diagonal up-left
    ];

    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            let matches = 0;
            directions.forEach(([dirR, dirC]) => {
                if (cell === 'A') {
                    const r1 = r + dirR;
                    const c1 = c + dirC;
                    const r2 = r - dirR;
                    const c2 = c - dirC;
                    if (grid[r1] && grid[r2] && ((grid[r1][c1] === 'M' && grid[r2][c2] === 'S') || (grid[r1][c1] === 'S' && grid[r2][c2] === 'M'))) {
                        matches++;
                    }
                }
            });
            if (matches === 2) {
                total++;
            }
        });
    });

    return total;
}


async function findAndCalculateAllXMAS() {
    const fileContent = await readTextFile(__dirname, 'input.txt');
    const totalXMAS = findAllXMAS(fileContent);
    console.log('Total XMAS:', totalXMAS);
    const totalX_MAS = findAllX_MAS(fileContent);
    console.log('Total X_MAS:', totalX_MAS);
}

findAndCalculateAllXMAS()