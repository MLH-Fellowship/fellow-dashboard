from flask_restful import Resource, reqparse

scratchpad_parser = reqparse.RequestParser()
scratchpad_parser.add_argument("text", required=True)
scratchpad_parser.add_argument("id", required=True)


class Scratchpad(Resource):
    db = {}  # temp

    def post(self):
        args = scratchpad_parser.parse_args()
        self.db[args["id"]] = args["text"]
        print(self.db)
        return {args["id"]: self.db[args["id"]]}
