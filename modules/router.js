/// <reference path="../typings/lodash/lodash.d.ts"/>
var _ = require('lodash');
var iptabler = require('iptabler');
var Bluebird = require('bluebird');


var getIp = function () {
    var ifaces= require('os').networkInterfaces();
    console.log('Scanning for IP address in', ifaces);
    var ip = _.chain(ifaces).map(_.identity).flatten().filter({internal: false, family: 'IPv4'}).first().value();
    console.log('Using IP', ip);
    return ip;
};

var config = {
    state: 'STOPPED'
};


var forward = function () {
    var preroute = iptabler();
    preroute
        .t('nat')
        .A('PREROUTING')
        .p('tcp')
        .dport(config.target.port)
        .j('DNAT')
        .toDest(config.target.ip + ':' + config.target.port);
     //TODO tabler.exec()
     console.log(preroute._args);

     var posroute = iptabler();
     posroute
        .t('nat')
        .A('POSTROUTING')
        .p('tcp')
        .dport(config.target.port)
        .d(config.target.ip)
        .j('SNAT')
        .toSource(getIp().address);
     console.log(posroute._args);
     return Bluebird.resolve("OK");

     //TODO Rollback in case of error and report
    // Example: 
    //    iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.12.77:80
    //    iptables -t nat -A POSTROUTING -p tcp -d 192.168.12.77 --dport 80 -j SNAT --to-source 192.168.12.87
};

var serve = function () {
    console.log('Resetting all rules to default');
    var flush = iptabler().t('nat').F();
    console.log(flush._args);
    return Bluebird.resolve('OK');
};


exports.configure = function (newConfig) {
    config.target = newConfig.next;
};

exports.start = function () {
    if (_.isUndefined(config.target)) {
        return Bluebird.reject(new Error('Target is undefined, configure the router first'));
    }
    return serve();
};

exports.stop = function () {
    if (_.isUndefined(config.target)) {
        return Bluebird.reject(new Error('Target is undefined, configure the router first'));
    }
    return forward();
};
