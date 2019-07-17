const { ServiceProvider } = require('@fusion.io/framework');
const { Config }          = require('@fusion.io/framework/Contracts');
const UserProvider        = require('./lib/UserProvider');
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

        this.container.value(UserProvider, new UserProvider());
        this.container
            .singleton(PassportWrapper, container => this.makePassport(container))
        ;
    }

    makePassport(container) {
        const config        = container.make(Config);
        const userProvider  = container.make(UserProvider);
        const strategies    = config.get("auth.strategies");

        forIn(strategies, ({options, strategy, provider}, strategyName) => {
            const providerCallback  = userProvider.callback(provider);

            passport.use(strategyName, new strategy(options, providerCallback));
        });

        return new PassportWrapper(passport);
    }
}

module.exports = PassportServiceProvider;
