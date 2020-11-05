import arg from 'arg';
import inquirer from 'inquirer';
import { stew } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--source': String,
            '--target': String,
            '--package': String,
            '--jhipster': Boolean,
            '-S': '--source',
            '-T': '--target',
            '-pkg': '--package',
            '-j': '--jhipster'
            
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    return {
        sourceDirectory: args['--source'] || false,
        targetDirectory: args['--target'] || false,
        packageName: args['--package'] || false,
        jhipster: args['--jhipster'] || false,
        concern: args._[0],
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
    if (!options.concern) {
        questions.push({
            type: 'list',
            name: 'concern',
            message: 'Please choose which stew to cook',
            choices: ['Backend', 'Frontend'],
            default: 'Backend',
        });
    }
    
    if (!options.sourceDirectory) {
        questions.push({
            type: 'input',
            name: 'sourceDirectory',
            message: 'Set JHipster directory',
            default: `${process.cwd()}/tools/jhipster`,
        });
    }
    
    if (!options.targetDirectory) {
        questions.push({
            type: 'input',
            name: 'targetDirectory',
            message: 'Set Chickpea directory',
            default: `${process.cwd()}/target`,
        });
    }
    
    let answers = await inquirer.prompt(questions);
    if ([options.concern, answers.concern].indexOf('backend') !== -1 && !options.packageName) {
        questions.push({
            type: 'input',
            name: 'packageName',
            message: 'Set Chickpea package name',
            default: 'com.chickpea.stew',
        });
    }
    
    if (!options.jhipster) {
        questions.push({
            type: 'confirm',
            name: 'jhipster',
            message: 'Buy JHipster cubes before cook?',
            default: false,
        });
    }
    
    answers = await inquirer.prompt(questions);
    return {
        ...options,
        concern: options.concern || answers.concern,
        sourceDirectory: options.sourceDirectory || answers.sourceDirectory,
        targetDirectory: options.targetDirectory || answers.targetDirectory,
        packageName: options.packageName || answers.packageName,
        jhipster: options.jhipster || answers.jhipster,
    };
}

export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await stew(options);
}
