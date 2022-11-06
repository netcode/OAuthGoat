const path = require('path');
const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const oauth = require('./libs/oauth');

const app = express()
const port = 3002

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(session({ secret: 'randomSecretHere', resave: false, saveUninitialized: false }))
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user,
        authLink: oauth.createAuthLink()
    })
})


app.get('/profile', (req,res) => {
    if(!req.session.user){
        return res.redirect(oauth.createAuthLink())
    }
    res.render('profile', {
        user: req.session.user,
        user_linked: req.session.user_linked,
        authLink: oauth.createAuthLink(),
        profileAuthLink: oauth.createProfileLinkAuthLink()
    })
})

let photos = []; //temporary in-memory DB
app.get('/photos', (req,res) => {
    console.log(photos)
    res.render('photos', {
        user: req.session.user,
        authLink: oauth.createAuthLink(),
        photos: photos
    })
})
app.post('/photos', (req,res) => {
    console.log(req.body.url);
    console.log(photos)
    if(req.body.url){
        photos.push(req.body.url);
    }
    return res.redirect('/photos')
})

app.get('/logout', (req,res) => {
    req.session.user = null;
    req.session.user_linked = null;
    return res.redirect('/');
})


app.get('/oauth/callback', (req,res) => {
    if(!req.query.code || req.query.error){
        console.log('no code')
        return res.send('Error happened')
    }
    //exchange for an API token
    oauth.exchange(req.query.code, (error, response) => {
       
        if(error){
            return res.send(error);
        }
        oauth.getUser(response.body.access_token, (err, resp) => {
            if(err){
                console.log('error 2', err)
                return res.send(err);
            }else{
                if(resp.body.status == 'success'){
                    req.session.user = resp.body.data;
                    return res.redirect('/')
                }
                
                return res.send("Auth code (" + req.query.code + ") is invalid");
            }
        })
        //res.send(response.body);
    })
    //call user api to get user info

    //save to session and redirect to main index

})



app.get('/profile/link/oauth/callback', (req,res) => {
    if(!req.query.code || req.query.error){
        return res.send('Error happened')
    }
    //exchange for an API token
    oauth.exchangeProfileClient(req.query.code, (error, response) => {
        console.log(error)
        if(error){
            return res.send(error);
        }
        oauth.getUser(response.body.access_token, (err, resp) => {
            if(err){
                return res.send(err);
            }else{
                if(resp.body.status == 'success'){
                    req.session.user_linked = resp.body.data;
                    return res.redirect('/')
                }
                
                return res.send(resp.body);
            }
        })
        //res.send(response.body);
    })
    //call user api to get user info

    //save to session and redirect to main index

})


app.listen(port, () => {
    console.log(`Client app listening on port ${port}`)
})