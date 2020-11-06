import { promisify } from 'util';
import { Observable } from 'rxjs';
import glob from 'glob';
import path from 'path';
import replaceInFile from 'replace-in-file';
import { stewOptions as options } from '../../main';

const matchFiles = promisify(glob);

function getFilePackageName (file) {
    const fileRelativaPath = path.dirname(file).replace(`${options.targetDirectory}/`, '').replace(/\//g, '.');
    return `${options.packageName}.${fileRelativaPath}`;
}

export function replaceJavaPackageName () {
    return [
        {
            title: 'Looking for elegant soup bowls (replace Java package names from files)',
            task: () => new Observable(async observer => {
                const files = await matchFiles(`${options.targetDirectory}/**/*.java`);
                for (const file of files) {
                    await replaceInFile({
                        files: file,
                        from: /^.*\package\b.*$/gm,
                        to: `package ${getFilePackageName(file, options)}`
                    });
                }
                
                observer.complete();
            })
        }
    ];
}

