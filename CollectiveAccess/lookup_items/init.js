
        
out.say('progress', 'Starting lookup...'); 
context.vars = {};
var rest_url = context.node.params.required_url;
var model = context.node.settings.model;

if(model == '') out.init_error = "You must choose a type!";

context.vars.url =  rest_url + '/item/' + model + '/id/';


