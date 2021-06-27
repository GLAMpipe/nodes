<template>
  <div class="hello">
    <h1>facets {{settings}}</h1>
	{{facets}}

  </div>
</template>

<script>



export default {
	name: 'DBFacet',
	props: ['settings'],
	data() {
		return {
			facets: []
		}
	},
	methods: {

	},
	created: function() {

	}
}
</script>
