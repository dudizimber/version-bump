import { IVersionBump } from './interfaces';
import BaseVersionStrategyOptions = IVersionBump.BaseVersionStrategyOptions;
import VersionStrategyInternalOptions = IVersionBump.VersionStrategyInternalOptions;
import CommandConfig = IVersionBump.CommandConfig;
import ILogger = IVersionBump.ILogger;
import ParsedSemVerResult = IVersionBump.ParsedSemVerResult;
export default abstract class BaseVersionStrategy<T extends BaseVersionStrategyOptions = BaseVersionStrategyOptions> {
    options: T;
    logger: ILogger;
    currentVersionObj: ParsedSemVerResult;
    /**
     * The strategy name used for calling the strategy in the cli and configuration file.
     */
    static strategyShortName: string;
    constructor(options: T, internalOpts?: VersionStrategyInternalOptions);
    /**
     * Returns an object used for logging
     */
    getLogger(): ILogger;
    /**
     * This is called before getNextVersion() in `VersionBumper.ts`.
     *
     * - Parses string version data into an object
     * - Parses options specific to the strategy
     * @param {string} currentVersion Version number eg '1.2.3'
     */
    init({ currentVersion }: {
        currentVersion: any;
    }): Promise<void>;
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
    static getCommandConfig(yargs: any): CommandConfig;
    /**
     * Get the high-level options like fileVersion, etc.
     */
    getOptions(): T;
    /**
     * Returns a structure that contains metadata about the parsed version.
     */
    getCurrentVersion(): ParsedSemVerResult;
    /**
     * Returns the next release version to update the versionFile with.
     * Use getCurrentVersion() to get an object to work with.
     * @returns {Promise<ParsedSemVerResult>} An updated object that was originally defined by getCurrentVersion()
     */
    getNextVersion(): Promise<ParsedSemVerResult>;
}
