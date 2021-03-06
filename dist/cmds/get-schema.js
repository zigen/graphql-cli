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
var _this = this;
var events_1 = require("events");
var fs = require("fs");
var os = require("os");
var mkdirp = require("mkdirp");
var path_1 = require("path");
var graphql_1 = require("graphql");
var graphql_config_1 = require("graphql-config");
var chalk_1 = require("chalk");
var isUrl = require("is-url-superb");
var lodash_1 = require("lodash");
var emitter = new events_1.EventEmitter();
var log;
var start;
var command = {
    command: 'get-schema',
    describe: 'Download schema from endpoint',
    builder: function (args) {
        return args
            .options({
            watch: {
                alias: 'w',
                boolean: true,
                description: 'watch server for schema changes and update local schema',
            },
            endpoint: {
                alias: 'e',
                describe: 'Endpoint name or URL',
                type: 'string',
            },
            json: {
                alias: 'j',
                describe: 'Output as JSON',
                type: 'boolean',
            },
            output: {
                alias: 'o',
                describe: 'Output file name',
                type: 'string',
            },
            console: {
                alias: 'c',
                describe: 'Output to console',
                default: false,
            },
            insecure: {
                alias: 'i',
                describe: 'Allow insecure (self-signed) certificates',
                type: 'boolean',
            },
            all: {
                describe: 'Get schema for all projects and all endpoints',
                type: 'boolean',
                default: true,
            },
            header: {
                describe: 'Header to use for downloading (with endpoint URL). Format: Header=Value',
                type: 'string',
            },
        })
            .implies('console', ['--no-output', '--no-watch'])
            .implies('json', 'output')
            .implies('--no-endpoint', '--no-header');
    },
    handler: function (context, argv) { return __awaiter(_this, void 0, void 0, function () {
        var spinner, handle_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (argv.endpoint) {
                        argv.all = false;
                    }
                    if (argv.all && !argv.project) {
                        argv.project = argv.endpoint = '*';
                    }
                    spinner = context.spinner;
                    start = function (text) {
                        if (!argv.console) {
                            context.spinner.start(text);
                        }
                    };
                    log = function (text) {
                        if (!argv.console) {
                            context.spinner.text = text;
                        }
                    };
                    if (argv.insecure) {
                        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                    }
                    if (!!argv.watch) return [3 /*break*/, 2];
                    emitter.on('checked', function () {
                        spinner.stop();
                        if (!argv.console) {
                            console.log(spinner.text);
                        }
                        spinner.start();
                    });
                    emitter.on('error', function (err) {
                        if (process.env.DEBUG === '*') {
                            throw err;
                        }
                        else {
                            spinner.fail(chalk_1.default.red(err.message));
                        }
                    });
                    emitter.on('warning', function (message) {
                        spinner.warn(chalk_1.default.yellow(message));
                    });
                    start();
                    return [4 /*yield*/, updateWrapper(context, argv)];
                case 1:
                    _a.sent();
                    spinner.stop();
                    _a.label = 2;
                case 2:
                    if (argv.watch) {
                        emitter.on('checked', function () {
                            spinner.stop();
                            console.log("[" + new Date().toTimeString().split(' ')[0] + "] " + spinner.text);
                            spinner.start('Next update in 10s...');
                        });
                        emitter.on('error', function (err) {
                            spinner.fail(chalk_1.default.red(err.message));
                            clearInterval(handle_1);
                        });
                        emitter.on('warning', function (message) {
                            spinner.warn(chalk_1.default.yellow(message));
                        });
                        updateWrapper(context, argv);
                        spinner.start();
                        handle_1 = setInterval(updateWrapper, 10000, context, argv);
                    }
                    return [2 /*return*/];
            }
        });
    }); },
};
function updateWrapper(context, argv) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, update(context, argv)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    emitter.emit('error', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function update(context, argv) {
    return __awaiter(this, void 0, void 0, function () {
        var projects, _a, _b, _i, projectName, config, endpoints, _c, _d, _e, endpointName, endpoint;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(argv.endpoint && isUrl(argv.endpoint))) return [3 /*break*/, 3];
                    if (!(argv.output || argv.console)) return [3 /*break*/, 2];
                    return [4 /*yield*/, downloadFromEndpointUrl(argv)];
                case 1:
                    _f.sent();
                    return [2 /*return*/];
                case 2:
                    emitter.emit('error', new Error('No output file specified!'));
                    _f.label = 3;
                case 3: return [4 /*yield*/, getProjectConfig(context, argv)];
                case 4:
                    projects = _f.sent();
                    _a = [];
                    for (_b in projects)
                        _a.push(_b);
                    _i = 0;
                    _f.label = 5;
                case 5:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    projectName = _a[_i];
                    config = projects[projectName];
                    if (!config.endpointsExtension) {
                        return [3 /*break*/, 9];
                    }
                    endpoints = getEndpoints(config, argv);
                    _c = [];
                    for (_d in endpoints)
                        _c.push(_d);
                    _e = 0;
                    _f.label = 6;
                case 6:
                    if (!(_e < _c.length)) return [3 /*break*/, 9];
                    endpointName = _c[_e];
                    endpoint = endpoints[endpointName];
                    return [4 /*yield*/, updateSingleProjectEndpoint(config, endpoint, endpointName, argv)];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function downloadFromEndpointUrl(argv) {
    return __awaiter(this, void 0, void 0, function () {
        var endpointHeaders, headers, endpoint;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    endpointHeaders = {};
                    if (argv.header) {
                        headers = Array.isArray(argv.header) ? argv.header : [argv.header];
                        Object.assign.apply(Object, [endpointHeaders].concat(headers.map(function (h) {
                            return (_a = {}, _a[h.split('=')[0]] = h.split('=')[1], _a);
                            var _a;
                        })));
                    }
                    endpoint = new graphql_config_1.GraphQLEndpoint({
                        url: argv.endpoint,
                        headers: endpointHeaders,
                    });
                    return [4 /*yield*/, updateSingleProjectEndpoint(undefined, endpoint, 'unnamed', argv)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function updateSingleProjectEndpoint(config, endpoint, endpointName, argv) {
    return __awaiter(this, void 0, void 0, function () {
        var newSchemaResult, _a, clientSchema, errors, err_2, oldSchema, newSchema, schemaPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log("Downloading introspection from " + chalk_1.default.blue(endpoint.url));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    if (!argv.json) return [3 /*break*/, 3];
                    return [4 /*yield*/, endpoint.resolveIntrospection()];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, endpoint.resolveSchema()
                    // Do not save an invalid schema
                ];
                case 4:
                    _a = _b.sent();
                    _b.label = 5;
                case 5:
                    newSchemaResult = _a;
                    clientSchema = argv.json
                        ? graphql_1.buildClientSchema(newSchemaResult)
                        : newSchemaResult;
                    errors = graphql_1.validateSchema(clientSchema);
                    if (errors.length > 0) {
                        console.error(chalk_1.default.red(os.EOL + "GraphQL endpoint generated invalid schema: " + errors));
                        setTimeout(function () {
                            process.exit(1);
                        }, 500);
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_2 = _b.sent();
                    emitter.emit('warning', err_2.message);
                    return [2 /*return*/];
                case 7:
                    if (!argv.console) {
                        try {
                            oldSchema = argv.output
                                ? fs.readFileSync(argv.output, 'utf-8')
                                : config.getSchemaSDL();
                        }
                        catch (e) {
                            // ignore error if no previous schema file existed
                            if (e.message === 'Unsupported schema file extention. Only ".graphql" and ".json" are supported') {
                                console.error(e.message);
                                setTimeout(function () {
                                    process.exit(1);
                                }, 500);
                            }
                            // TODO: Add other non-blocking errors to this list
                            if (e.message.toLowerCase().indexOf('syntax error') > -1) {
                                console.log(os.EOL + "Ignoring existing schema because it is invalid: " + chalk_1.default.red(e.message));
                            }
                            else if (e.code !== 'ENOENT') {
                                throw e;
                            }
                        }
                        if (oldSchema) {
                            newSchema = argv.json
                                ? JSON.stringify(newSchemaResult, null, 2)
                                : graphql_1.printSchema(newSchemaResult);
                            if (newSchema === oldSchema) {
                                log(chalk_1.default.green("" + (config && config.projectName && config.projectName !== 'unnamed'
                                    ? "project " + chalk_1.default.blue(config.projectName) + " - "
                                    : '') + (endpointName && endpointName !== 'unnamed'
                                    ? "endpoint " + chalk_1.default.blue(endpointName) + " - "
                                    : '') + "No changes"));
                                emitter.emit('checked');
                                return [2 /*return*/];
                            }
                        }
                    }
                    schemaPath = argv.output;
                    if (!argv.console) return [3 /*break*/, 8];
                    console.log(argv.json
                        ? JSON.stringify(newSchemaResult, null, 2)
                        : graphql_1.printSchema(newSchemaResult));
                    return [3 /*break*/, 11];
                case 8:
                    if (!argv.json) return [3 /*break*/, 9];
                    if (!fs.existsSync(schemaPath)) {
                        mkdirp.sync(path_1.dirname(schemaPath));
                    }
                    fs.writeFileSync(argv.output, JSON.stringify(newSchemaResult, null, 2));
                    return [3 /*break*/, 11];
                case 9:
                    schemaPath = schemaPath || config.schemaPath;
                    if (!fs.existsSync(schemaPath)) {
                        mkdirp.sync(path_1.dirname(schemaPath));
                    }
                    return [4 /*yield*/, graphql_config_1.writeSchema(schemaPath, newSchemaResult, {
                            source: endpoint.url,
                            timestamp: new Date().toString(),
                        })];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    if (schemaPath) {
                        log(chalk_1.default.green("" + (config && config.projectName && config.projectName !== 'unnamed'
                            ? "project " + chalk_1.default.blue(config.projectName) + " - "
                            : '') + (endpointName && endpointName !== 'unnamed'
                            ? "endpoint " + chalk_1.default.blue(endpointName) + " - "
                            : '') + "Schema file was " + (oldSchema ? 'updated' : 'created') + ": " + chalk_1.default.blue(path_1.relative(process.cwd(), schemaPath))));
                    }
                    emitter.emit('checked');
                    return [2 /*return*/];
            }
        });
    });
}
function getProjectConfig(context, argv) {
    return __awaiter(this, void 0, void 0, function () {
        var config, projects, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, context.getConfig()];
                case 1:
                    config = _b.sent();
                    if (argv.project) {
                        if (Array.isArray(argv.project)) {
                            projects = {};
                            argv.project.map(function (p) {
                                return lodash_1.merge(projects, (_a = {}, _a[p] = config.getProjectConfig(p), _a));
                                var _a;
                            });
                        }
                        else if (argv.project === '*') {
                            projects = config.getProjects();
                        }
                        else {
                            // Single project mode
                            projects = (_a = {}, _a[argv.project] = config.getProjectConfig(argv.project), _a);
                        }
                    }
                    else {
                        // Process all projects
                        projects = { unnamed: config.getProjectConfig() };
                    }
                    if (!projects) {
                        throw new Error('No projects defined in config file');
                    }
                    return [2 /*return*/, projects];
            }
        });
    });
}
function getEndpoints(config, argv) {
    var endpoints;
    if (argv.endpoint) {
        if (Array.isArray(argv.endpoint)) {
            endpoints = {};
            argv.endpoint.map(function (e) {
                return lodash_1.merge(endpoints, (_a = {}, _a[e] = config.endpointsExtension.getEndpoint(e), _a));
                var _a;
            });
        }
        else if (argv.endpoint === '*') {
            endpoints = Object.keys(config.endpointsExtension.getRawEndpointsMap()).reduce(function (total, current) {
                lodash_1.merge(total, (_a = {},
                    _a[current] = config.endpointsExtension.getEndpoint(current),
                    _a));
                return total;
                var _a;
            }, {});
        }
        else {
            endpoints = (_a = {},
                _a[argv.endpoint] = config.endpointsExtension.getEndpoint(argv.endpoint),
                _a);
        }
    }
    else {
        endpoints = {
            unnamed: config.endpointsExtension.getEndpoint(argv.endpoint),
        };
    }
    return endpoints;
    var _a;
}
module.exports = command;
//# sourceMappingURL=get-schema.js.map