"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const path_1 = require("path");
const version_utils_1 = require("./version-utils");
/**
 * Facade that interfaces to the changelog classes. Main entry point for the command line.
 * See the respective classes for parameter info.
 **/
class VersionBumper {
    constructor(options, internalOpts) {
        var _a;
        this.options = options;
        this.strategyInstance = null;
        this.packageData = null;
        this.logger = (_a = internalOpts === null || internalOpts === void 0 ? void 0 : internalOpts.logger) !== null && _a !== void 0 ? _a : console;
    }
    /**
     * Call this first before calling one of the public facing methods.
     * @returns {Promise<void>}
     */
    async initStrategy(Strategy) {
        if (!Strategy) {
            throw new Error('VersionBumper#initStrategy() requires the Strategy parameter');
        }
        this.strategyInstance = new Strategy(this.options, {
            logger: this.logger
        });
        const { projectRoot, versionFile } = this.options;
        if (!versionFile) {
            throw new Error('Required option not defined: versionFile');
        }
        if (!projectRoot) {
            throw new Error('Required option not defined: projectRoot');
        }
        this.packageData = await utils_1.readVersionFile(projectRoot, versionFile, {
            logger: this.logger
        });
        await this.strategyInstance.init({
            currentVersion: this.packageData.version
        });
    }
    /**
     * Runs the procedures to update the version number
     * @returns {Promise<void>}
     */
    async bumpVersion() {
        const { projectRoot, versionFile, onBeforeRelease } = this.options;
        if (!this.strategyInstance) {
            throw new Error('VersionBumper#init() was not called before bumpVersion()');
        }
        this.logger.info('Executing strategy...');
        const packageData = this.packageData;
        // execute the strategy
        let newVersion = await this.strategyInstance.getNextVersion();
        if (onBeforeRelease) {
            newVersion = await onBeforeRelease(newVersion);
        }
        this.logger.info('Old version:', packageData.version);
        packageData.version = version_utils_1.versionObjToString(newVersion);
        this.logger.info('New version:', packageData.version);
        if (this.options.simulate) {
            this.logger.info('Simulate option used. Version file not updated.');
            return;
        }
        this.logger.info('Version updated in:', path_1.join(projectRoot, versionFile));
        await utils_1.writeVersionFile(projectRoot, versionFile, 
        // @ts-ignore
        JSON.stringify(packageData, 0, 2) + '\n');
    }
}
exports.default = VersionBumper;
//# sourceMappingURL=VersionBumper.js.map