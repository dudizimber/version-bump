"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseVersionStrategy_1 = __importDefault(require("../BaseVersionStrategy"));
const consts_1 = require("../consts");
const version_utils_1 = require("../version-utils");
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
class CliBumpStrategy extends BaseVersionStrategy_1.default {
    async init({ currentVersion }) {
        await BaseVersionStrategy_1.default.prototype.init.call(this, { currentVersion });
        this.bump = this.getOptions().bump;
    }
    static getCommandConfig() {
        return {
            command: `${CliBumpStrategy.strategyShortName} [bump]`,
            describe: 'Performs a version bump based on the --bump flag',
            builder: yargs => {
                yargs.positional('bump', {
                    describe: `Version type to bump.

                    Values can be:
                        * major
                        * minor
                        * patch
                        * pre-major
                        * pre-minor
                        * pre-patch
                        * pre-release
                        * pre-*:<colon-sep-tags> (pre-release:alpha:rc)
                        * build-release
                        * build-release:<colon-sep-tags> (build-release:qa)
      
                    Default is the lowest version possible.`
                });
            }
        };
    }
    async getNextVersion() {
        const bumpLevel = this._determineBumpLevel(this.bump);
        let versionData = this.getCurrentVersion();
        // check if the pre/build is using any custom tag
        if (typeof this.bump === 'string' &&
            (this.bump.includes('pre') || this.bump.includes('build')) &&
            this.bump.includes(':')) {
            // extract the tag
            const tags = this.bump.split(':');
            // remove the 0th entry since that's the pre/build label
            tags.shift();
            // Compare the proposed tags against the existing one
            let compare = [];
            switch (bumpLevel) {
                case consts_1.BUMP_LEVEL.PRE_MAJOR:
                case consts_1.BUMP_LEVEL.PRE_MINOR:
                case consts_1.BUMP_LEVEL.PRE_PATCH:
                case consts_1.BUMP_LEVEL.PRE_RELEASE:
                    compare = versionData.pre || [];
                    break;
                case consts_1.BUMP_LEVEL.BUILD_RELEASE:
                    compare = versionData.build || [];
                    break;
            }
            // go through the new tags to use and compare to the existing ones
            // if they do not match, then we consider it to be a fresh bump
            if (!tags.every((tag, idx) => tag === compare[idx])) {
                switch (bumpLevel) {
                    case consts_1.BUMP_LEVEL.PRE_RELEASE:
                        versionData.pre = tags;
                        break;
                    case consts_1.BUMP_LEVEL.BUILD_RELEASE:
                        versionData.build = tags;
                        break;
                }
            }
        }
        versionData = version_utils_1.bumpVersionData(versionData, bumpLevel, {
            logger: this.getLogger()
        }, this.options.restartBuildVersion);
        return versionData;
    }
    /**
     * Returns the bump level to use based on the bump type input
     */
    _determineBumpLevel(bumpType) {
        if (!bumpType || typeof bumpType !== 'string') {
            return consts_1.BUMP_LEVEL.LOWEST;
        }
        if (bumpType === 'major') {
            return consts_1.BUMP_LEVEL.MAJOR;
        }
        if (bumpType === 'minor') {
            return consts_1.BUMP_LEVEL.MINOR;
        }
        if (bumpType === 'patch') {
            return consts_1.BUMP_LEVEL.PATCH;
        }
        if (bumpType === 'pre-major') {
            return consts_1.BUMP_LEVEL.PRE_MAJOR;
        }
        if (bumpType === 'pre-minor') {
            return consts_1.BUMP_LEVEL.PRE_MINOR;
        }
        if (bumpType === 'pre-patch') {
            return consts_1.BUMP_LEVEL.PRE_PATCH;
        }
        if (bumpType.includes('pre-release')) {
            return consts_1.BUMP_LEVEL.PRE_RELEASE;
        }
        if (bumpType.includes('build-release')) {
            return consts_1.BUMP_LEVEL.BUILD_RELEASE;
        }
        if (!bumpType) {
            return consts_1.BUMP_LEVEL.LOWEST;
        }
        throw new Error('Unsupported bump option: ' + bumpType);
    }
}
exports.default = CliBumpStrategy;
CliBumpStrategy.strategyShortName = 'cli';
//# sourceMappingURL=CliBumpStrategy.js.map