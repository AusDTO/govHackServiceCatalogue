//Eventually this should be generically defined as a view within the service information. Then it can be further customised.
//For now it just selects the nodes which are known to be the services, and outputs all the successors and decendants as attributes.
//link information will be appended to target contents - this is particularly something that should be defined in views.


// Basic command example: node  genService.js --input ../DHS.json --outputs ../DHS/ --svcnode SVC --debug


fs = require('fs');
cytoscape = require('cytoscape');
conf = require('./config/config.js');
path = require('path');
var logger = require('./config/logger.js');
var _ = require('underscore');

logger.info(JSON.stringify(conf));



//TODO: Loop through all managed organisations.
logger.debug("Loading Service File");
fs.readFile(conf.get('input'), function(err, data) {
    if (err) {
        logger.info("In error condition opening events file");
        logger.info("__dirname: " + __dirname);
        return logger.debug(err);
    }
    data = JSON.parse(data);

    var elements = data.organisationDefinition.serviceDimensions;
    elements = elements.concat(data.organisationDefinition.serviceOrganisation)
        .concat(data.organisationDefinition.components).concat(data.organisationDefinition.channels);
    logger.debug("File Elements Loaded: " + elements.length);
    //logger.debug("Example Element: " + JSON.stringify(elements[3]));

    //TODO - Friendly JSON validation

    logger.debug("Translating Service Data For Cytoscape");
    logger.debug("   Nodes...");
    // restructure to meet the needs of cytoscape
    var cyElements = [];
    elements.forEach(function(element) {
        //logger.debug(element.type);
        var tempElement = {};
        tempElement.data = element;
        cyElements.push(tempElement);
        //	}
    });

    logger.debug("   Links...");
    var links = data.organisationDefinition.links;
    // restructure to meet the needs of cytoscape
    var cyLinks = [];
    links.forEach(function(element) {
        var tempElement = {};
        tempElement.data = element;
        cyLinks.push(tempElement);
    });

    logger.debug("Service Data Loaded, Creating  CytoScape Graph");

    var cy = cytoscape({
        elements: {
            nodes: cyElements,
            edges: cyLinks
        }
    });

    logger.debug("Outputing search optimised service document");
    //TODO: Use model or field to determine the dimensions we are interested in.

    serviceElements = cy.$("[type = '" + conf.get('serviceNodeType') + "']");

    logger.debug("Looking for: " + "[type = '" + conf.get('serviceNodeType') + "']");
    logger.debug("Service Elements Found: " + serviceElements.size());
    var serviceDocument;
    var ancestors;
    var successors;


    //NOTE: Information that maintains relevence is maintained on the service
    //            Information that has decreasing relevence with distance is maintained on the dimensions or subs.
    logger.debug('Starting Loop over services');
    //TODO: Make sure that the folder is there - fs.writeFile does not ensure.
    if (!fs.existsSync(conf.get('outputs'))) {
        fs.mkdirSync(conf.get('outputs'));
    }
    if (!fs.existsSync(path.join(conf.get('outputs') + 'secondary'))) {
        fs.mkdirSync(path.join(conf.get('outputs') + 'secondary'));
    }

    var subdir = conf.get('outputs');

    serviceElements.forEach(function(service, i, eles) {
        var skip = false;
        var subdir = conf.get('outputs');
        logger.profile(service.data('name'));
        if (service.data('nonUser') === true || service.data('current') === false) {
            logger.debug(service.data('name') + ". nonUser:   " + service.data('nonUser') + '. current: ' + service.data('current'));
            skip = true;
        } else {

            if (service.data('incidental') === true) {
                subdir = path.join(conf.get('outputs'), 'secondary');
            }
            var serviceDocument = {
                documentType: "ServiceInformation",
                todo: [],
                service: {},
                Dimension: [],

            };

            serviceDocument.service = service.data();
            serviceDocument.service.secondary = false;
            serviceDocument.service.primaryAudience = null;
            serviceDocument.service.serviceTypes = [];

//select the channels for the service.

            if (service.data('TODO') !== null) {
                serviceDocument.todo.push(service.data('TODO'));
            }

            ancestors = service.predecessors().nodes();
            if (ancestors.length === 0) {
                logger.warn("    Note: Service: " + serviceDocument.service.name + "  has no dimensions.");
            }
            ancestors.forEach(function(ele, i, eles) {
                if (ele.data('nonUser') === true) {
                    logger.debug(ele.data('name') + ". nonUser:   " + ele.data('nonUser') + '. current: ' + service.data('current'));
                    skip = true;
                    return;
                }
                //If there is an ancestor service then this service is secondary
                if (ele.isNode()) {
                    if (ele.data('type') === conf.get('serviceNodeType')) {
                        serviceDocument.service.secondary = true;
                        subdir = path.join(conf.get('outputs'), 'secondary');
                    }
                    //dijkstra gets the distance from the service node to this node
                    var dijkstra = cy.elements().dijkstra(ele, directed = true);
                    var dist = dijkstra.distanceTo(service);
                    serviceDocument.Dimension[i] = {};
                    serviceDocument.Dimension[i].dist = dist;
                    serviceDocument.Dimension[i].id = ele.id();
                    serviceDocument.Dimension[i].name = ele.data('name');
                    serviceDocument.Dimension[i].desc = ele.data('description');
                    serviceDocument.Dimension[i].primaryAudience = ele.data('primaryAudience');
                    serviceDocument.Dimension[i].infoUrl = ele.data('infoUrl');
                    serviceDocument.Dimension[i].primaryAudience = ele.data('primaryAudience');

//select the channels for this dimension


                    if (ele.data('TODO') !== null) {
                        serviceDocument.todo.push(ele.data('TODO'));
                    }
                    if (_.isArray(serviceDocument.service.lifeEvents) && _.isArray(ele.data('lifeEvents'))) {
                        serviceDocument.service.lifeEvents = serviceDocument.service.lifeEvents.concat(ele.data('lifeEvents'));
                    }
                    if (_.isArray(serviceDocument.service.serviceTypes) && _.isArray(ele.data('serviceTypes'))) {
                        serviceDocument.service.serviceTypes = serviceDocument.service.serviceTypes.concat(ele.data('serviceTypes'));
                    }
                }
            }); //forEach ancestor


            serviceDocument.subService = [];
            successors = service.successors().nodes();
            successors.forEach(function(ele, i, eles) {

//select the channels

                if (ele.data('nonUser') === true) {
                    logger.debug(ele.data('name') + ". nonUser:   " + ele.data('nonUser') + '. current: ' + service.data('current'));
                    skip = true;
                    return;
                }
                if (ele.isNode()) {
                    serviceDocument.subService[i] = {};
                    serviceDocument.subService[i].id = ele.id();
                    serviceDocument.subService[i].name = ele.data('name');
                    serviceDocument.subService[i].desc = ele.data('description');
                    serviceDocument.subService[i].infoUrl = ele.data('infoUrl');
                    serviceDocument.subService[i].primaryAudience = ele.data('primaryAudience');
                    //Add link information - requried for DHS atleast
                }
                if (ele.data('TODO') !== null) {
                    serviceDocument.todo.push(ele.data('TODO'));
                }

            }); //forEach successor
        }
        //TODO: If service.primaryAudience = null then
        //	Run a competition for the nearest  primary audience values from the dimensions,
        //	order by distance, get the 'nearest' value and assign to the service document.
        //	If that value is Government then skip.





        if (!skip) {
            fs.writeFile(subdir + '/' + service.data('name') + ' (' + service.id() + ').json', JSON.stringify(serviceDocument, null, 2));
        } else {
            logger.info('    >>> Skipping Service: ' + service.data('name') + '. Either non Current or Non User ')
        }
        logger.profile(service.data('name'));

    }); //for each service node

//build a list of channels
//LATER: Fetch the outlets from a different source.




});
