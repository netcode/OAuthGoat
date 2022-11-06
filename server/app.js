
const path = require('path');
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');


const db = require('./libs/db')
const random = require('./libs/random')
const oauth2orize = require('oauth2orize');


const app = express()
const port = 3001
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(session({ secret: 'randomSecretHere', resave: false, saveUninitialized: false }))
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user
    })
})

app.get('/login', (req,res) => {
    res.render('login')
});
app.post('/login', (req,res) => {
    let email = req.body.email;
    let password = req.body.password;

    let result = db.findUser(email, password);
    if(!result){
        return res.json({status: 'error', message: 'Invalid Credentials'});
    }
    //login success
    req.session.user = result;
    return res.redirect('/');
});

app.get('/logout', (req,res) => {
    req.session.user = null;
    return res.redirect('/');
})


const isLoggedIn = (req, res, next) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    req.user = req.session.user;
    next()
}

const isClientLoggedIn = (req, res, next) => {
    // console.log('CL ID',req.body.client_id);

    let result = db.findClient(req.body.client_id);
    if(!result){
        //error
    }
    req.user = result;
    next()
}

const isAuthorized = (req,res, next) => {
    if(!req.headers.authorization){
        return res.json({"status": "error", "message": "Not authorized, token empty"});
    }
    const token = req.headers.authorization.replace('Bearer','').trim();
    console.log('Extracted Token', token);
    const result = db.findToken(token);
    if(!result){
        return res.json({"status": "error", "message": "Not authorized, token not found"});
    }
    //authorized
    req.session.token = result;
    next();
}


const server = oauth2orize.createServer();

server.serializeClient((client, done) => done(null, client.id));

server.deserializeClient((id, done) => {
    let client = db.findClient(id);
    if(!client){
        return done("Invalid Client")
    }
    return done(null, client);
});

//enable code grant
// http://oauth-provider.local/oauth/authorize/?response_type=code&client_id=54gSlmAMWz3PKdVgNRcR&redirect_uri=http://attacker.local

server.grant(oauth2orize.grant.code((client, redirectUri, user, ares, done) => {
    const code = random.getUid(16);
    db.saveCode({
        id: code,
        clientId: client.id,
        redirectUri: redirectUri,
        userId: user.id
    })
    return done(null, code);

}));


server.exchange(oauth2orize.exchange.code((client, code, redirectUri, done) => {

    //console.log('Exchange token', client, code, redirectUri)

    let result = db.findCode(code);
    if(!result){
        console.log("invalid code");
        return done("Invalid code");
    }

    //console.log('COMP: ', client, result);
    if(client.id !== result.clientId) {
        console.log("invalid client");
        return done("The code doesnt belong to this client");
    }

    

    //issue Token
    const accessToken = random.getUid(256);
    const refreshToken = random.getUid(256);

    db.saveToken({
        token: accessToken,
        refreshToken: refreshToken,
        userId: result.userId,
        clientId: result.clientId
    })

    //console.log('Database dump: ',db.dump())

    done(null, accessToken, refreshToken);
}));


// Grant implicit authorization. The callback takes the `client` requesting
// authorization, the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application. The application issues a token, which is bound to these
// values.

// http://oauth-provider.local/oauth/authorize/?response_type=token&client_id=54gSlmAMWz3PKdVgNRcR&redirect_uri=http://attacker.local
server.grant(oauth2orize.grant.token((client, user, ares, done) => {
    //issueTokens(user.id, client.clientId, done);

    //issue Token
    const accessToken = random.getUid(256);
    const refreshToken = random.getUid(256);

    db.saveToken({
        token: accessToken,
        refreshToken: refreshToken,
        userId: user.id,
        clientId: client.id
    })
    done(null, accessToken);
}));
  


const authorization = server.authorization(
    (clientId, redirectUri, done) => {

        

        const client = db.findClient(clientId);
        if(!client) return done("Invalid Client");
        
        //check redirect uri
        if(redirectUri.indexOf(client.redirect_uri) === -1){
            console.log("error", redirectUri, client.redirect_uri)
            return done("Error, Invalid redirect URI")
        }
        
        //done()
        return done(null, client, redirectUri);

    }, (client, user, done) => {

    if(client.pre_approval){
        return done(null, true)
    }    
    // // Check if grant request qualifies for immediate approval
    return done(null, false); //true == approved, will redirect immeditely and will not show the dialog
});


//use login middleware
app.get('/oauth/authorize', isLoggedIn , authorization , (req, res) => {
    res.render('dialog', { transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    //res.json({ transactionId: req.oauth2.transactionID, user: req.user, client: req.oauth2.client })
});
app.post('/oauth/authorize/decision', isLoggedIn, server.decision());


app.post('/oauth/token', isClientLoggedIn, server.token(), server.errorHandler(),);

app.get('/api/user', isAuthorized , (req,res) => {
    let userId = req.session.token.userId;
    let user = db.findUserById(userId);
    if(!user){
        return res.json({"status":"error", "message":"user not found!!!"})
    }

    return res.json({"status":"success", "data": user});
    
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})