import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';
import { getJhipsterDirectoryMap } from '../directoryMap';
import path from 'path';
import { Observable } from 'rxjs';

const mkDir = promisify(fs.mkdir);
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
    return new Observable(async observer => {
        observer.next('Drain the chickpeas in a sieve and rinse under cold water. Add them to the tomato mixture and return it to a simmer.');
        
        const targetDirectory = `${options.targetDirectory}`;
        
        // Create bundle model directory and enumeration directory
        if (!fs.existsSync(`${targetDirectory}/models`)) {
            await mkDir(`${targetDirectory}/models/enumerations`, { recursive: true });
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/services`)) {
            await mkDir(`${targetDirectory}/services`, { recursive: true });
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/components`)) {
            await mkDir(`${targetDirectory}/components`);
        }
        
        // Create bundle services directory
        if (!fs.existsSync(`${targetDirectory}/utils`)) {
            await mkDir(`${targetDirectory}/utils`);
        }
        
        observer.complete();
    });
}

async function copyCommondComponent (options) {
    return new Observable(async observer => {
        observer.next('Add the kale to the stew and continue to simmer until tender. Season, to taste, with salt and freshly ground black pepper.');
        const jhipsterDirectoryMap = await getJhipsterDirectoryMap(options);
        const targetDirectory = `${options.targetDirectory}`;
        const templateDirectory = path.resolve(new URL(import.meta.url).pathname, '../../../templates', options.concern);
        
        // Copy enumerations
        await copy(jhipsterDirectoryMap['enumerations'], `${targetDirectory}/models/enumerations`, {
            clobber: false
        });
        
        // Copy services from template
        await copy(`${templateDirectory}/static/services`, `${targetDirectory}/services`, {
            clobber: false
        });
        
        // Copy errors from template
        await  copy(`${templateDirectory}/static/utils`, `${targetDirectory}/utils`, {
            clobber: false
        });
        
        // Copy configurations from template
        await copy(`${templateDirectory}/static/components`, `${targetDirectory}/components`, {
            clobber: false
        });
        
        observer.complete();
    });
}
