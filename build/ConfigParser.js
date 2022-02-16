"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const utils_1 = require("./utils");
const debug = require('debug')('config-parser');
const CONFIG_OPTIONS_TO_SKIP = {
    onBeforeRelease: true,
    onAfterRelease: true,
    projectRoot: true,
    configFile: true
};
/**
 * Parses a config file into options that are consumable by other classes.
 */
class ConfigParser {
    constructor(options = { strategy: '' }, { logger } = { logger: console }) {
        this.options = options;
        this.projectRoot = options.projectRoot || process.cwd();
        this.configFile = options.configFile || '.version-bump.js';
        this.logger = logger;
    }
    /**
     * Reads for a config file and returns the appropriate object for feeding
     * into other classes.
     * @returns {Promise<object>}
     */
    async parseConfig(useConfigFile = true) {
        const configFile = path_1.join(this.projectRoot, this.configFile);
        let options = {
            strategy: '',
            restartBuildVersion: false
        };
        let defaultOptions = this.options;
        if (useConfigFile && fs_1.existsSync(configFile)) {
            this.logger.info(`Using config file: ${configFile}`);
            try {
                options = require(configFile);
            }
            catch (e) {
                debug(e);
                throw new Error(`Problem requiring file: ${configFile}`);
            }
            const projectRoot = await utils_1.getValue(options.projectRoot);
            const calculatedOptions = await utils_1.parseOptions(options, CONFIG_OPTIONS_TO_SKIP);
            defaultOptions = {
                _usingConfigFile: true,
                ...calculatedOptions,
                ...this.options,
                // Speical case: if the config file has projectRoot,
                // use that value instead, even if it's specified on the
                // command line
                projectRoot
            };
            if (!defaultOptions.strategy) {
                throw new Error('Config file is missing required field: strategy');
            }
        }
        if (!defaultOptions.projectRoot) {
            defaultOptions.projectRoot = process.cwd();
        }
        if (!defaultOptions.versionFile) {
            defaultOptions.versionFile = 'package.json';
        }
        return defaultOptions;
    }
}
exports.default = ConfigParser;
//# sourceMappingURL=ConfigParser.js.map