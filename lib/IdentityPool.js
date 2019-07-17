class IdentityPool {

    constructor() {
        this.providers = new Map();
    }

    /**
     * Register the user providing logic
     *
     * @param strategy
     * @param providingMethod
     * @return {IdentityPool}
     */
    provideFor(strategy, providingMethod) {
        this.providers.set(strategy, providingMethod);

        return this;
    }

    /**
     * Wraps the callback to register to the passport
     *
     * @param strategy
     */
    callback(strategy) {
        if (!this.providers.has(strategy)) {
            throw new Error(`E_AUTH_USER_PROVIDER: Could not provide user for strategy [${strategy}]`);
        }

        return (...strategyParameters) => {
            const providingMethod = this.providers.get(strategy);
            const done = strategyParameters.pop();

            providingMethod(strategyParameters)
                .then(identity => done(null, identity))
                .catch(error => done(error))
            ;
        }
    }
}

module.exports = IdentityPool;
