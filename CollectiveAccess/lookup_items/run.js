
out.console.log(context.data)

if(context.error) {
	out.value = context.error;
} else if(context.data) {
	out.setter = {};
	parseData();
	out.setter[context.node.params.out_field] = 'ok';
} else {
	out.value = 'no data';
}


out.console.log(out.setter)

// 'ca_objects.yleisnimi': { '515': { fi_FI: [Object] } },



function parseData() {
	for(var key in context.data) {
		if(key.includes(model)) {
			var key_clean = key.replace(/\./g,':');
			out.setter[key_clean] = context.data[key]
		}
	}
}

