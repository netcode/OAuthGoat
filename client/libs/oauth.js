const config = require('../config')
const needle = require('needle');


// http://oauth-provider.local/oauth/authorize/?response_type=code&client_id=54gSlmAMWz3PKdVgNRcR&redirect_uri=http://attacker.local
const createAuthLink = () => {
    return config.authServer.authorizeURL + 
                                    "/?response_type=code&" +
                                    "client_id=" + config.client_id + "&" + 
                                    "redirect_uri=" + config.redirect_uri
}

const createProfileLinkAuthLink = () => {
    return config.authServer.authorizeURL + 
                                    "/?response_type=code&" +
                                    "client_id=" + config.profile_client_id + "&" + 
                                    "redirect_uri=" + config.profile_redirect_uri
}



const exchangeProfileClient = (code, callback) => {
    const data = {
        code,
        "grant_type": "authorization_code",
        "client_id": config.profile_client_id,
        "client_secret": config.profile_client_secret,
        "redirect_uri": config.profile_redirect_uri
    }

    return needle.post(config.authServer.tokenURL, data, {}, callback);
}
const exchange = (code, callback) => {
    const data = {
        code,
        "grant_type": "authorization_code",
        "client_id": config.client_id,
        "client_secret": config.client_secret,
        "redirect_uri": config.redirect_uri
    }

    return needle.post(config.authServer.tokenURL, data, {}, callback);
}


const getUser = (token, callback) => {
    let options = {
        headers: { Authorization: 'Bearer '+token }
    }
    return needle.get(config.authServer.userAPI, options, callback)
}

module.exports = { createAuthLink, createProfileLinkAuthLink, exchange, exchangeProfileClient, getUser }