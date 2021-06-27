
<template>
	<b-row>
		<b-col cols="3"  class="sideBar">
			<b-container fluid>
				<DBFacet v-bind:settings="settings"/>
			</b-container>
		</b-col>

		<b-col cols="9">
			<div>data</div>
		</b-col>
	</b-row>
</template>
<script>

import axios from "axios"
import DBFacet from './components/DBFacet.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
	name: 'App',
	components: {
		DBFacet
	},
	data() {
		return {
			settings: []
		}
	},
	methods: {
		loadData() {
			axios.get('/api/v2/collections/p76_jyx-testi1_c0_OSC/facet?fields=dc_contributor_author').then(result => {
				this.facets = Object.keys(result.data[0])
				this.facet_data = result.data
			})
		}
	},
	created: function() {
		this.$loadScript("/api/v2/repository/data-browser/test-settings.js")
			.then(() => {
				console.log('loaded')
			})
			.catch(() => {
				console.log('not found')
				this.settings = 'koira settings'
			});
	}
}
console.log()
</script>
