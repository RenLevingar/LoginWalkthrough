const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs'); // creates a rule that our 'view engine' is 'ejs'


const user = {
    firstName: 'Ren',
    lastName: 'Lev',

}

app.get('/', (req, res) => {  // roots at our views folder and sends it back to the client to display it
    res.render('pages/index', {
        user: user // example of how to pass through data
    })
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});