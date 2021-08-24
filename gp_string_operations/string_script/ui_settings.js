
// "node" is passed as a parameter to this scripts
// "node.settings" includes node settings and "node.params" node's parameters


var examples = {

"typed_hello": `// this is the current document
var doc = context.doc;
var rec_field = context.node.settings.in_field;
var greeting = context.node.settings.greeting;

// check the type of document field ("in_field" 2 in settings)
if(Array.isArray(doc[rec_field]))
	greeting = "Array, " + greeting;
else if(typeof doc[rec_field] === "string")
	greeting = "String, " + greeting;
else
	greeting = "Who knows or cares, " + greeting;

out.value = greeting;`,

"d6_bitstream_count": `
const bundle = "ORIGINAL";

var doc = context.doc;
var counter = 0;


var bits = doc["bitstreams"];
bits.forEach(x=>{
if(x["bundleName"] == "ORIGINAL") {
   counter++;
}
})
out.value = counter +"";
`,

"MARC":`


// this is the current document
var doc = context.doc;

// this writes the result to the field of the current document
var data = {}
data['authors'] = getTag('100', 'a');
data['isbn'] = getTag('020', 'a');
data['lang'] = getTag('041', 'a');
data['title'] = getTag('245', 'a');
data['dissertation'] = getTag('502', 'a');
data['publisher'] = getTag('264', 'a');
data['pages'] = getTag('300', 'a');
data['serial_name'] = getTag('490', 'a');
data['serial_issn'] = getTag('490', 'x');


var kasi = getTags('008')
data['year'] = getYear(kasi[0]);




out.setter = data

function getTags(tag, sub) {
    var result = []
    for(var field of doc['fields']) {
        if(field[tag]) {
            result.push(field[tag])
        }
    }
    return result;
}


function getTag(tag, sub) {
    var result = []
    for(var field of doc['fields']) {
        if(field[tag]) {
            for(var subfield of field[tag]['subfields']) {
                if(subfield[sub]) result.push(subfield[sub])
            }
        }
    }
    return result;
}

function getYear(cfield) {
    var search = ['t','s','r', 'q']
    if(search.includes(cfield[6]))
        return cfield.substring(7,11);
}
`
}


$("#script_node_examples").on("change", function() {
	editor.setValue(examples[$(this).val()]);
})


// we show the output field to the user
$("#process_script_out").text(node.params.out_field);
