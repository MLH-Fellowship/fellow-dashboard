from flask_restful import Resource, reqparse, abort
from utils.error_handling import handle_github_request_errors

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
