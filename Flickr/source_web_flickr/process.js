
if (core.response.data.stat == "fail") {
    out.say("error", core.response.data.message);
    context.node_error = core.response.data.message;

} else {
    /* data cleaning: /*

    /* - delete description object (remains as description_str */
    for (var i=0; i < core.response.data.photoset.photo.length; i++) {
      core.response.data.photoset.photo[i].description_str = core.response.data.photoset.photo[i].description._content;
      core.response.data.photoset.photo[i].thumbnail_html = "<img src='" + core.response.data.photoset.photo[i].url_q + "'/>";
      delete core.response.data.photoset.photo[i].description;
    }

    out.value = core.response.data.photoset.photo;
}
