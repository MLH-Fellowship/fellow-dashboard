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
                "repo": issue["repository"]["name"],
                "number": issue["number"],
                "title": issue["title"],
                "url": issue["url"],
                "labels": [label["name"] for label in issue["labels"]],
                "assignees": [assignee["login"] for assignee in issue["assignees"]],
                "created_by": issue["user"]["login"],
            }
            for issue in response.json()
        ]
