import {readTextFile} from "../utils";

function splitStringToArrays(input: string): number[][] {
    return input.trim().split('\n').map(line => line.trim().split(/\s+/).map(Number));
}

function validateReport(report: number[]): boolean {
    const isValidAscending = report.every(function (number, index) {
        return index === 0 || number > report[index - 1] && number - report[index - 1] <= 3;
    });
    const isValidDescending = report.every(function (number, index) {
        return index === 0 || number < report[index - 1] && report[index - 1] - number <= 3;
    });
    return isValidAscending ? true : isValidDescending;
}

function validateReportWithDampener(report: number[]): boolean {
    const isValidAscending = report.some((_, i) => {
        const tempReport = report.slice(0, i).concat(report.slice(i + 1));
        return tempReport.every((number, index) => index === 0 || number > tempReport[index - 1] && number - tempReport[index - 1] <= 3);
    });
    const isValidDescending = report.some((_, i) => {
        const tempReport = report.slice(0, i).concat(report.slice(i + 1));
        return tempReport.every((number, index) => index === 0 || number < tempReport[index - 1] && tempReport[index - 1] - number <= 3);
    });
    return isValidAscending ? true : isValidDescending;
}

async function countSafeReports() {
    const fileContent = await readTextFile(__dirname, 'input.txt');
    const lines = splitStringToArrays(fileContent);
    const amountOfSafeReports = lines.filter(validateReport).length;
    console.log(`Amount of safe reports:\n${amountOfSafeReports}`);
}

async function countSafeReportsWithDampener() {
    const fileContent = await readTextFile(__dirname, 'input.txt');
    const lines = splitStringToArrays(fileContent);
    const amountOfSafeReports = lines.filter(validateReportWithDampener).length;
    console.log(`Amount of safe reports with dampener:\n${amountOfSafeReports}`);
}

countSafeReports();
countSafeReportsWithDampener();