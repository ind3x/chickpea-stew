import glob from 'glob';
import { promisify } from "util";
import fs from "fs";
import chalk from 'chalk';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function replacePackage (file, options) {
    const jhipsterPackageName = jhipsterConfig['generator-jhipster'].packageName;
    const data = await readFile(file, 'utf8');
    
    var result = data.replace(`/${jhipsterPackageName}/g`, 'com.ecovinal.industria');
    
    return writeFile(file, result, 'utf8');
}

async function replaceRepository (file, options) {

}
