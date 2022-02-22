module.exports = function () {
    const express = require('express')
    const path = require('path')
    const app = express()
    const port = process.env.PORT || 8080

    app.use(express.static(path.join(__dirname, 'public')))

    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })
    // app.post('/test', function (req, res) {
    //     res.json(JSON.stringify())
    // })
    app.listen(port, () => {
        // console.log(`http://localhost:${port}/`)
        console.log('server started')
    })
}