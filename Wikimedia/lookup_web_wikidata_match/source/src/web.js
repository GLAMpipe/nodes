
import axios from "axios"
let web = {}


web.getData = async function(collection, query) {
	var result = await axios.get(`/api/v2/collections/${collection}/docs?${query}`)
	return result
}

web.setData = async function(collection, doc_id, data) {
	var result = await axios.put(`/api/v2/collections/${collection}/docs/${doc_id}`, data)
	return result
}

web.getURLQueryParamsAsString = function() {
	var url = document.URL.split('?')
	if(url.length == 2)
		return url[1].replace(/\?/g, '')
	else
		return ''
}

export default web
