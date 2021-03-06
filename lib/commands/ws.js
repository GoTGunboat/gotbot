var Clapp = require('../modules/clapp-discord');
var jsonfile = require('nedb');
var _ = require('underscore');
const cfg = require('../../config.js');
const request = require('request');

const stringArgs = ['name','trait','code','family','column','newval','search','charcode','skill','type','dupe','nick','reduce','type2','exactsearch'];
const numArgs = ['slots','rarity','level','stars','base','minroll','maxroll','crewid','crewid','top'];
const flagArgs = _.map(stringArgs, s=> {return {name:s, desc:s, type:'string',default:''};}).concat(_.map(numArgs, s=>{return {name:s, desc:s, type:'string',default:''};}));

module.exports = new Clapp.Command({
  name: "ws",
  desc: "Execute raw command to the web service",

// Command function
  fn: (argv, context) => new Promise((fulfill, reject) => {
    const author = context.author.username;
    const userid = context.author.id;
    const args = argv.args;
    var fs = require('fs');
    const emojify = context.emojify;


    if (!context.isEntitled(userid)) {
      fulfill(`Sorry, this function is in restricted beta`);
      return;
    }

    var form = {func:args.func, requestor:userid, format:'json'};
    // Blindly copy over the flags
    form = _.extend(form, argv.flags);


    console.log(`WS posting: ${JSON.stringify(form)}`);

    request.post({url:'http://got.warbytowers.co.uk/post.php', form: form}, function(err,httpResponse,body){
      if (err) {
        fulfill(`Some error sending command`);
      }
      else {
        fulfill(body);
      }
    });
  }),
  flags: flagArgs,
  args: [
    {
      name: 'func',
      desc: 'Web service function to call',
      type: 'string',
      required: true
    }

  ]
});
