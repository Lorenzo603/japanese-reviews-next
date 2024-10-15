import typesense
import json
import wanakana

KANJI_FULL_PATH = 'C:\\p\\japanese-reviews-next\\src\\resources\\kanji_full_reduced.json'
client = typesense.Client({
    'api_key': '****',
    'nodes': [{
        'host': 'localhost',
        'port': '8108',
        'protocol': 'http'
    }],
    'connection_timeout_seconds': 2
})

# # CREATE A COLLECTION
# create_response = client.collections.create({
#   "name": "kanjis",
#   "fields": [
#     {"name": "id", "type": "string"},
#     {"name": "slug", "type": "string", "locale": "ja"},
#     {"name": "meanings", "type": "string[]"},
#     {"name": "readingsKun", "type": "string[]", "locale": "ja"},
#     {"name": "readingsOn", "type": "string[]", "locale": "ja"},
#     {"name": "readingsNames", "type": "string[]", "locale": "ja"},
#
#     {"name": "readingsKunRomaji", "type": "string[]"},
#     {"name": "readingsOnRomaji", "type": "string[]"},
#     {"name": "readingsNamesRomaji", "type": "string[]"},
#   ],
# })
# print(create_response)

# # DELETE A COLLECTION
# delete_response = client.collections['kanjis'].delete()
# print(delete_response)


# # INDEXING
#
# with open(KANJI_FULL_PATH, 'r', encoding='utf-8') as kanji_full_str:
#     kanji_full_json = json.load(kanji_full_str)
#
#     filtered_kanji = list(filter(lambda k: k['data']['hidden_at'] is None, kanji_full_json['data']))
#
#     for kanji in filtered_kanji:
#         print(f"Indexing: {kanji['id']}")
#         readings = kanji["data"]["readings"]
#         readingsKun = [reading["reading"] for reading in readings if 'type' not in reading or reading['type'] == 'kunyomi']
#         readingsOn = [reading["reading"] for reading in readings if reading['type'] == 'onyomi']
#         readingsNames = [reading["reading"] for reading in readings if reading['type'] == 'nanori']
#         document = {
#             "id": str(kanji["id"]),
#             "slug": kanji["data"]["slug"],
#             "meanings": list(map(lambda meaning: meaning["meaning"], kanji["data"]["meanings"])),
#             "readingsKun": readingsKun,
#             "readingsOn": list(map(lambda reading: wanakana.to_katakana(reading), readingsOn)),
#             "readingsNames": readingsNames,
#             "readingsKunRomaji": list(map(lambda reading: wanakana.to_romaji(reading), readingsKun)),
#             "readingsOnRomaji":  list(map(lambda reading: wanakana.to_romaji(reading), readingsOn)),
#             "readingsNamesRomaji":  list(map(lambda reading: wanakana.to_romaji(reading), readingsNames)),
#         }
#         # print(document)
#
#         # .create() : creates new document
#         # .upsert() : updates existing document (whole doc has to be sent)
#         # .update() : updates existing document (partial doc has to be sent)
#         client.collections['kanjis'].documents.upsert(document)
# print("Done!")

# # SEARCH / QUERY
# search_parameters = {
#   'q'         : 'にん',
#   'query_by'  : 'slug, meanings, readingsKun, readingsOn, readingsNames',
#   # 'filter_by' : 'num_employees:>100',
#   # 'sort_by'   : 'num_employees:desc',
# }
#
# search_response = client.collections['kanjis'].documents.search(search_parameters)
# print(search_response)

# # GENERATE SEARCH API KEY
# create_key_response = client.keys.create({
#   "description": "Search-only kanjis key.",
#   "actions": ["documents:search"],
#   "collections": ["kanjis"]
# })
# print(create_key_response)
