import json, io

with io.open('misc.json', mode='r', encoding='utf-8') as file:
    a = json.load(file)['messages']
    b = {}
    b['messages'] = []
    for msg in a:
        author = {
            "id" : msg["author"]["id"],
            "name": msg["author"]["name"],
            "avatarUrl": msg["author"]["avatarUrl"]
        }
        b['messages'].append({
            "author" : author,
            "content": msg["content"]
        })

    with io.open('misc3.json', mode='w', encoding='utf-8') as file2:
        json.dump(b, file2)
