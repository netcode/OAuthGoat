module.exports = {
    authServer: {
        authorizeURL: "http://oauth-provider.local/oauth/authorize",
        tokenURL: "http://oauth-provider.local:3001/oauth/token",
        userAPI: "http://oauth-provider.local:3001/api/user"
    },
    client_id: "54gSlmAMWz3PKdVgNRcR",
    client_secret: "d65030eaec444ce1afa94b6552e472bf",
    redirect_uri: "http://example-client.local/oauth/callback",
    profile_client_id: "q9O0kwqgxloGk5TPLzEF",
    profile_client_secret: "9b8b9d863a434065867ac8c98e212fbf",
    profile_redirect_uri: "http://example-client.local/profile/link/oauth/callback"
}