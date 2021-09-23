from flask_restful import Resource, reqparse

scratchpad_parser = reqparse.RequestParser()
scratchpad_parser.add_argument("text")


class Scratchpad(Resource):
    db = {}  # temp

    def put(self, id):
        args = scratchpad_parser.parse_args()
        self.db[id] = args["text"]
        print(self.db)
        return {id: self.db[id]}

    def get(self, id):
        return {id: self.db.get(id, "")}
