import typesense
import json

client = typesense.Client({
    'api_key': '****',
    'nodes': [{
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http'
    }],
    'connection_timeout_seconds': 2
})

# # 1) CREATE A COLLECTION
# create_response = client.collections.create({
#   "name": "kanjis",
#   "fields": [
#     {"name": "id", "type": "string"},
#     {"name": "slug", "type": "string", "locale": "ja"},
#     {"name": "meanings", "type": "string[]"},
#     {"name": "readings", "type": "string[]", "locale": "ja"},
#   ],
# })


# # 2) INDEXING
# KANJI_FULL_PATH = '../src/resources/kanji_full.json'
#
# with open(KANJI_FULL_PATH, 'r') as kanji_full_str:
#     kanji_full_json = json.load(kanji_full_str)
#
#     filtered_kanji = list(filter(lambda k: k['data']['hidden_at'] is None, kanji_full_json['data']))
#
#     for kanji in filtered_kanji:
#         document = {
#             "id": str(kanji["id"]),
#             "slug": kanji["data"]["slug"],
#             "meanings": list(map(lambda meaning: meaning["meaning"], kanji["data"]["meanings"])),
#             "readings": list(map(lambda reading: reading["reading"], kanji["data"]["readings"])),
#         }
#
#         client.collections['kanjis'].documents.create(document)

# # # 3) SEARCH / QUERY
# search_parameters = {
#   'q'         : 'にん',
#   'query_by'  : 'slug, meanings, readings',
#   # 'filter_by' : 'num_employees:>100',
#   # 'sort_by'   : 'num_employees:desc',
# }
# search_response = client.collections['kanjis'].documents.search(search_parameters)
# print(search_response)


# # GENERATE SEARCH API KEY
# create_key_response = client.keys.create({
#   "description": "Search-only kanjis key.",
#   "actions": ["documents:search"],
#   "collections": ["kanjis"]
# })
# print(create_key_response)
