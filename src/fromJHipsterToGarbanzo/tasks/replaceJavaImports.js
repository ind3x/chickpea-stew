import { promisify } from 'util';
import fs from 'fs';
import { Observable } from 'rxjs';
import glob from 'glob';
import path from 'path';
import replaceInFile from 'replace-in-file';
import { stewOptions as options } from '../../main';

const matchFiles = promisify(glob);
const readFile = promisify(fs.readFile);

export function replaceJavaImports () {
    return [
        {
            title: 'Choosing right cutlery (replace Java imports)',
            task: () => new Observable(async observer => {
                const files = await matchFiles(`${options.targetDirectory}/**/*.java`);
                const mappedImports = await getMappedImports(files, options);
                
                for (const file of files) {
                    for (const mappedImport of mappedImports) {
                        await replaceInFile({
                            files: file,
                            from: `import ${mappedImport[0]}`,
                            to: `import ${mappedImport[1]}`
                        });
                    }
                }
                
                observer.complete();
            })
        }
    ];
}

async function getMappedImports (files) {
    const jhipsterConfig = JSON.parse(await readFile(`${options.sourceDirectory}/.yo-rc.json`));
    const jhipsterPackageFolder = jhipsterConfig['generator-jhipster'].packageName;
    
    let mapping = [
        [
            `${jhipsterPackageFolder}.domain.*`,
            `${options.packageName}.*`
        ]
    ];
    for (const file of files) {
        const jhipsterImport = await getJHipsterFileImport(file);
        const garbanzoImport = getGarbanzoFileImport(file);
        mapping = [...mapping, [jhipsterImport, garbanzoImport]];
    }
    return mapping;
}

function getGarbanzoFileImport (file) {
    const fileName = path.basename(file).replace(path.extname(file), '');
    const fileRelativaPath = path.dirname(file).replace(`${options.targetDirectory}/`, '').replace(/\//g, '.');
    return `${options.packageName}.${fileRelativaPath}.${fileName}`;
}

async function getJHipsterFileImport (file) {
    const fileName = path.basename(file).replace(path.extname(file), '');
    const jhipsterConfig = JSON.parse(await readFile(`${options.sourceDirectory}/.yo-rc.json`));
    const jhipsterPackageFolder = jhipsterConfig['generator-jhipster'].packageName;
    
    let jhipsterImport;
    if (file.indexOf('services/dto') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.service.dto.${fileName}`;
    } else if (file.indexOf('services') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.service.${fileName}`;
    }
    if (file.indexOf('mappers') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.service.mapper.${fileName}`;
    }
    if (file.indexOf('models/enumerations') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.domain.enumeration.${fileName}`;
    } else if (file.indexOf('models') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.domain.${fileName}`;
    }
    if (file.indexOf('repositories') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.repository.${fileName}`;
    }
    if (file.indexOf('controllers') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.web.rest.${fileName.replace('Controller', 'Resource')}`;
    }
    if (file.indexOf('errors') !== -1) {
        jhipsterImport = `${jhipsterPackageFolder}.web.rest.errors.${fileName}`;
    }
    
    return jhipsterImport;
}
