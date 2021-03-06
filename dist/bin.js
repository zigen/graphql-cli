#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var chalk_1 = require("chalk");
var showedHelp = false;
index_1.installCommands()
    .demandCommand(1, 1, 'Missing command name')
    .env('GRAPHQL_CONFIG')
    .strict()
    .help()
    .completion('completion', false)
    .usage("Usage: " + chalk_1.default.green('graphql') + " [command]")
    .example('graphql init', 'Interactively setup .graphqlconfig file')
    .example('graphql get-schema -e dev', 'Update local schema to match "dev" endpoint')
    .example('graphql diff -e dev -t prod', 'Show schema diff between "dev" and "prod" endpoints')
    .describe('dotenv', 'Path to .env file')
    .string('dotenv')
    .alias('p', 'project')
    .describe('p', 'Project name')
    .string('p')
    .alias('h', 'help')
    .alias('v', 'version')
    .epilogue('For more information go to https://github.com/graphql-cli/graphql-cli')
    .fail(function (msg, err, yargs) {
    if (err)
        throw err; // preserve stack
    if (!showedHelp) {
        yargs.showHelp();
        showedHelp = true;
    }
    if (msg !== 'Missing command name') {
        console.error(chalk_1.default.red(msg));
    }
    // tslint:disable-next-line
}).argv;
//# sourceMappingURL=bin.js.map