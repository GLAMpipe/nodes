
html = "<div style='padding:50px'><h2>Download</h2>"; 
html += "<a target='_blank' href='../api/v1/nodes/" +node.source._id + "/files/" + node.source.settings.required_file + "'>" + node.source.settings.required_file + "</a><br><br></div>";

return html;
