from flask_restful import Resource
from utils.error_handling import handle_github_request_errors
import requests


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
