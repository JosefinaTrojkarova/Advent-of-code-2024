import {readTextFile} from "../utils";

function inputToGrid(input: string): string[][] {
    return input.replace(/\r/g, '').split('\n').map(line => line.split(''));
}

function logAllAntennas(grid: string[][]): { [key: string]: number[][] } {
    const antennas: { [key: string]: number[][] } = {};
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            if (grid[x][y] !== '.') {
                if (!antennas[grid[x][y]]) {
                    antennas[grid[x][y]] = [];
                }
                antennas[grid[x][y]].push([x, y]);
            }
        }
    }
    return antennas;
}

// For some reason is off by 1 ???
function findAllAntinodes(antennas: { [key: string]: number[][] }, grid: string[][]): number {
    let count = 0;
    const allAntennas = Object.values(antennas).flat();
    for (const antenna in antennas) {
        for (let i = 0; i < antennas[antenna].length; i++) {
            for (let j = i + 1; j < antennas[antenna].length; j++) {
                const antenna1 = antennas[antenna][i];
                const antenna2 = antennas[antenna][j];
                const vector = [antenna2[0] - antenna1[0], antenna2[1] - antenna1[1]];
                const antinode1 = [antenna2[0] + vector[0], antenna2[1] + vector[1]];
                const antinode2 = [antenna1[0] - vector[0], antenna1[1] - vector[1]];
                if ((antinode1[0] <= grid.length - 1 && antinode1[1] < grid[0].length) &&
                    (antinode1[0] >= 0 && antinode1[1] >= 0)) {
                    if (!allAntennas.some(coords =>
                        coords[0] === antinode1[0] && coords[1] === antinode1[1]
                    )) count++;
                }
                if ((antinode2[0] <= grid.length - 1 && antinode2[1] < grid[0].length) &&
                    (antinode2[0] >= 0 && antinode2[1] >= 0)) {
                    if (!allAntennas.some(coords =>
                        coords[0] === antinode2[0] && coords[1] === antinode2[1]
                    )) count++;
                }
            }
        }
    }
    return count;
}

function findAllRepeatingAntennas(antennas: { [key: string]: number[][] }, grid: string[][]): number {
    let count = 0;
    const allAntinodes = [];
    for (const antenna in antennas) {
        for (let i = 0; i < antennas[antenna].length; i++) {
            for (let j = i + 1; j < antennas[antenna].length; j++) {
                const antenna1 = antennas[antenna][i];
                const antenna2 = antennas[antenna][j];
                const vector = [antenna2[0] - antenna1[0], antenna2[1] - antenna1[1]];
                let antinode1 = [antenna2[0], antenna2[1]];
                let antinode2 = [antenna1[0], antenna1[1]];
                while ((antinode1[0] <= grid.length - 1 && antinode1[1] < grid[0].length) &&
                    (antinode1[0] >= 0 && antinode1[1] >= 0)) {
                    if (!allAntinodes.some(coords =>
                        coords[0] === antinode1[0] && coords[1] === antinode1[1]
                    )) {
                        allAntinodes.push(antinode1);
                        count++;
                    }
                    // count++
                    antinode1 = [antinode1[0] + vector[0], antinode1[1] + vector[1]];
                }
                while ((antinode2[0] <= grid.length - 1 && antinode2[1] < grid[0].length) &&
                    (antinode2[0] >= 0 && antinode2[1] >= 0)) {
                    if (!allAntinodes.some(coords =>
                        coords[0] === antinode2[0] && coords[1] === antinode2[1]
                    )) {
                        allAntinodes.push(antinode2);
                        count++;
                    }
                    // count++
                    antinode2 = [antinode2[0] - vector[0], antinode2[1] - vector[1]];
                }
            }
        }
    }
    return count;
}

async function main() {
    const input = await readTextFile(__dirname, 'input.txt');
    const grid = inputToGrid(input);
    const antennas = logAllAntennas(grid);
    const count = findAllAntinodes(antennas, grid);
    const count2 = findAllRepeatingAntennas(antennas, grid);
    console.log('Count:', count);
    console.log('Count 2:', count2);
}

main()