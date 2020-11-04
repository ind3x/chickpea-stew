import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import { getJhipsterDirectoryMap } from '../directoryMap';
import path from 'path';

const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const copy = promisify(ncp);

export function generateBackendCommondComponents (options) {
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
    
    // Create bundle repository directory
    if (!fs.existsSync(`${targetDirectory}/repositories`)) {
        promises = [...promises, mkDir(`${targetDirectory}/repositories`)];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/services`)) {
        promises = [...promises, mkDir(`${targetDirectory}/services/dto`, { recursive: true })];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/mappers`)) {
        promises = [...promises, mkDir(`${targetDirectory}/mappers`)];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/controllers`)) {
        promises = [...promises, mkDir(`${targetDirectory}/controllers`)];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/queryParameters`)) {
        promises = [...promises, mkDir(`${targetDirectory}/queryParameters`)];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/errors`)) {
        promises = [...promises, mkDir(`${targetDirectory}/errors`)];
    }
    
    // Create bundle services directory
    if (!fs.existsSync(`${targetDirectory}/configurations`)) {
        promises = [...promises, mkDir(`${targetDirectory}/configurations`)];
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
    
    // Copy EntityMapper
    promises = [...promises, copyFile(
        `${jhipsterDirectoryMap['mappers']}/EntityMapper.java`,
        `${targetDirectory}/mappers/EntityMapper.java`
    )];
    
    // Copy services from template
    promises = [...promises, copy(`${templateDirectory}/statics/services`, `${targetDirectory}/services`, {
        clobber: false
    })];
    
    // Copy errors from template
    promises = [...promises, copy(`${templateDirectory}/statics/errors`, `${targetDirectory}/errors`, {
        clobber: false
    })];
    
    // Copy configurations from template
    promises = [...promises, copy(`${templateDirectory}/statics/configurations`, `${targetDirectory}/configurations`, {
        clobber: false
    })];
    
    return Promise.all(promises);
}
