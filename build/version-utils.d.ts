import { IVersionBump } from './interfaces';
import ParsedSemVerResult = IVersionBump.ParsedSemVerResult;
import VersionStrategyInternalOptions = IVersionBump.VersionStrategyInternalOptions;
export declare function bumpVersionData(versionData: any, bumpLevel: any, internalOpts?: VersionStrategyInternalOptions, restartBuildVersion?: boolean): ParsedSemVerResult;
export declare function versionObjToString(versionData: any): string;
export declare function bumpArray(data?: Array<any>): Array<any>;
