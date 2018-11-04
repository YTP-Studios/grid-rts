const path = require('path');


const MODE = 'development';

module.exports = [{
    mode: MODE,
    entry: './src/client/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js'
    }
}]
