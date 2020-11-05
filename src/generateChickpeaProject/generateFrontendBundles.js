import fs from 'fs';
import { getJhipsterDirectoryMap } from '../directoryMap';
import { promisify } from 'util';
import { camelCase } from 'text-case';

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export function generateFrontendBundles (options) {
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
            await mkDir(bundleTargetDirectory, { recursive: true });
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
        if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.ts') === -1) {
            continue;
        }
        
        // Get model name
        const modelName = model.split('.').shift();
        
        // Create bundle directory
        const bundlePath = `${bundleTargetDirectory}/${modelName}`;
        if (!fs.existsSync(bundlePath)) {
            promises = [...promises, mkDir(bundlePath, { recursive: true })];
        }
        
        // Create bundle model directory
        if (!fs.existsSync(`${bundlePath}/models`)) {
            promises = [...promises, mkDir(`${bundlePath}/models`, { recursive: true })];
        }
        
        // Create bundle services directory and dto recursively
        if (!fs.existsSync(`${bundlePath}/services`)) {
            promises = [...promises, mkDir(`${bundlePath}/services`, { recursive: true })];
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${bundlePath}/components`)) {
            promises = [...promises, mkDir(`${bundlePath}/components`, { recursive: true })];
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
        if (isDir(`${jhipsterDirectoryMap['models']}/${model}`) || model.indexOf('.ts') === -1) {
            continue;
        }
        
        // Get model name
        const modelName = model.split('.').shift();
        const bundlePath = `${bundleTargetDirectory}/${modelName}`;
        
        // Copy model
        promises = [...promises, copyFile(
            `${jhipsterDirectoryMap['models']}/${model}`,
            `${bundlePath}/models/${model}`
        )];
        
        // Copy service
        if (fs.existsSync(`${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.service.ts`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.service.ts`,
                `${bundlePath}/services/${modelName}.service.ts`
            )];
        }
        
        // Copy module
        if (fs.existsSync(`${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.module.ts`)) {
            promises = [...promises, copyFile(
                `${jhipsterDirectoryMap['entities']}/${modelName}/${modelName}.module.ts`,
                `${bundlePath}/${modelName}.module.ts`
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
