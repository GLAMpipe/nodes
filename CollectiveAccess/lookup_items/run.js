
out.console.log(context.data)

if(context.error) {
	out.value = context.error;
} else if(context.data) {
	out.setter = createSetter();
	out.setter[context.node.params.out_field] = 'ok';
} else {
	out.value = 'no data';
}

out.console.log(out.setter)

// 'ca_objects.yleisnimi': { '515': { fi_FI: [Object] } },


function createSetter() {
	var model = context.node.settings.model;
	var fields = context.node.settings.lookup_fields;
	var item = {};

	for(var field in fields) {
		if(fields[field] == 'true') {
			out.console.log(field)
			var k = field.replace('__', '.');
			item[model + field] = [];
		}
	}
	return item;
		
}

function parseData_old() {
	out.setter = {};
	
	var prefix = context.node.params.prefix;
	for(var key in context.data) {
		if(key.includes(model)) {
			var k = key.split('.');
			if(k.length == 2) {
				getValues(prefix + k[1], context.data[key]);
			}
		}
	}
}

function getValues(key, data) {
	
	out.setter[key] = [];
	for(var num in data) { // '515'
		for(var lang in data[num]) { // 'fi_FI'
			for(var key2 in data[num][lang]) { 
				//out.setter[key + '_' + key2].push(data[num][lang][key2]);
			}
			
		}
	}
}
