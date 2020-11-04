import fs from 'fs';
import { getJhipsterDirectoryMap } from '../directoryMap';
import { promisify } from 'util';
import { camelCase } from 'text-case';

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export function generateBackendBundles (options) {
    return [
        {
            title: 'Heating up Chickpea stew (generating Chickpea bundles directories)',
            task: () => makeBundleDirectories(options)
        },
        {
            title: 'Adding JHipster cubes (copying JHipster files to Chickpea bundles)',
            task: () => copyJHipsterFilesToBundles(options)
        }
    ];
}

/**
 *
 * @param options
 * @returns {Promise<any>}
 */
async function makeBundleDirectories (options) {
    const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
    const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
    
    // Create bundle directory
    try {
        if (!fs.existsSync(bundleTargetDirectory)) {
            await mkDir(bundleTargetDirectory);
        }
    } catch (e) {
        return Promise.reject(new Error('Cannot create Chickpea bundles directory'));
    }
    
    let models;
    try {
        models = await readDir(jhipsterDirectoryMap['models']);
    } catch (e) {
        return Promise.reject(new Error('Cannot find JHipster cubes'));
    }
    
    let promises = [];
    for (const model of models) {
        if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
            continue;
        }
        
        // Get model name
        const modelName = model.split('.').shift();
        
        // Create bundle directory
        const bundlePath = `${bundleTargetDirectory}/${camelCase(modelName)}`;
        if (!fs.existsSync(bundlePath)) {
            promises = [...promises, mkDir(bundlePath)];
        }
        
        // Create bundle model directory
        if (!fs.existsSync(`${bundlePath}/models`)) {
            promises = [...promises, mkDir(`${bundlePath}/models`, { recursive: true })];
        }
        
        // Create bundle repository directory
        if (!fs.existsSync(`${bundlePath}/repositories`)) {
            promises = [...promises, mkDir(`${bundlePath}/repositories`, { recursive: true })];
        }
        
        // Create bundle services directory and dto recursively
        if (!fs.existsSync(`${bundlePath}/services/dto`)) {
            promises = [...promises, mkDir(`${bundlePath}/services/dto`, { recursive: true })];
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${bundlePath}/mappers`)) {
            promises = [...promises, mkDir(`${bundlePath}/mappers`, { recursive: true })];
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${bundlePath}/controllers`)) {
            promises = [...promises, mkDir(`${bundlePath}/controllers`, { recursive: true })];
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${bundlePath}/queryParameters`)) {
            promises = [...promises, mkDir(`${bundlePath}/queryParameters`, { recursive: true })];
        }
    }
    
    return Promise.all(promises);
}

/**
 * Copy
 * @param options
 * @returns {Promise<boolean>}
 */
async function copyJHipsterFilesToBundles (options) {
    const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
    const bundleTargetDirectory = `${options.targetDirectory}/bundles`;
    let models;
    
    try {
        models = await readDir(jhipsterDirectoryMap['models']);
    } catch (e) {
        return Promise.reject(new Error('Cannot find JHipster cubes'));
    }
    
    let promises = [];
    for (const model of models) {
        if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
            continue;
        }
        
        // Get model name
        const modelName = model.split('.').shift();
        const bundlePath = `${bundleTargetDirectory}/${camelCase(modelName)}`;
        
        // Copy model
        promises = [...promises, copyFile(
            `${jhipsterDirectoryMap['models']}/${model}`,
            `${bundlePath}/models/${model}`
        )];
        
        // Copy repository
        if (fs.existsSync(`${jhipsterDirectoryMap['repositories']}/${modelName}Repository.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['repositories']}/${modelName}Repository.java`,
                `${bundlePath}/repositories/${modelName}Repository.java`
            )];
        }
        
        // Copy service interfaces
        if (fs.existsSync(`${jhipsterDirectoryMap['services']}/${modelName}Service.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['services']}/${modelName}Service.java`,
                `${bundlePath}/services/${modelName}Service.java`
            )];
        }
        
        // Copy service implementation
        if (fs.existsSync(`${jhipsterDirectoryMap['services']}/impl/${modelName}ServiceImpl.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['services']}/impl/${modelName}ServiceImpl.java`,
                `${bundlePath}/services/${modelName}ServiceImpl.java`
            )];
        }
        
        // Copy service dto
        if (fs.existsSync(`${jhipsterDirectoryMap['services']}/dto/${modelName}DTO.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['services']}/dto/${modelName}DTO.java`,
                `${bundlePath}/services/dto/${modelName}DTO.java`
            )];
        }
        
        // Copy mappers
        if (fs.existsSync(`${jhipsterDirectoryMap['mappers']}/${modelName}Mapper.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['mappers']}/${modelName}Mapper.java`,
                `${bundlePath}/mappers/${modelName}Mapper.java`
            )];
        }
        
        // Copy controllers
        if (fs.existsSync(`${jhipsterDirectoryMap['controllers']}/${modelName}Resource.java`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['controllers']}/${modelName}Resource.java`,
                `${bundlePath}/controllers/${modelName}Controller.java`
            )];
        }
    }
    
    return Promise.all(promises);
}

/**
 * Check if given path is a directory
 * @param path
 * @returns {boolean}
 */
function isDir (path) {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}
