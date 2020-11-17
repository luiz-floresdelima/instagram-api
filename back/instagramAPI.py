import requests
import json

url = 'https://www.instagram.com/instagram/' 
limit = 10
typ = 'profile' # 'or hashtags'

# e.g.[1]: 
#   url = 'https://www.instagram.com/instagram/'
#   typ = 'profile'

# e.g.[2]:
#   url = 'https://www.instagram.com/explore/tags/webdevelopment/'
#   typ = 'hashtags'

r = requests.get(url)
text = r.content.decode('utf-8')
text = text.strip()

if (r.status_code == 200):
    all_info = (text.split('<script type="text/javascript">window._sharedData = ')[1]).split(',"hostname":"www.instagram.com"')[0] + '}'
    d_json = json.loads(all_info)
    general = d_json['entry_data']
    if (typ == 'profile'):
        profile = general['ProfilePage'][0]['graphql']['user']
        full_name = profile['full_name']
        desc = profile['biography']
        qtd_followed = profile['edge_followed_by']['count']
        prof_pic = profile['profile_pic_url_hd']
        gallery = [x['node']['thumbnail_src'] for x in profile['edge_owner_to_timeline_media']['edges'][:limit]]
        info = {'Nome':full_name,'Descricao':desc,'Followers':qtd_followed,'Imagem do perfil': prof_pic,'Galeria':gallery}
    elif (typ == 'hashtags'):
        gallery = [x for x in general['TagPage'][0]['graphql']['hashtag']['edge_hashtag_to_media']['edges'] if (x['node']['__typename'] == "GraphImage") or (x['node']['__typename'] == 'GraphSidecar')]
        info = {'qtd':general['TagPage'][0]['graphql']['hashtag']['edge_hashtag_to_media']['count'],'Galeria': gallery[:limit]}


print(info)
