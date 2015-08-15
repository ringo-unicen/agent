/// <reference path="../typings/lodash/lodash.d.ts"/>
var os = require('os');
var _ = require('lodash');
var iptabler = require('iptabler');

var ifaces= os.networkInterfaces();
var ip = _.chain(ifaces).map(_.identity).flatten().filter({internal: false, family: 'IPv4'}).first().value();

console.log('Using IP', ip);

exports.address = ip.address;

var config = {
    active: false
};

var applied = false;


var update = function () {
    var preroute = iptabler();
    preroute
        .t('nat')
        .a('PREROUTING')
        .p('tcp')
        .dport(config.target.port)
        .j('DNAT')
        .toDest(config.target.ip + ':' + config.target.port);
     //TODO tabler.exec()
     console.log(preroute._args);

     var posroute = iptabler();
     posroute
        .t('nat')
        .a('POSTROUTING')
        .p('tcp')
        .dport(config.target.port)
        .d(config.target.ip)
        .j('SNAT')
        .toSource(ip.address);
     console.log(posroute._args);
     applied = true;

    // Example: 
    //    iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.12.77:80
    //    iptables -t nat -A POSTROUTING -p tcp -d 192.168.12.77 --dport 80 -j SNAT --to-source 192.168.12.87
}
