"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_parser_1 = require("semver-parser");
class BaseVersionStrategy {
    constructor(options, internalOpts) {
        var _a;
        this.currentVersionObj = null;
        this.options = options;
        this.logger = (_a = internalOpts === null || internalOpts === void 0 ? void 0 : internalOpts.logger) !== null && _a !== void 0 ? _a : console;
    }
    /**
     * Returns an object used for logging
     */
    getLogger() {
        return this.logger;
    }
    /**
     * This is called before getNextVersion() in `VersionBumper.ts`.
     *
     * - Parses string version data into an object
     * - Parses options specific to the strategy
     * @param {string} currentVersion Version number eg '1.2.3'
     */
    async init({ currentVersion }) {
        if (!currentVersion) {
            throw new Error('Strategy init is missing currentVersion');
        }
        this.currentVersionObj = semver_parser_1.parseSemVer(currentVersion);
    }
    /**
     * Describes the options specific to the strategy in the CLI.
     * It is called as part of the CLI / plugin tooling.
     *
     * See https://github.com/yargs/yargs/blob/master/docs/advanced.md#providing-a-command-module
     *
     * Note: handler is not available, and will be overwritten if defined.
     *
     * @return {CommandConfig}
     */
    static getCommandConfig(yargs) {
        return {
            command: '',
            describe: '',
            builder: yargs => { }
        };
    }
    /**
     * Get the high-level options like fileVersion, etc.
     */
    getOptions() {
        return this.options;
    }
    /**
     * Returns a structure that contains metadata about the parsed version.
     */
    getCurrentVersion() {
        return this.currentVersionObj;
    }
    /**
     * Returns the next release version to update the versionFile with.
     * Use getCurrentVersion() to get an object to work with.
     * @returns {Promise<ParsedSemVerResult>} An updated object that was originally defined by getCurrentVersion()
     */
    async getNextVersion() {
        throw new Error('getNextVersion() is not implemented');
    }
}
exports.default = BaseVersionStrategy;
/**
 * The strategy name used for calling the strategy in the cli and configuration file.
 */
BaseVersionStrategy.strategyShortName = 'base';
//# sourceMappingURL=BaseVersionStrategy.js.map