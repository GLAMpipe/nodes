
var c = context;

out.console.log(core.response.statusCode)
if (core.response && core.response.statusCode == 200 ) {
	// count query rounds
	c.vars.round_counter++;
	out.console.log(core.response.body)
	try {
		var result = JSON.parse(core.response.body)
		if(result['baseform']) {
			var words = result['baseform'].replace(/[!"#¤%&\/\(\)\=\?',;\.:\<\>*]/gm,' ').replace(/\s\s+/gm,' ').split(' ');
			
			// output words as a list
			if(c.node.settings.format === 'list') {
				out.value = words;
			
			// output list of unique words
			} else if(c.node.settings.format === 'unique') {
				out.value = [...new Set(words)]

			// output bag of words with counts
			} else if(c.node.settings.format === 'bag') {
				// TODO!
				var counts = {};
				for (var i = 0; i < words.length; i++) {
					counts[words[i]] = 1 + (counts[words[i]] || 0);
				}
				out.value = counts
			// otherwise output raw result
			} else {
				out.value = result;
			}
		}
	} catch(e) {
		out.value = "AAAA_ERROR: No result"
	}
	
	
}



function bagOfWords(result) {
	var bag = [];
	
	for(var word of words) {
		
	}
}

//out.say('progress', context.count + '/' + context.doc_count + ' processed...');


var en_stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"]
