module.exports = function (app) {
    var address = require('../modules/router').address;
    console.log('IP:', address);
    app.route('/start')
        .post(function (req, res) {
            console.log('Starting agent');
            res.json(req.body);
        });

    app.route('/config')
        .post(function (req, res) {
           console.log('Configuring agent with', req.body);
           res.json(req.body); 
        });

    app.route('/stop')
        .post(function (req, res) {
            console.log('Stopping agent');
            res.json(req.body);
        });
};
