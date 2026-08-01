import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml'


const endPointsFilePath = path.resolve(__dirname, 'ApiEndPoints.yaml');
const endPointsFileContents = fs.readFileSync(endPointsFilePath, 'utf8');
export const endPoints = yaml.load(endPointsFileContents) as any;


const uiURLFilePath = path.resolve(__dirname, 'UiURLs.yaml');
const uiURLFileContents = fs.readFileSync(uiURLFilePath, 'utf8');
export const uiURL = yaml.load(uiURLFileContents) as any;


const uiMSGsFilePath = path.resolve(__dirname, 'UiMSGs.yaml');
const uiMSGsFileContents = fs.readFileSync(uiMSGsFilePath, 'utf8');
export const uiMSGs = yaml.load(uiMSGsFileContents) as any;


const validDataFilePath = path.resolve(__dirname, 'ValidTestData.yaml');
const validDataFileContents = fs.readFileSync(validDataFilePath, 'utf8');
export const validTestData = yaml.load(validDataFileContents) as any;


const inValidDataFilePath = path.resolve(__dirname, 'InValidTestData.yaml');
const inValidDataFileContents = fs.readFileSync(inValidDataFilePath, 'utf8');
export const inValidTestData = yaml.load(inValidDataFileContents) as any;