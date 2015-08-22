module.exports = function (app) {
    var _ = require('lodash');
    var router = require('../modules/router');

    app.route('/start')
        .post(function (req, res) {
            console.log('Starting agent');
            router.start().then(function (result) {
                res.json({msg: result});
            }).catch(function (err) {
                console.log('Error starting agent', err);
                res.json({msg: err.message});
            });
        });

    app.route('/config')
        .post(function (req, res) {
           console.log('Configuring agent with', req.body);
           if (_.isUndefined(_.get(req.body, 'next.ip'))) {
               res.status(400).json({msg: 'next.ip is required'});
               return;
           }
           if (_.isUndefined(_.get(req.body, 'next.port'))) {
               res.status(400).json({msg: 'next.port is required'});
               return;
           }
           router.configure(req.body);
           res.json({msg: 'Successfully updated configuration'});
        });

    app.route('/stop')
        .post(function (req, res) {
            console.log('Stopping agent');
            router.stop().then(function (result) {
                res.json({msg: result});
            }).catch(function (err) {
                console.log('Error stopping agent', err);
                res.json({msg: err.message});
            });
        });
};
