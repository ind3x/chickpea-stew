
import fs from 'fs';
import { getDirectoryMap } from '../directoryMap';
import { promisify } from 'util';
import { camelCase } from 'text-case';

const readDir = promisify(fs.readdir);
const mkDir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

export async function generateBackendBundles (options) {
    const bundlesDirectory = `${options.targetDirectory}/bundles`;
    try {
        if (!fs.existsSync(bundlesDirectory)) {
            await mkDir(bundlesDirectory);
        }
    } catch (e) {
        return Promise.reject(new Error('Cannot create bundles directory'));
    }
    
    const directoryMap = await getDirectoryMap(options);
    
    let models;
    try {
        models = await readDir(directoryMap['models']);
    } catch (e) {
        return Promise.reject(new Error('Cannot find JHipster cubes'));
    }
    
    for (const model of models) {
        if (isDir(`${directoryMap['models']}/${model}`) || model.indexOf('.java') === -1) {
            continue;
        }
        
        // Get model name
        const modelName = model.split('.').shift();
        
        try {
            // Create bundle directory
            const bundlePath = `${bundlesDirectory}/${camelCase(modelName)}`;
            if (!fs.existsSync(bundlePath)) {
                await mkDir(bundlePath);
            }
            
            // Create bundle model directory
            if (!fs.existsSync(`${bundlePath}/models`)) {
                await mkDir(`${bundlePath}/models`);
            }
            
            // Copy model
            await copyFile(
                `${directoryMap['models']}/${model}`,
                `${bundlePath}/models/${model}`
            );
            
            // Create bundle repository directory
            if (!fs.existsSync(`${bundlePath}/repositories`)) {
                await mkDir(`${bundlePath}/repositories`);
            }
            
            // Copy repository
            if (fs.existsSync(`${directoryMap['repositories']}/${modelName}Repository.java`)) {
                await copyFile(
                    `${directoryMap['repositories']}/${modelName}Repository.java`,
                    `${bundlePath}/repositories/${modelName}Repository.java`
                );
            }
    
            // Create bundle services directory
            if (!fs.existsSync(`${bundlePath}/services`)) {
                await mkDir(`${bundlePath}/services`);
            }
    
            // Copy repository
            if (fs.existsSync(`${directoryMap['services']}/${modelName}Service.java`)) {
                await copyFile(
                    `${directoryMap['services']}/${modelName}Service.java`,
                    `${bundlePath}/services/${modelName}Service.java`
                );
            }
        } catch (e) {
        
        }
    }
}

function isDir (path) {
    return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
}
