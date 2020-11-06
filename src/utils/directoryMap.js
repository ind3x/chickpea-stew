import fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';
import { stewOptions as options } from '../main';

let jhipsterDirectoryMap = {};

const readFile = promisify(fs.readFile);

async function getBackendDirectoryMap (jhipsterConfig) {
    const jhipsterPackageFolder = `${options.sourceDirectory}/src/main/java/${jhipsterConfig['generator-jhipster'].packageFolder}`;
    jhipsterDirectoryMap['models'] = `${jhipsterPackageFolder}/domain`;
    jhipsterDirectoryMap['enumerations'] = `${jhipsterPackageFolder}/domain/enumeration`;
    jhipsterDirectoryMap['repositories'] = `${jhipsterPackageFolder}/repository`;
    jhipsterDirectoryMap['services'] = `${jhipsterPackageFolder}/service`;
    jhipsterDirectoryMap['mappers'] = `${jhipsterPackageFolder}/service/mapper`;
    jhipsterDirectoryMap['controllers'] = `${jhipsterPackageFolder}/web/rest`;
    
    return jhipsterDirectoryMap;
}

async function getFrontendDirectoryMap () {
    const jhipsterPackageFolder = `${options.sourceDirectory}/src/main/webapp/app`;
    jhipsterDirectoryMap['models'] = `${jhipsterPackageFolder}/shared/model`;
    jhipsterDirectoryMap['enumerations'] = `${jhipsterPackageFolder}/shared/model/enumerations`;
    jhipsterDirectoryMap['entities'] = `${jhipsterPackageFolder}/entities`;
    
    return jhipsterDirectoryMap;
}

/**
 * Get Directory map depends on provided concern
 * @param options
 * @returns {Promise<{}>}
 */
export async function getJhipsterDirectoryMap () {
    try {
        let jhipsterConfig = await readFile(`${options.sourceDirectory}/.yo-rc.json`);
        jhipsterConfig = JSON.parse(jhipsterConfig);
        
        let jhipsterDirectoryMap;
        if (['backend'].indexOf(options.concern) !== -1) {
            jhipsterDirectoryMap = getBackendDirectoryMap(jhipsterConfig);
        }
        
        if (['frontend'].indexOf(options.concern) !== -1) {
            jhipsterDirectoryMap = getFrontendDirectoryMap();
        }
        
        return jhipsterDirectoryMap;
    } catch (e) {
        console.error('%s Invalid JHipster config', chalk.red.bold('ERROR'));
        process.exit(1);
    }
}
