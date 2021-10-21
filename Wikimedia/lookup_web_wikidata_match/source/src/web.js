
import axios from "axios"
let web = {}


web.getData = async function(only_matched) {
	const params = new URLSearchParams(window.location.search);
	const collection = params.get("collection");
	const match = params.get("match");
	var query = `{"$or":[{"${match}": {"$exists":false}}, {"${match}":""}]}`
	var result
	if(only_matched === 'yes')
		result = await axios.get(`/api/v2/collections/${collection}/docs?mongoquery=${query}`)
	else
		result = await axios.get(`/api/v2/collections/${collection}/docs`)
	return result
}

web.getStats = async function() {
	const params = new URLSearchParams(window.location.search);
	const collection = params.get("collection");
	const match = params.get("match");
	var query = `{"$or":[{"${match}": {"$exists":false}}, {"${match}":""}]}`
	var total = await axios.get(`/api/v2/collections/${collection}/count`)
	var nonmatched = await axios.get(`/api/v2/collections/${collection}/count?mongoquery=${query}`)
	var out = {total: total.data.count, non_matched: nonmatched.data.count}
	return out
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
