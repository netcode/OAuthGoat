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

app.get('/oauth/callback', (req,res) => {
    if(!req.query.code || req.query.error){
        return res.send('Error happened')
    }
    //exchange for an API token
    oauth.exchange(req.query.code, (error, response) => {
        console.log(error)
        if(error){
            return res.send(error);
        }
        oauth.getUser(response.body.access_token, (err, resp) => {
            if(err){
                return res.send(err);
            }else{
                if(resp.body.status == 'success'){
                    req.session.user = resp.body.data;
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