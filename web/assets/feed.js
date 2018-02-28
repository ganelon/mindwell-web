function vote(id, positive) {
    var req = new XMLHttpRequest()
    req.open('PUT', '/entries/' + id + '/vote?positive=' + positive, true)
    req.onreadystatechange = updateRating
    req.send()

    var post = document.getElementById('post' + id)
    var up = post.getElementsByClassName('up_vote').item(0)
    var down = post.getElementsByClassName('down_vote').item(0)
    up.disabled = down.disabled = true

    function updateRating() {
        if(req.readyState != XMLHttpRequest.DONE)
            return

        var resp = JSON.parse(req.responseText)
        if(req.status != 200) {
            alert(resp.message)
            var status = post.data.vote
            up.disabled = (status == 'pos')
            down.disabled = (status == 'neg')
            return
        }

        up.disabled = positive
        down.disabled = !positive

        var rating = post.getElementsByClassName('rating').item(0)

        var count = (resp.votes || 0)
        rating.innerHTML = (count > 0 ? '+' + count : count)

        var rate = (resp.rating || 0)
        rating.setAttribute("title", "Рейтинг: " + Math.round(rate))
    }
}