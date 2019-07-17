class IdentityPool {

    constructor() {
        this.providers = new Map();
    }

    /**
     * Register the user providing logic
     *
     * @param provider
     * @param providingMethod
     * @return {IdentityPool}
     */
    connect(provider, providingMethod) {
        this.providers.set(provider, providingMethod);

        return this;
    }

    /**
     * Wraps the callback to register to the passport
     *
     * @param strategyName
     */
    callback(strategyName) {
        if (!this.providers.has(strategyName)) {
            throw new Error(`E_AUTH_USER_PROVIDER: Could not provide user for strategy [${strategyName}]`);
        }

        return (...strategyParameters) => {
            const providingMethod = this.providers.get(strategyName);
            const done = strategyParameters.pop();

            providingMethod(strategyParameters)
                .then(identity => done(null, identity))
                .catch(error => done(error))
            ;
        }
    }
}

module.exports = IdentityPool;
