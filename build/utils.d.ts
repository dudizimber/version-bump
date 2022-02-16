import { IVersionBump } from './interfaces';
import VersionStrategyInternalOptions = IVersionBump.VersionStrategyInternalOptions;
/**
 * This is mainly used for parsing options, since each config parameter can be
 * either a string or function.
 * - If a value is a function, execute and return it.
 * - If a value is text, return it
 * @param {function|string} value
 * @param {object} [options] Options to feed into the value, if it is a function
 * @returns {Promise<*>}
 */
export declare function getValue(value: any, options?: {}): Promise<any>;
/**
 * Gets the raw file data
 * @param {string} filePath Full path of the file to read
 * @return {Promise<string>} Contents of the file
 */
export declare function getFileContents(filePath: any): Promise<any>;
export declare function writeVersionFile(projectRoot: any, versionFile: any, data: any): Promise<void>;
export declare function readVersionFile(projectRoot: string, versionFile: string, internalOpts: VersionStrategyInternalOptions): Promise<any>;
/**
 * Goes through each parameter and resolves the config value, if required.
 * @param {object} options
 * @returns {Promise<object>} Object with resolved values.
 * @private
 */
export declare function parseOptions(options: any, skipOver?: {}): Promise<any>;
