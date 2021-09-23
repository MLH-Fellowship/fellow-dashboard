from flask import Flask
from flask_restful import Resource, Api, reqparse, abort
from flask_cors import CORS
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


def handle_github_request_errors(response):
    if response.status_code == 401:
        abort(401, message="invalid oauth token")
    if response.status_code == 404:
        abort(404, message="resource not found, check request arguments")


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
        handle_github_request_errors(response)
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
        handle_github_request_errors(response)
        return [
            {
                "title": discussion["title"],
                "url": discussion["url"],
            }
            for discussion in response.json()
        ]


github_standup_parser = reqparse.RequestParser()
github_standup_parser.add_argument("text", required=True)


class GithubViewSubmitLatestStandup(Resource):
    def get(self, pod_slug, oAuth_token):
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {oAuth_token}",
        }
        response = requests.get(
            f"https://api.github.com/orgs/MLH-Fellowship/teams/{pod_slug}/discussions",
            headers=headers,
        )
        handle_github_request_errors(response)
        latest_standup_date = next(
            (
                discussion["title"][discussion["title"].find("(") + 1 : -1]
                for discussion in response.json()
                if discussion["title"].startswith("Standup (")
            ),
            "No standup discussion threads found!",
        )
        return {"date": latest_standup_date}

    def put(self, pod_slug, oAuth_token):
        standup_notes = github_standup_parser.parse_args()["text"]
        print(standup_notes)
        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {oAuth_token}",
        }
        response = requests.get(
            f"https://api.github.com/orgs/MLH-Fellowship/teams/{pod_slug}/discussions",
            headers=headers,
        )
        handle_github_request_errors(response)
        latest_standup_discussion_number = next(
            (
                discussion["number"]
                for discussion in response.json()
                if discussion["title"].startswith("Standup (")
            ),
            -1,
        )
        print(latest_standup_discussion_number)
        if latest_standup_discussion_number == -1:
            abort(404, message="No standup discussion threads found!")

        post_comment_response = requests.post(
            f"https://api.github.com/orgs/MLH-Fellowship/teams/{pod_slug}/discussions/{latest_standup_discussion_number}/comments",
            data=f'{{"body": "{standup_notes}"}}',
            headers=headers,
        )
        handle_github_request_errors(post_comment_response)
        return {"comment": post_comment_response.json()}


api.add_resource(Scratchpad, "/scratchpad")
api.add_resource(GithubPodList, "/github/list-pods/<string:oAuth_token>")
api.add_resource(
    GithubDiscussionList,
    "/github/list-discussions/<string:pod_slug>/<string:oAuth_token>",
)
api.add_resource(
    GithubViewSubmitLatestStandup,
    "/github/standup/<string:pod_slug>/<string:oAuth_token>",
)


if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
