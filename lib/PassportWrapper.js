const UnAuthenticated = require('./UnAuthenticate');

/**
 *
 */
class PassportWrapper {

    /**
     *
     * @param passport
     */
    constructor(passport) {
        this.passport = passport;
    }

    /**
     * Perform authentication process
     *
     * @param strategy
     * @param context
     * @return {Promise<*>}
     */
    async authenticate(strategy, context) {
        return new Promise((resolve, reject) => {
            this.passport.authenticate(strategy, (error, identity) => {
                if (error) {
                    return reject(error);
                }

                if (!identity) {
                    return reject(new UnAuthenticated())
                }

                return resolve(identity);

            })(context.request, context.response, reject);
        });
    }
}

module.exports = PassportWrapper;
