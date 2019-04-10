
        
out.say('progress', 'Starting query...'); 

var rest_url = context.node.params.required_url;
var model = context.node.settings.model;



out.url = rest_url + '/browse/' + model + '?pretty=1';
if(context.node.settings.token != '') out.url = out.url + '&authToken=' + context.node.settings.token;
out.url = 'https://oscari.oscapps.jyu.fi/providence/service.php/browse/ca_objects?pretty=1&authToken='+context.node.settings.token+'&source=%7B%20%22criteria%22%20%3A%20%7B%22type_facet%22%20%3A%20%5B23%5D%20%7D%7D';



