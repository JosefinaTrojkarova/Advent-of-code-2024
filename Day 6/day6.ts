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

function inputToGrid(input: string): string[][] {
    return input.replace(/\r/g, '').split('\n').map(line => line.split(''));
}

function findGuard(grid: string[][]) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === '^') {
                grid[i][j] = 'X';
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

function calculatePath(grid: string[][], guard: number[]): number {
    let steps = 1;
    let current = [...guard];
    const directions = [
        [-1, 0], // up
        [0, 1], // right
        [1, 0], // down
        [0, -1] // left
    ];
    let currentDirection = directions[0];

    while (true) {
        const next = [current[0] + currentDirection[0], current[1] + currentDirection[1]];
        grid[current[0]][current[1]] = 'X';
        if (grid[next[0]] && grid[next[0]][next[1]] === '#') {
            if (directions.indexOf(currentDirection) === 3) {
                currentDirection = directions[0];
            } else {
                currentDirection = directions[directions.indexOf(currentDirection) + 1];
            }
        } else if (grid[next[0]] && grid[next[0]][next[1]] === '.') {
            current = next;
            steps++;
        } else if (grid[next[0]] && grid[next[0]][next[1]] === 'X') {
            current = next;
        } else {
            break;
        }
    }

    return steps;
}

function findAllPossiblePositions(grid: string[][], guard: number[]): number[][] {
    const positions = [];
    let current = [...guard];
    const directions = [
        [-1, 0], // up
        [0, 1], // right
        [1, 0], // down
        [0, -1] // left
    ];
    let currentDirection = directions[0];

    while (true) {
        const next = [current[0] + currentDirection[0], current[1] + currentDirection[1]];
        grid[current[0]][current[1]] = 'X';
        if (grid[next[0]] && grid[next[0]][next[1]] === '#') {
            if (directions.indexOf(currentDirection) === 3) {
                currentDirection = directions[0];
            } else {
                currentDirection = directions[directions.indexOf(currentDirection) + 1];
            }
        } else if (grid[next[0]] && grid[next[0]][next[1]] === '.') {
            current = next;
            positions.push(current);
        } else if (grid[next[0]] && grid[next[0]][next[1]] === 'X') {
            current = next;
        } else {
            break;
        }
    }

    return positions;
}

function countObstaclesThatCauseLoop(grid: string[][], guard: number[], possiblePositions: number[][]): number {
    let count = 0;

    possiblePositions.forEach((position) => {
        let currentGrid = grid.map(row => [...row]);
        currentGrid[guard[0]][guard[1]] = '.';
        let current = [...guard];
        const directions = [
            [-1, 0], // up
            [0, 1], // right
            [1, 0], // down
            [0, -1] // left
        ];
        const obstacleLog: Record<string, number[]> = {};
        let currentDirection = directions[0];

        // Set an obstacle at this position
        currentGrid[position[0]][position[1]] = '0';

        while (true) {
            const next = [current[0] + currentDirection[0], current[1] + currentDirection[1]];

            if (currentGrid[next[0]] && obstacleLog[`${next[0]}-${next[1]}`]?.includes(directions.indexOf(currentDirection))) {
                // Loop detected
                count++;
                break;
            } else if (currentGrid[next[0]] && (currentGrid[next[0]][next[1]] === '#' || currentGrid[next[0]][next[1]] === '0')) {
                // Log the obstacle
                const key = `${next[0]}-${next[1]}`;
                if (!obstacleLog[key]) {
                    obstacleLog[key] = [];
                }
                obstacleLog[key].push(directions.indexOf(currentDirection));

                // Change direction
                if (directions.indexOf(currentDirection) === 3) {
                    currentDirection = directions[0];
                } else {
                    currentDirection = directions[directions.indexOf(currentDirection) + 1];
                }
            } else if (currentGrid[next[0]] && (currentGrid[next[0]][next[1]] === '.')) {
                current = next;
            } else {
                break;
            }
        }
    });

    return count;
}

async function main() {
    const input = await readTextFile(join(__dirname, 'input.txt'));
    const grid = inputToGrid(input);
    const guard = findGuard(grid);
    const steps = calculatePath(grid, guard);
    console.log('Steps:', steps);
    const positions = findAllPossiblePositions(inputToGrid(input), guard);
    const newObstacles = countObstaclesThatCauseLoop(inputToGrid(input), guard, positions);
    console.log('Possible obstacles:', newObstacles);
}

main();