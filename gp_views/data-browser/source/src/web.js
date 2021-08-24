
import axios from "axios"
let web = {}

web.getFacetValues = async function(collection, fields, query) {
	var result = await axios.get(`/api/v2/collections/${collection}/facet?fields=${fields}&${query}`)
	return result
}

web.getData = async function(collection, query) {
	var result = await axios.get(`/api/v2/collections/${collection}/docs?${query}`)
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
