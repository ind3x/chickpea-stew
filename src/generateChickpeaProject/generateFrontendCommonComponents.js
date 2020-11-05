import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import { getJhipsterDirectoryMap } from '../directoryMap';
import path from 'path';

const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const copy = promisify(ncp);

export function generateFrontendCommonComponents (options) {
    return [
        {
            title: 'Choosing Chickpea stew seasoning (making Chickpea common directories)',
            task: () => makeCommondComponentDirectories(options)
        },
        {
            title: 'Seasoning Chickpea stew (copying JHipster files to Chickpea common directories)',
            task: () => copyCommondComponent(options)
        }
    ];
}

async function makeCommondComponentDirectories (options) {
    const targetDirectory = `${options.targetDirectory}`;
    let promises = [];
    
    // Create bundle model directory and enumeration directory
    if (!fs.existsSync(`${targetDirectory}/models`)) {
        promises = [...promises, mkDir(`${targetDirectory}/models/enumerations`, { recursive: true })];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/services`)) {
        promises = [...promises, mkDir(`${targetDirectory}/services`, { recursive: true })];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/components`)) {
        promises = [...promises, mkDir(`${targetDirectory}/components`)];
    }

    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/utils`)) {
        promises = [...promises, mkDir(`${targetDirectory}/utils`)];
    }
    
    return Promise.all(promises);
}

async function copyCommondComponent (options) {
    const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
    const targetDirectory = `${options.targetDirectory}`;
    const templateDirectory = path.resolve(new URL(import.meta.url).pathname, '../../../templates', options.concern);
    let promises = [];
    
    // Copy enumerations
    promises = [...promises, copy(jhipsterDirectoryMap['enumerations'], `${targetDirectory}/models/enumerations`, {
        clobber: false
    })];
    
    // Copy services from template
    promises = [...promises, copy(`${templateDirectory}/static/services`, `${targetDirectory}/services`, {
        clobber: false
    })];
    
    // Copy errors from template
    promises = [...promises, copy(`${templateDirectory}/static/utils`, `${targetDirectory}/utils`, {
        clobber: false
    })];
    
    // Copy configurations from template
    promises = [...promises, copy(`${templateDirectory}/static/components`, `${targetDirectory}/components`, {
        clobber: false
    })];
    
    return Promise.all(promises);
}
