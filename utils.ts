import {promises as fs} from 'fs';
import {join} from 'path';

export async function readTextFile(dirname: string, filePath: string): Promise<string> {
    try {
        return await fs.readFile(join(dirname, filePath), 'utf-8');
    } catch (error) {
        console.error('Error reading file:', error);
        throw error;
    }
}