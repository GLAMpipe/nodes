<template>
	<div class="data">
		total: {{stats.total}}
		<div v-if="stats.non_matched == 0" class="alert alert-success">All done!</div>
		<b-table striped hover :items="data" :fields="fields">

			<template v-slot:[`cell(${suggestions_field})`]="data">
				<div v-html="formatReconciliationResult(data.value, data.item)"></div>
			</template>
			<template v-slot:[`cell(${match_field})`]="data">
				<div v-html="formatReconciliationMatch(data.value, data.item)"></div>
			</template>

		</b-table>

	</div>
</template>

<script>

import web from './../web.js'

export default {
	name: 'DBDataTable',
	props: ['show_only_non_matched'],
	data() {
		return {
			stats: {total:-1, unmatched:0},
			data: [],
			fields: [],
			suggestions_field: '',
			match_field: ''
		}
	},
	methods: {
		formatReconciliationResult(wd_result, data) {
			var out = '<table>'
			if(data[this.match_field]) {
				return `<button class="btn btn-outline-primary" onclick="window.table.setSelection('${data._id}', '')">Change selection </button> (${wd_result.result.length} suggestions)`
			}
			if(wd_result.result) {
				for(var r of wd_result.result) {
					if(r.match) {
						out += `<b class="text-info">${r.name} ${r.id}</b>`
					} else {
						if(r.score == 100)
							out += `<tr><td><b>${r.name}</b></td><td> ${r.id} </td><td> ${r.score}</td><td><button onclick="window.table.setSelection('${data._id}', '${r.id}')" class="btn btn-primary" type="button">select</button></td></tr>`
						else
							out += `<tr><td>${r.name}</td><td> ${r.id} ${r.score}</td></tr>`
					}
					//var matched_by = ''
				}
			}
			return out + '</table>'
		},
		formatReconciliationMatch(wd_match, data) {
			return this.pickWID(wd_match, data)
		},
		pickWID(wid, data) {
			var out = ''
			if(data[this.suggestions_field] && data[this.suggestions_field].result) {
				for(var r of data[this.suggestions_field].result) {
					if(r.id == wid) {
						out += `<b class="text-info">${r.name} (<a href="">${r.id}</a>)</b>`
					}
				}
			}
			return out
		},
		async setSelection(doc_id, selection) {
			console.log(doc_id)
			var data = {}

			data[this.match_field] = selection
			await web.setData(this.$parent.settings.collection, doc_id, data)
			let result = await web.getData()
			this.data = result.data.data
			this.stats = await web.getStats()
		}
	},

	watch: {
		show_only_non_matched: async function() {
			let result = await web.getData(this.show_only_non_matched)
			this.data = result.data.data
		}
	},
	mounted: async function () {
		window.table = this; // hackish: expose methods for plain js "select" buttons
		const params = new URLSearchParams(window.location.search);
		this.fields = params.get("fields").split(',');
		this.suggestions_field = params.get("suggestions")
		this.match_field = params.get("match")
		this.fields = this.fields.concat([this.suggestions_field, this.match_field])
		let result = await web.getData(this.show_only_non_matched)
		this.data = result.data.data
		this.stats = await web.getStats()
	}
}

</script>
