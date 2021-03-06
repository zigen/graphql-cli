"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.command = 'query <file>';
exports.describe = 'Run query/mutation';
var fs = require("fs");
var node_fetch_1 = require("node-fetch");
var graphql_1 = require("graphql");
var _1 = require("../");
exports.builder = {
    endpoint: {
        alias: 'e',
        describe: 'Endpoint name',
        type: 'string',
    },
    operation: {
        alias: 'o',
        describe: 'Operation name',
        type: 'string',
    },
    variables: {
        describe: 'GraphQL query variables as JSON string',
        type: 'string',
    },
    all: {
        alias: 'a',
        describe: 'Run all operations in order',
        type: 'boolean',
    },
};
function handler(context, argv) {
    return __awaiter(this, void 0, void 0, function () {
        var config, endpoint, query, document, operationNames, _i, operationNames_1, operationName, selectedOperationNames, _a, selectedOperationNames_1, operationName;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, context.getProjectConfig()];
                case 1:
                    config = _b.sent();
                    if (!config.endpointsExtension) {
                        throw _1.noEndpointError;
                    }
                    endpoint = config.endpointsExtension.getEndpoint(argv.endpoint);
                    query = fs.readFileSync(argv.file, { encoding: 'utf8' });
                    document = graphql_1.parse(query);
                    operationNames = document.definitions.map(function (d) { return d.name.value; });
                    if (!argv.all) return [3 /*break*/, 6];
                    _i = 0, operationNames_1 = operationNames;
                    _b.label = 2;
                case 2:
                    if (!(_i < operationNames_1.length)) return [3 /*break*/, 5];
                    operationName = operationNames_1[_i];
                    return [4 /*yield*/, runQuery(query, operationName, endpoint, argv.variables)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 13];
                case 6:
                    if (!argv.operation) return [3 /*break*/, 8];
                    return [4 /*yield*/, runQuery(query, argv.operation, endpoint, argv.variables)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 8: return [4 /*yield*/, context.prompt({
                        type: 'checkbox',
                        name: 'selectedOperationNames',
                        message: 'Select operation to run',
                        choices: operationNames,
                    })];
                case 9:
                    selectedOperationNames = (_b.sent()).selectedOperationNames;
                    _a = 0, selectedOperationNames_1 = selectedOperationNames;
                    _b.label = 10;
                case 10:
                    if (!(_a < selectedOperationNames_1.length)) return [3 /*break*/, 13];
                    operationName = selectedOperationNames_1[_a];
                    return [4 /*yield*/, runQuery(query, operationName, endpoint, argv.variables)];
                case 11:
                    _b.sent();
                    _b.label = 12;
                case 12:
                    _a++;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.handler = handler;
function runQuery(query, operationName, endpoint, variables) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, node_fetch_1.default(endpoint.url, {
                        method: 'POST',
                        headers: __assign({}, endpoint.headers, { 'Content-Type': 'application/json' }),
                        body: JSON.stringify({
                            query: query,
                            operationName: operationName,
                            variables: parseVariables(variables)
                        }),
                    })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    result = _a.sent();
                    try {
                        console.log(JSON.stringify(result, null, 2));
                    }
                    catch (e) {
                        console.log(JSON.parse(result));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function parseVariables(variables) {
    if (variables === void 0) { variables = '{}'; }
    var obj = {};
    try {
        obj = JSON.parse(variables);
    }
    catch (e) {
        console.error("There was a problem parsing your variables: " + variables);
        console.error("Error: " + e);
        console.error('Passing empty variables instead.');
    }
    return obj;
}
//# sourceMappingURL=query.js.map