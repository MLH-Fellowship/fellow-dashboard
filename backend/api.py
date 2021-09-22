from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import jwt

app = Flask(__name__)
api = Api(app)
CORS(app)

db = {}  # temp

scratchpad_parser = reqparse.RequestParser()
scratchpad_parser.add_argument("text", required=True)
scratchpad_parser.add_argument("id", required=True)


class Scratchpad(Resource):
    def post(self):
        args = scratchpad_parser.parse_args()
        db[args["id"]] = args["text"]
        print(db)
        return {args["id"]: db[args["id"]]}


api.add_resource(Scratchpad, "/scratchpad")

# example command
# curl localhost:5000/scratchpad --data "id=yo&text=hi"

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
