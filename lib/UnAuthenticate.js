class UnAuthenticated extends Error {
    constructor(message = "UnAuthenticated") {
        super();
        this.message = message;
        this.code    = 401;
    }
}

module.exports = UnAuthenticated;
