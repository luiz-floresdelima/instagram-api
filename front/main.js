function generate_posts(data) {
    document.querySelector("#getposts").style.display = 'none'
    let tag = document.querySelector(`#${data}`)
    let tag_input = document.querySelector(`#instagram_posts`)
    let infos = tag.innerHTML
    infos = JSON.parse(infos)
    tag.innerHTML = ""
    infos.Gallery.forEach(element => {
        let post = element.node
        let code_tag = `<div class="post">
            <img class="img_post" src="${post.display_url}" data-post="${post.shortcode}">
        </div>`
        let fragment = document.createDocumentFragment()
        fragment.innerHTML = code_tag
        tag_input.insertAdjacentHTML('beforeend', fragment.innerHTML)
        tag_input.lastChild.addEventListener("click", (element) => {
            let cod_post = element.target.dataset.post
            let url = `https://www.instagram.com/p/${cod_post}`
            fetch(url, { method: "GET" })
                .then((resp) => {
                    if (resp.status == 200) {
                        resp.text().then(data => {
                            ViewPost(data)
                        })
                    }
                })
        })
    });
}

function ViewPost(data) {
    let post_info = `${(data.split(`<script type="text/javascript">window._sharedData = `)[1]).split(`,"hostname":"www.instagram.com"`)[0]}}`
    let p_json = JSON.parse(post_info)
    let general_post = p_json.entry_data.PostPage[0].graphql.shortcode_media
    let { display_url: img, edge_media_to_caption: { edges: [{ node: { text: desc } }] }, owner: { profile_pic_url: profile_Avatar, username }, edge_media_to_parent_comment: { edges: comments } } = general_post
    let modal = document.querySelector("#modal")
    let modal_back = document.querySelector(".modal_back")
    let inner_insta = `
        <button onclick="fec_modal(this.parentNode.parentNode)">x</button>
        <div class="modal_content">
            <div class="modal_img">
                <img src="${img}">
            </div>
            <div class="modal_infos">
                <div class="infos_header">
                    <div class="insta_user">
                        <img src="${profile_Avatar}">
                        ${username}
                    </div>
                    <div class="insta_desc">
                        ${desc}
                    </div>
                </div>
                <div class="infos_comments">
                </div>
            </div>
        </div>`
    modal.innerHTML = inner_insta
    modal_back.style.display = "block"
}

function fec_modal(modal){
    modal.style.display = "none"
}
