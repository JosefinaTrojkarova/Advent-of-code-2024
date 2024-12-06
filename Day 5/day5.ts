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

function rulesToArray(rules: string): number[][] {
    return rules.replace(/\r/g, '').split('\n').map(line => line.split('|').map(Number));
}

function updatesToArrays(updates: string): number[][] {
    return updates.replace(/\r/g, '').split('\n').map(line => line.split(',').map(Number));
}

function validateUpdate(rules: number[][], update: number[]): boolean {
    for (let i = 0; i < update.length; i++) {
        for (let j = i + 1; j < update.length; j++) {
            const rule = rules.find(r =>
                (r[0] === update[i] && r[1] === update[j]) ||
                (r[0] === update[j] && r[1] === update[i])
            );

            if (rule) {
                if ((rule[0] === update[i] && rule[1] === update[j] && i > j) ||
                    (rule[0] === update[j] && rule[1] === update[i] && j > i)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function fixUpdate(rules: number[][], update: number[]): number[] {
    let updated = [...update];
    let changed = true;

    while (changed) {
        changed = false;

        for (let i = 0; i < updated.length; i++) {
            for (let j = i + 1; j < updated.length; j++) {
                const rule = rules.find(r =>
                    (r[0] === updated[i] && r[1] === updated[j]) ||
                    (r[0] === updated[j] && r[1] === updated[i])
                );

                if (rule) {
                    if ((rule[0] === updated[i] && rule[1] === updated[j] && i > j)) {
                        [updated[i], updated[j]] = [updated[j], updated[i]];
                        changed = true;
                        break;
                    } else if (rule[0] === updated[j] && rule[1] === updated[i] && j > i) {
                        [updated[j], updated[i]] = [updated[i], updated[j]];
                        changed = true;
                        break;
                    }
                }
            }

            if (changed) break;
        }
    }

    return updated;
}

function addUpInvalidUpdates(rules: number[][], updates: number[][]): number {
    const invalidUpdates = updates.filter(update => !validateUpdate(rules, update))
    let total = 0;
    invalidUpdates.forEach(update => {
        const fixedUpdate = fixUpdate(rules, update);
        total += fixedUpdate[Math.floor(update.length / 2)];
    });
    return total;
}

function addUpValidUpdates(rules: number[][], updates: number[][]): number {
    let total = 0;
    updates.forEach(update => {
        total += (validateUpdate(rules, update) ? update[Math.floor(update.length / 2)] : 0);
    });
    return total;
}

async function main() {
    const rules = await readTextFile(join(__dirname, 'rules.txt'));
    const updates = await readTextFile(join(__dirname, 'updates.txt'));
    const rulesArray = rulesToArray(rules);
    const updatesArray = updatesToArrays(updates);
    console.log('Valid total: ' + addUpValidUpdates(rulesArray, updatesArray));
    console.log('Invalid total: ' + addUpInvalidUpdates(rulesArray, updatesArray));
}

main();