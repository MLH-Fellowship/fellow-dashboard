from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import jwt
import requests

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


class GithubPodList(Resource):
    def get(self, oAuth_token):
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {oAuth_token}",
        }
        response = requests.get(
            "https://api.github.com/orgs/MLH-Fellowship/teams/mlh-fellows-batch-4/teams",
            headers=headers,
        )
        return [
            {
                "name": pod["name"],
                "description": pod["description"],
                "slug": pod["slug"],
            }
            for pod in response.json()
        ]


class GithubDiscussionList(Resource):
    def get(self, pod_slug, oAuth_token):
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {oAuth_token}",
        }
        response = requests.get(
            f"https://api.github.com/orgs/MLH-Fellowship/teams/{pod_slug}/discussions",
            headers=headers,
        )
        return [
            {
                "title": discussion["title"],
                "url": discussion["url"],
            }
            for discussion in response.json()
        ]


api.add_resource(Scratchpad, "/scratchpad")
api.add_resource(GithubPodList, "/github/list-pods/<string:oAuth_token>")
api.add_resource(
    GithubDiscussionList,
    "/github/list-discussions/<string:pod_slug>/<string:oAuth_token>",
)

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
