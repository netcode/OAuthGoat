let users = [
    { id:1, email: "bob@awesome.rocks", password: "123456", avatar: "https://cdn3.iconfinder.com/data/icons/cat-force/256/cat_rascal.png" },
    { id:2, email: "bar@evil.attack", password: "123456", avatar: "https://cdn3.iconfinder.com/data/icons/emoticon-6/512/26-512.png" },
];

let clients = [
    { name: "Super Awesome Secure Website", id: "54gSlmAMWz3PKdVgNRcR", secret: "d65030eaec444ce1afa94b6552e472bf", redirect_uri: "http://example-client.local/oauth/callback", pre_approval: false },
    { name: "PreApprovalApp", id: "QRCgN910n7Rr4s3Ee8bf", secret: "d3e9c2cb75cf4ebcad4aa01811bcaca5", redirect_uri: "http://preApprovalApp.local/oauth/callback", pre_approval: true },
    { name: "z", id: "q9O0kwqgxloGk5TPLzEF", secret: "9b8b9d863a434065867ac8c98e212fbf", redirect_uri: "", pre_approval: false}
]

let codes = [

];

let tokens = [

];

const findUser = (email,password) => {
    for (const user of users) {
        if(user.email === email && password === user.password){
            return user;
        }
    }

    return false;
}

const findUserById = (id) => {
    for (const user of users) {
        if(user.id === id){
            return user;
        }
    }

    return false;
}

const findClient = (id) => {
    for (const client of clients) {
        if(client.id === id){
            return client;
        }
    }
    return false;
}


const findCode = (id) => {
    for (const code of codes) {
        if(code.id === id){
            return code;
        }
    }
    return false;
}


const saveCode = (code) => {
    codes.push(code);
}


const findToken = (id) => {
    for (const token of tokens) {
        if(token.token === id){
            return token;
        }
    }
    return false;
}


const saveToken = (token) => {
    tokens.push(token);
}


const dump = () => {
    return {
        users,
        clients,
        codes,
        tokens
    }
}

module.exports = { findUserById, findUser, findClient, findCode, saveCode, findToken, saveToken, dump }