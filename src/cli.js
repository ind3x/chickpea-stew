import arg from 'arg';
import inquirer from 'inquirer';
import { stew } from './main';

function parseArgumentsIntoOptions (rawArgs) {
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
            argv: rawArgs.slice(2)
        }
    );
    
    return {
        sourceDirectory: args['--source'] || false,
        targetDirectory: args['--target'] || false,
        packageName: args['--package'] || false,
        jhipster: args['--jhipster'] || false,
        concern: args._[0] ? args._[0].toLowerCase() : false
    };
}

async function promptForMissingOptions (options) {
    let questions = [];
    if (!options.concern) {
        questions.push({
            type: 'list',
            name: 'concern',
            message: 'Which Garbanzo stew do you want to cook?',
            choices: ['Backend', 'Frontend'],
            default: 'Backend'
        });
    }
    
    if (!options.sourceDirectory) {
        questions.push({
            type: 'input',
            name: 'sourceDirectory',
            message: 'Set JHipster directory',
            default: `${process.cwd()}/tools/jhipster`
        });
    }
    
    if (!options.targetDirectory) {
        questions.push({
            type: 'input',
            name: 'targetDirectory',
            message: 'Set Garbanzo directory',
            default: `${process.cwd()}/target`
        });
    }
    
    if (!options.jhipster) {
        questions.push({
            type: 'confirm',
            name: 'jhipster',
            message: 'Buy JHipster cubes before cook (create JHipster application)?',
            default: false
        });
    }
    
    // If backend, show package name question
    let answers = await inquirer.prompt(questions);
    questions = [];
    
    // To lowercase in case of set from questions
    if (typeof answers.concern !== 'undefined') {
        answers.concern = answers.concern.toLowerCase();
    }
    
    if ([options.concern, answers.concern].indexOf('backend') !== -1 && !options.packageName) {
        questions.push({
            type: 'input',
            name: 'packageName',
            message: 'Set Garbanzo package name',
            default: 'com.chickpea.stew'
        });
    }
    
    // Get all answers and return all options
    answers = { ...answers, ...await inquirer.prompt(questions) };
    return {
        ...options,
        concern: options.concern || answers.concern.toLowerCase(),
        sourceDirectory: options.sourceDirectory || answers.sourceDirectory,
        targetDirectory: options.targetDirectory || answers.targetDirectory,
        packageName: options.packageName || answers.packageName,
        jhipster: options.jhipster || answers.jhipster
    };
}

export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await stew(options);
}
