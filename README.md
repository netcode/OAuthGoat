# OAuthGoat

This is a vulnerable environment designed to test OAuth vulnerabilities. It contains **Vulnerable** OAuth Client and OAuth provider

## WARNING!

OAuth goat is vulnerable by design applications(s). Don't upload it to any public internet facing servers.


## Installation & Running
Its a docker environment, so you can running it easily with `docker-compose`. But in order to use host names, make sure to add this into your `/etc/hosts`

```
#oauth-goat
127.0.0.1 oauth-provider.local
127.0.0.1 attacker.local
127.0.0.1 example-client.local
```

then you can run docker compose

```
docker-compose up
```

Now you can access the provider at `oauth-provider.local` and the client at `example-client.local`


## data
We have prefilled the vulnerable environment with some data. Lives in `/server/libs/db.js`

```
let users = [
    { id:1, email: "bob@awesome.rocks", password: "123456", avatar: "https://cdn3.iconfinder.com/data/icons/cat-force/256/cat_rascal.png" },
    { id:2, email: "bar@evil.attack", password: "123456", avatar: "https://cdn3.iconfinder.com/data/icons/emoticon-6/512/26-512.png" },
];

let clients = [
    { name: "Super Awesome Secure Website", id: "54gSlmAMWz3PKdVgNRcR", secret: "d65030eaec444ce1afa94b6552e472bf", redirect_uri: "http://example-client.local/oauth/callback", pre_approval: false },
    { name: "Super Awesome Secure Website - Profile linking", id: "q9O0kwqgxloGk5TPLzEF", secret: "9b8b9d863a434065867ac8c98e212fbf", redirect_uri: "http://example-client.local/profile/link/oauth/callback", pre_approval: false},
    { name: "PreApprovalApp", id: "QRCgN910n7Rr4s3Ee8bf", secret: "d3e9c2cb75cf4ebcad4aa01811bcaca5", redirect_uri: "http://preApprovalApp.local/oauth/callback", pre_approval: true }
    
]
```



