"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_plugins_1 = __importDefault(require("find-plugins"));
const CliBumpStrategy_1 = __importDefault(require("./version-strategy/CliBumpStrategy"));
const PKG_REGEX = /(.*)?version-bump-plugin(.*)/;
class StrategyLoader {
    constructor() {
        /**
         * Registers a strategy.
         */
        this.registerStrategy = (Strategy) => {
            if (Strategy && !Strategy.strategyShortName) {
                throw new Error('strategyShortName not defined for strategy: ' + Strategy.name);
            }
            const name = Strategy.strategyShortName;
            this.strategies[name] = {
                Strategy
            };
        };
        this.strategies = {};
        this._loadExternalPlugins();
        this.registerStrategy(CliBumpStrategy_1.default);
    }
    /**
     *
     * @return {object}
     */
    getStrategies() {
        return this.strategies;
    }
    strategyExists(name) {
        return this.strategies[name] !== undefined;
    }
    getStrategyConstructor(name) {
        if (!this.strategies[name]) {
            throw new Error('Version bump strategy not found: ' + name);
        }
        return this.strategies[name].Strategy;
    }
    _loadExternalPlugins() {
        const plugins = find_plugins_1.default({
            filter: function (data) {
                return PKG_REGEX.test(data.pkg.name);
            },
            includeDev: true
        });
        plugins.forEach(pluginData => {
            const plugin = require(pluginData.dir);
            // check if each plugin has the getStrategies fn
            // call it to add the strategies
            if (plugin.getStrategies) {
                const strats = plugin.getStrategies();
                strats.forEach(this.registerStrategy);
            }
            else {
                console.warn('Found plugin, but getStrategies() was not defined for it:', module);
            }
        });
    }
}
exports.default = StrategyLoader;
//# sourceMappingURL=StrategyLoader.js.map