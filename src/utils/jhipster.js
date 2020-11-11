import execa from 'execa';
import chalk from 'chalk';
import { promisify } from 'util';
import fs from 'fs';
import { stewOptions as options } from '../main';

const readFile = promisify(fs.readFile);

export async function checkJhipsterApplicationJdl () {
    try {
        await readFile(`${options.sourceDirectory}/application.jdl`);
        return true;
    } catch (e) {
        console.error('%s Cannot find JHipster cubes (cannot read application.jdl)', chalk.red.bold('ERROR'));
        process.exit(1);
    }
}

export async function execJhipster () {
    const result = await execa('jhipster', ['--force', '--skip-install'], {
        cwd: options.sourceDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('An elderly woman has buyed the last JHipster cubes (error creating JHipster application)'));
    }
    return Promise.resolve('Done');
}

export async function importJhipsterJdl () {
    const result = await execa('jhipster', ['import-jdl', 'application.jdl'], {
        cwd: options.sourceDirectory
    });
    if (result.failed) {
        return Promise.reject(new Error('You have messed up with your JHipster cubes (cannot import JDL)'));
    }
    return Promise.resolve('Done');
}
