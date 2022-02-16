"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = exports.readVersionFile = exports.writeVersionFile = exports.getFileContents = exports.getValue = void 0;
const fs_1 = require("fs");
const util_1 = __importDefault(require("util"));
const path_1 = require("path");
const writeFileAsync = util_1.default.promisify(fs_1.writeFile);
const readFileAsync = util_1.default.promisify(fs_1.readFile);
const debug = require('debug')('utils');
/**
 * This is mainly used for parsing options, since each config parameter can be
 * either a string or function.
 * - If a value is a function, execute and return it.
 * - If a value is text, return it
 * @param {function|string} value
 * @param {object} [options] Options to feed into the value, if it is a function
 * @returns {Promise<*>}
 */
async function getValue(value, options = {}) {
    if (typeof value === 'function') {
        return value(options);
    }
    if (typeof value === 'string' || typeof value === 'boolean') {
        return value;
    }
    debug('getValue(): Value was not a string or function: ', value);
}
exports.getValue = getValue;
/**
 * Gets the raw file data
 * @param {string} filePath Full path of the file to read
 * @return {Promise<string>} Contents of the file
 */
async function getFileContents(filePath) {
    if (!filePath) {
        throw new Error('_getFileContents() requires the file name.');
    }
    let fileContents = null;
    try {
        fileContents = await readFileAsync(filePath, 'utf8');
    }
    catch (e) {
        debug(e);
        throw new Error(`Unable to read file at: ${filePath}`);
    }
    return fileContents;
}
exports.getFileContents = getFileContents;
async function writeVersionFile(projectRoot, versionFile, data) {
    const versionFilePath = path_1.join(projectRoot, versionFile);
    try {
        await writeFileAsync(versionFilePath, data);
    }
    catch (e) {
        debug(e);
        throw new Error(`Unable to write the versionFile at: ${versionFilePath}`);
    }
}
exports.writeVersionFile = writeVersionFile;
async function readVersionFile(projectRoot, versionFile, internalOpts) {
    var _a;
    let logger = (_a = internalOpts === null || internalOpts === void 0 ? void 0 : internalOpts.logger) !== null && _a !== void 0 ? _a : console;
    const versionFilePath = path_1.join(projectRoot, versionFile);
    logger.info(`Reading version file: ${versionFilePath}`);
    let data = await getFileContents(versionFilePath);
    try {
        data = JSON.parse(data);
    }
    catch (e) {
        debug(e);
        throw new Error('Unable to JSON parse the package file data');
    }
    if (!data.version) {
        throw new Error('The JSON data did not contain a "version" field.');
    }
    return data;
}
exports.readVersionFile = readVersionFile;
/**
 * Goes through each parameter and resolves the config value, if required.
 * @param {object} options
 * @returns {Promise<object>} Object with resolved values.
 * @private
 */
async function parseOptions(options, skipOver = {}) {
    if (typeof options !== 'object') {
        return {};
    }
    // Have to use for...in because .map does not support
    // await/async
    for (let name in options) {
        const value = options[name];
        // Don't resolve the value if the property is in
        // the skip definitions
        if (skipOver[name]) {
            continue;
        }
        options[name] = await getValue(value);
    }
    return options;
}
exports.parseOptions = parseOptions;
//# sourceMappingURL=utils.js.map