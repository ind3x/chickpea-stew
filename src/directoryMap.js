import fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';

let jhipsterDirectoryMap = {};

const readFile = promisify(fs.readFile);

export async function getDirectoryMap (options) {
    try {
        let jhipsterConfig = await readFile(`${options.sourceDirectory}/.yo-rc.json`);
        jhipsterConfig = JSON.parse(jhipsterConfig);

        const jhipsterPackageFolder = `${options.sourceDirectory}/src/main/java/${jhipsterConfig['generator-jhipster'].packageFolder}`;
        
        jhipsterDirectoryMap['models'] = `${jhipsterPackageFolder}/domain`;
        jhipsterDirectoryMap['enumerations'] = `${jhipsterPackageFolder}/domain/enumeration`;
        jhipsterDirectoryMap['repositories'] = `${jhipsterPackageFolder}/repository`;
        jhipsterDirectoryMap['services'] = `${jhipsterPackageFolder}/service`;
        
        return jhipsterDirectoryMap;
    } catch (e) {
        console.error('%s Invalid JHipster config', chalk.red.bold('ERROR'));
        process.exit(1);
    }
}
