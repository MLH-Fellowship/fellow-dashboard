from flask_restful import Resource, abort
from utils.error_handling import handle_github_request_errors
import requests


class GithubIssueList(Resource):
    def get(self, oAuth_token, query_type):
        if query_type not in ("assigned", "created", "mentioned", "subscribed"):
            abort(
                404,
                "invalid query type! must be one of 'assigned', 'created', 'mentioned', or 'subscribed'.",
            )

        headers = {
            "Accept": "application/vnd.github.v3+json",
            "Authorization": f"token {oAuth_token}",
        }
        response = requests.get(
            f"https://api.github.com/orgs/MLH-Fellowship/issues?filter={query_type}",
            headers=headers,
        )
        handle_github_request_errors(response)
        return [
            {
                "number": issue["number"],
                "title": issue["title"],
                "html_url": issue["url"],
                "labels": [{"name": label["name"], "color": label["color"], "id": label["id"]} for label in issue["labels"]],
                "avatar_url": issue["user"]["avatar_url"],
                "login": issue["user"]["login"],
                "body": issue["body"],
                "id": issue["id"]
            }
            for issue in response.json()
        ]
