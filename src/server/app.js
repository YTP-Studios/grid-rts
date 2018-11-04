const express = require("express");
const path = require("path");
let app = express();

const port = 8000;

app.use('/static', express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../', 'index.html'));
})

app.listen(port, () => console.log(`App listening on port: ${port}`));
