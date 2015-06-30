var logger=require('winston');
var convict = require('convict');


//orgname = 'DHS';
//serviceNodeType = 'SVC';

//orgname = 'ATO';
//serviceNodeType = 'STT';


var conf = convict({
    input: {
        doc: 'The catalogue file to process',
        format: String,
        default: "",
        arg: 'input'
    },
    outputs: {
        doc: 'The folder to create for the organisation',
        format: String,
        default: "",
        arg: 'outputs'
    },
    serviceNodeType: {
        doc: 'Which nodes in the schema are the services we are interested in',
        format: String,
        default: "SVC",
        arg: 'svcnode'
    }
});


conf.validate();

module.exports = conf;

//console.log(JSON.stringify(conf));