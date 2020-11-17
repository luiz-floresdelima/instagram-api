var info

// e.g.[1]: 
//   url = 'https://www.instagram.com/instagram/'
//   typ = 'profile'

// e.g.[2]:
//   url = 'https://www.instagram.com/explore/tags/webdevelopment/'
//   typ = 'hashtags'

function json_infos(data,limit,typo) {
    let all_info = `${(data.split(`<script type="text/javascript">window._sharedData = `)[1]).split(`,"hostname":"www.instagram.com"`)[0]}}`
    let d_json = JSON.parse(all_info)//JSON.parse(JSON.stringify(JSON.parse(item)))
    let general = d_json.entry_data
    var gallery
    if (typo == `profile`) {
        let profile = (general.ProfilePage)[0].graphql.user
        let { full_name, biography: desc, edge_followed_by: { count: qtd_followed }, profile_pic_url_hd: prof_pic } = profile
        gallery = profile.edge_owner_to_timeline_media.edges.slice(0, limit).map(item => {
            return item.node.thumbnail_src
        })
        info = { 'Nome': full_name, 'Descricao': desc, 'Followers': qtd_followed, 'Imagem do perfil': prof_pic, 'Gallery': gallery }
    } else if (typo == `hashtags`) {
        gallery = (general.TagPage)[0].graphql.hashtag.edge_hashtag_to_media.edges.filter(item => {
            return (item.node.__typename == "GraphImage") || (item.node.__typename == 'GraphSidecar')
        })
        info = { 'qtd': (general.TagPage)[0].graphql.hashtag.edge_hashtag_to_media.count, 'Gallery': gallery.slice(0, limit) }
    }
    document.querySelector("#instagram_json").innerHTML = JSON.stringify(info,undefined, 2)
    document.querySelector("#getjson").style.display = 'none'
    document.querySelector("#getposts").style.display = 'block'
}

function get_Json(){
    let url = document.getElementById("url").value
    let limit = document.getElementById("limit").value
    if (url != ''){
        document.getElementById("loader").style.display = "block"
        let typo = ((url.split('.com/')[1]).split('/')[0] == 'explore')? 'hashtags':'profile'
        fetch(url, { method: "GET" })
            .then(resp => {
                if (resp.status == 200) {
                    resp.text().then(data => {
                        json_infos(data,limit,typo)
                        document.getElementById("loader").style.display = "none"
                    })
                }
            })
    }
}
