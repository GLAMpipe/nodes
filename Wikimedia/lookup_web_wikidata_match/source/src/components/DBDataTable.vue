<template>
	<div class="data">
		<b-table striped hover :items="data" :fields="fields">
			<template #cell(wd_match)="data">
				<div v-html="formatReconciliationMatch(data.value, data.item)"></div>
			</template>
			<template #cell(wd_result)="data">
				<div v-html="formatReconciliationResult(data.value, data.item)"></div>
			</template>
		</b-table>

	</div>
</template>

<script>

import web from './../web.js'

export default {
	name: 'DBDataTable',
	data() {
		return {
			data: [],
			fields: []
		}
	},
	methods: {
		formatReconciliationResult(wd_result, data) {
			var out = '<table>'
			if(data.wd_match) {
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
			if(data.wd_result.result) {
				for(var r of data.wd_result.result) {
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

			data[this.$parent.settings.match_field] = selection
			await web.setData(this.$parent.settings.collection, doc_id, data)
			let result = await web.getData(this.$parent.settings.collection, web.getURLQueryParamsAsString())
			this.data = result.data.data
		}
	},

	watch: {
		'$parent.settings': async function() {
			this.fields = this.$parent.settings.visible_fields
			let result = await web.getData(this.$parent.settings.collection, web.getURLQueryParamsAsString())
			this.data = result.data.data
		}
	},
	mounted: function () {
		window.table = this; // hackish: expose methods for plain js "select" buttons
	}
}

</script>
