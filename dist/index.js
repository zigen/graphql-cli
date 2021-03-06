"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var _ = require("lodash");
var ora = require("ora");
var inquirer = require("inquirer");
var npmPaths = require("npm-paths");
var dotenv = require("dotenv");
var chalk_1 = require("chalk");
var graphql_config_extension_graphcool_1 = require("graphql-config-extension-graphcool");
var graphql_config_extension_prisma_1 = require("graphql-config-extension-prisma");
var graphql_config_extension_openapi_1 = require("graphql-config-extension-openapi");
var graphql_config_1 = require("graphql-config");
var updateNotifier = require("update-notifier");
var pkg = require('../package.json');
require("source-map-support/register");
__export(require("./utils"));
updateNotifier({ pkg: pkg }).notify();
function listPluggings(dir) {
    return fs_1.readdirSync(dir)
        .filter(function (moduleName) { return moduleName.startsWith('graphql-cli-'); })
        .map(function (moduleName) { return path_1.join(dir, moduleName); });
}
function installCommands() {
    var plugins = _(npmPaths())
        .filter(fs_1.existsSync)
        .map(listPluggings)
        .flatten()
        .uniq()
        .value();
    var yargs = require('yargs');
    var processedCommands = {};
    for (var _i = 0, _a = ['./cmds'].concat(plugins); _i < _a.length; _i++) {
        var moduleName = _a[_i];
        try {
            var cmdModule = require(moduleName);
            var cmdModules = Array.isArray(cmdModule) ? cmdModule : [cmdModule];
            for (var _b = 0, cmdModules_1 = cmdModules; _b < cmdModules_1.length; _b++) {
                var cmd = cmdModules_1[_b];
                var commandName = cmd.command.split(' ')[0];
                if (!processedCommands[commandName]) {
                    yargs = yargs.command(wrapCommand(cmd));
                    processedCommands[commandName] = moduleName;
                }
            }
        }
        catch (e) {
            console.log("Can't load " + moduleName + " plugin:" + e.stack);
        }
    }
    return yargs;
}
exports.installCommands = installCommands;
function wrapCommand(commandObject) {
    var originalHandler = commandObject.handler;
    commandObject.handler = function (argv) {
        // load env vars from .env file
        var envPath = argv['dotenv'] || '.env';
        dotenv.config({ path: envPath });
        // prepare context object
        var context = {
            prompt: inquirer.createPromptModule(),
            spinner: ora(),
            getProjectConfig: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var config, error_1, config_1, projectNames, projectName;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!!config) return [3 /*break*/, 10];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 5, , 9]);
                                config = argv['project']
                                    ? graphql_config_1.getGraphQLProjectConfig(process.cwd(), argv['project'])
                                    : graphql_config_1.getGraphQLProjectConfig(process.cwd());
                                config.config = graphql_config_1.resolveEnvsInValues(config.config, process.env);
                                return [4 /*yield*/, graphql_config_extension_graphcool_1.patchEndpointsToConfig(config, process.cwd())];
                            case 2:
                                config = _a.sent();
                                return [4 /*yield*/, graphql_config_extension_prisma_1.patchEndpointsToConfig(config, process.cwd())];
                            case 3:
                                config = _a.sent();
                                return [4 /*yield*/, graphql_config_extension_openapi_1.patchEndpointsToConfig(config)];
                            case 4:
                                config = _a.sent();
                                return [3 /*break*/, 9];
                            case 5:
                                error_1 = _a.sent();
                                config_1 = graphql_config_1.getGraphQLConfig(process.cwd());
                                projectNames = Object.keys(config_1.getProjects() || {});
                                if (!projectNames) return [3 /*break*/, 7];
                                if (error_1.message.includes('multiproject')) {
                                    console.log(chalk_1.default.yellow('No project name specified'));
                                }
                                else if (error_1.message.includes('not a valid project name')) {
                                    console.log(chalk_1.default.yellow('Invalid project name specified'));
                                }
                                return [4 /*yield*/, inquirer.prompt({
                                        type: 'list',
                                        name: 'projectName',
                                        choices: projectNames,
                                        message: 'Select a project:',
                                    })];
                            case 6:
                                projectName = (_a.sent()).projectName;
                                argv['project'] = projectName;
                                return [3 /*break*/, 8];
                            case 7: throw error_1;
                            case 8: return [3 /*break*/, 9];
                            case 9: return [3 /*break*/, 0];
                            case 10: return [2 /*return*/, config];
                        }
                    });
                });
            },
            getConfig: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var config;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                config = graphql_config_1.getGraphQLConfig(process.cwd());
                                config.config = graphql_config_1.resolveEnvsInValues(config.config, process.env);
                                return [4 /*yield*/, graphql_config_extension_graphcool_1.patchEndpointsToConfig(config)];
                            case 1:
                                config = _a.sent();
                                return [4 /*yield*/, graphql_config_extension_prisma_1.patchEndpointsToConfig(config)];
                            case 2:
                                config = _a.sent();
                                return [4 /*yield*/, graphql_config_extension_openapi_1.patchEndpointsToConfig(config)];
                            case 3:
                                config = _a.sent();
                                return [2 /*return*/, config];
                        }
                    });
                });
            },
        };
        var result = new Promise(function (resolve, reject) {
            try {
                resolve(originalHandler(context, argv));
            }
            catch (e) {
                reject(e);
            }
        });
        result.catch(function (e) {
            if (context.spinner['enabled']) {
                context.spinner.fail();
            }
            if (process.env.DEBUG === '*') {
                if (e.stack) {
                    console.log(e.stack);
                }
                else {
                    console.log(e);
                }
            }
            else {
                console.log(chalk_1.default.red(e.message));
            }
            if (e instanceof graphql_config_1.ConfigNotFoundError) {
                console.log(chalk_1.default.yellow("\nRun " + chalk_1.default.green('graphql init') + " to create new .graphqlconfig"));
            }
            process.exitCode = 1;
        });
    };
    return commandObject;
}
//# sourceMappingURL=index.js.map