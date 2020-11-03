import arg from 'arg';
import inquirer from 'inquirer';
import { stew } from './main';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--source': String,
            '--target': String,
            '-S': '--source',
            '-T': '--target',
        },
        {
            argv: rawArgs.slice(2),
        }
    );

    return {
        sourceDirectory: args['--source'] || false,
        targetDirectory: args['--target'] || false,
        concern: args._[0],
    };
}

async function promptForMissingOptions(options) {
    const defaultConcern = 'Backend';
    
    const questions = [];
    if (!options.concern) {
        questions.push({
            type: 'list',
            name: 'concern',
            message: 'Please choose which stew to cook',
            choices: ['Backend', 'Frontend', 'All'],
            default: defaultConcern,
        });
    }
    
    if (!options.sourceDirectory) {
        questions.push({
            type: 'input',
            name: 'sourceDirectory',
            message: 'Set JHipster directory',
            default: process.cwd() + '/tools/jhipster',
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
    
    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        concern: options.concern || answers.concern,
        sourceDirectory: options.sourceDirectory || answers.sourceDirectory,
        targetDirectory: options.targetDirectory || answers.targetDirectory,
    };
}

export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await stew(options);
}
