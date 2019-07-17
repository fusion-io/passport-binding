const { ServiceProvider } = require('@fusion.io/framework');
const { Config }          = require('@fusion.io/framework/Contracts');
const IdentityPool        = require('./lib/IdentityPool');
const passport            = require('passport');
const PassportWrapper     = require('./lib/PassportWrapper');

const forIn = (object, callback) => {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            callback(object[key], key);
        }
    }
};

class PassportServiceProvider extends ServiceProvider {

    register() {

        this.container.value(IdentityPool, new IdentityPool());
        this.container
            .singleton(PassportWrapper, container => this.makePassport(container))
        ;
    }

    makePassport(container) {
        const config        = container.make(Config);
        const pool          = container.make(IdentityPool);
        const strategies    = config.get("auth.strategies");

        forIn(strategies, ({options, strategy, provider}, strategyName) => {

            if (!provider) {
                throw new Error(`E_AUTHENTICATOR: Invalid service configuration. Please configure provider for strategy [${strategyName}]`);
            }

            const providerCallback  = pool.callback(provider);

            passport.use(strategyName, new strategy(options || {}, providerCallback));
        });

        return new PassportWrapper(passport);
    }
}

module.exports = PassportServiceProvider;
