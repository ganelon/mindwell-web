function vote(id, positive) {
    var post = $("#post" + id)
    var rating = $(".post-rating", post)
    if(rating.data.enabled == "true")
        return

    rating.data.enabled = "false"

    var vote = rating.data.vote
    var delVote = ((positive && vote == "pos") || (!positive && vote == "neg"))

    $.ajax({
        url: "/entries/" + id + "/vote",
        method: delVote ? "DELETE" : "POST",
        data: { positive: positive },
        dataType: "json",
        success: function(resp) {
            var count = (resp.votes || 0)
            $(".post-up-count", rating).text(count)
            $(".post-down-count", rating).text(count)
            
            var rate = (resp.rating || 0)
            rating.attr("title", "Рейтинг: " + Math.round(rate))
        },
        error: function(req) {
            var resp = JSON.parse(req.responseText)
            alert(resp.message)
        },
        complete: function() {
            rating.data.enabled = "true"
        },
    })
}

function deletePost(id) {
    if(!confirm("Пост будет удален навсегда."))
        return

    $.ajax({
        url: "/entries/" + id,
        method: "DELETE",
        success: function(resp) {
            if(document.location.pathname == "/entries/" + id)
                window.history.back();
            else
                $("#post" + id).remove()
        },
        error: function(req) {
            var resp = JSON.parse(req.responseText)
            alert(resp.message)
        },
    })
}

function loadComments(href) {
    $.ajax({
        url: href,
        success: function(data) {
            $("a.next").remove()
            $("#comments").prepend(data)
        },
        error: function(req) {
            var resp = JSON.parse(req.responseText)
            alert(resp.message)
        },
    })
}

function loadFeed(href) {
    $.ajax({
        url: href,
        success: function(data) {
            $("div.feed-next").remove()

            var template = document.createElement('template');
            template.innerHTML = data;
            var feed = template.content.childNodes;
            formatTimeElements(feed)

            $("#feed").append(feed)
        },
        error: function(req) {
            var resp = JSON.parse(req.responseText)
            alert(resp.message)
        },
    })
}

$("#comment-editor").ajaxForm({
    resetForm: true,
    success: function(data) {
        $("#comments").append(data)
    },
    error: function(data) {
        alert(data)
    },
})
