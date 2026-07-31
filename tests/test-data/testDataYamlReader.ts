import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml'

const filePath = path.resolve(__dirname, 'testData.yaml');
const fileContents = fs.readFileSync(filePath, 'utf8');
export const testData = yaml.load(fileContents) as any;


const endPointsFilePath = path.resolve(__dirname, 'ApiEndPoints.yaml');
const endPointsFileContents = fs.readFileSync(endPointsFilePath, 'utf8');
export const endPoints = yaml.load(endPointsFileContents) as any;


const uiURLFilePath = path.resolve(__dirname, 'UiURLs.yaml');
const uiURLFileContents = fs.readFileSync(uiURLFilePath, 'utf8');
export const uiURL = yaml.load(uiURLFileContents) as any;