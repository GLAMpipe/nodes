
const selectElement = document.getElementById('process_lookup_wikidata_recon_query');

selectElement.addEventListener('change', (event) => {
  const result = document.getElementById('process_lookup_wikidata_recon_suggestions');
  result.value = `${event.target.value}_wd_suggestions`;
  const result2 = document.getElementById('process_lookup_wikidata_recon_match');
  result2.value = `${event.target.value}_wd_match`;
});
