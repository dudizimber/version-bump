import { IVersionBump } from './interfaces';
import StrategyPlugin = IVersionBump.StrategyPlugin;
export default class StrategyLoader {
    private strategies;
    constructor();
    /**
     *
     * @return {object}
     */
    getStrategies(): {
        [strategyName: string]: {
            Strategy: IVersionBump.StrategyPlugin;
        };
    };
    strategyExists(name: any): boolean;
    getStrategyConstructor(name: any): IVersionBump.StrategyPlugin;
    /**
     * Registers a strategy.
     */
    registerStrategy: (Strategy: StrategyPlugin) => void;
    _loadExternalPlugins(): void;
}
