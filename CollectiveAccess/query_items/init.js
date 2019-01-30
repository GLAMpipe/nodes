
        
out.say('progress', 'Starting query...'); 

var rest_url = context.node.params.required_url;
var model = context.node.settings.model;
var query = context.node.settings.query;


out.url = rest_url + '/find/' + model + '?q=' + query;
if(context.node.settings.token != '') out.url = out.url + '&authToken=' + context.node.settings.token;
