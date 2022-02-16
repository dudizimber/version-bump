import BaseVersionStrategy from './BaseVersionStrategy';
import { IVersionBump } from './interfaces';
import VersionFile = IVersionBump.VersionFile;
import BaseVersionStrategyOptions = IVersionBump.BaseVersionStrategyOptions;
import ILogger = IVersionBump.ILogger;
import VersionStrategyInternalOptions = IVersionBump.VersionStrategyInternalOptions;
/**
 * Facade that interfaces to the changelog classes. Main entry point for the command line.
 * See the respective classes for parameter info.
 **/
export default class VersionBumper {
    packageData: VersionFile;
    options: BaseVersionStrategyOptions;
    strategyInstance: BaseVersionStrategy<BaseVersionStrategyOptions>;
    logger: ILogger;
    constructor(options: BaseVersionStrategyOptions, internalOpts?: VersionStrategyInternalOptions);
    /**
     * Call this first before calling one of the public facing methods.
     * @returns {Promise<void>}
     */
    initStrategy(Strategy: any): Promise<void>;
    /**
     * Runs the procedures to update the version number
     * @returns {Promise<void>}
     */
    bumpVersion(): Promise<void>;
}
