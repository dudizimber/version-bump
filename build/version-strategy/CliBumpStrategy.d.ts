import BaseVersionStrategy from '../BaseVersionStrategy';
import { BUMP_LEVEL } from '../consts';
import { IVersionBump } from '../interfaces';
export interface CliBumpStrategyConfig extends IVersionBump.BaseVersionStrategyOptions {
    bump: string;
}
/**
 * Performs a version bump based on the --bump flag
 * eg:
 * --bump patch
 * --bump minor
 * --bump major
 * --bump pre-major
 * --bump pre-minor
 * --bump pre-patch
 * --bump pre-release
 * --bump pre-*:<colon-separated-tags> eg (pre-release:alpha)
 * --bump build-release
 * --bump build-release:<colon-separated-tags> eg (build-release:qa)
 */
export default class CliBumpStrategy extends BaseVersionStrategy<CliBumpStrategyConfig> {
    bump: string;
    static strategyShortName: string;
    init({ currentVersion }: {
        currentVersion: any;
    }): Promise<void>;
    static getCommandConfig(): {
        command: string;
        describe: string;
        builder: (yargs: any) => void;
    };
    getNextVersion(): Promise<IVersionBump.ParsedSemVerResult>;
    /**
     * Returns the bump level to use based on the bump type input
     */
    _determineBumpLevel(bumpType: any): BUMP_LEVEL;
}
