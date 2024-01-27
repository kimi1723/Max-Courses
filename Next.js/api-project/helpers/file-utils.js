import fs from 'fs';
import path from 'path';

export function createFilePath(customPath) {
    return path.join(process.cwd(), ...customPath)
}

export function readFile(filePath) {
    const fileData = fs.readFileSync(filePath);
    const data = JSON.parse(fileData);

    return data;
}

export function writeFile({filePath, fileData, newData}) {
    fileData.push(newData);
    fs.writeFileSync(filePath, JSON.stringify(fileData));
}