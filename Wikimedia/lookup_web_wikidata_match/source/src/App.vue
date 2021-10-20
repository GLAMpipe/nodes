
<template>
	<div>
		<div class="alert alert-danger" v-if="error">{{error}}</div>
		<b-navbar toggleable="lg" type="dark" variant="info">
			<b-navbar-brand href="">GLAMpipe reconciliation tool - <span v-if="settings">{{settings.pagetitle}}</span></b-navbar-brand>

			<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

			<b-collapse id="nav-collapse" is-nav>


				<!-- Right aligned nav items -->
				<b-navbar-nav class="ml-auto">
					<b-navbar-nav>
						<!--<b-nav-item @click="resetView()" href="#">Reset View</b-nav-item>-->
					</b-navbar-nav>
				</b-navbar-nav>
			</b-collapse>
		</b-navbar>


		<b-row>
			<b-col cols="3"  class="sideBar">
				<b-card>
					<p>Choose best match and click select.</p>
					<div>Show only non-matched </div>
				</b-card>
			</b-col>

			<b-col cols="9">
				<DBDataTable ref="table"/>
			</b-col>
		</b-row>
	</div>
</template>
<script>


import DBDataTable from './components/DBDataTable.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


export default {
	name: 'App',
	components: { DBDataTable},
	data() {
		return {
			settings: null,
			error: null
		}
	},
	created: function() {
		this.$loadScript("config.js")
			.then(() => {
				console.log('config loaded')
				this.settings = window.config
				this.error = null
			})
			.catch(() => {
				console.log('config.js not found')
				this.error = 'config.js not found'
			});
	}
}
</script>
