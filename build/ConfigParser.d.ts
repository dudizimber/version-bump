/// <reference types="node" />
import { IVersionBump } from './interfaces';
import ConfigParserOptions = IVersionBump.ConfigParserOptions;
import ILogger = IVersionBump.ILogger;
import CombinedConfigOptions = IVersionBump.CombinedConfigOptions;
/**
 * Parses a config file into options that are consumable by other classes.
 */
export default class ConfigParser {
    options: ConfigParserOptions;
    projectRoot: string;
    configFile: string;
    logger: ILogger;
    constructor(options?: ConfigParserOptions, { logger }?: {
        logger: Console;
    });
    /**
     * Reads for a config file and returns the appropriate object for feeding
     * into other classes.
     * @returns {Promise<object>}
     */
    parseConfig(useConfigFile?: boolean): Promise<CombinedConfigOptions>;
}
