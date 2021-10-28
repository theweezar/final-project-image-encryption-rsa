from flask import make_response, jsonify

def json(json: dict, http_code = 200):
    res = make_response(
        jsonify(json),
        http_code
    )
    res.headers.add("Content-Type", "application/json")
    return res