from flask import Flask
from flask_restful import Api
from flask_cors import CORS

from widgets.scratchpad import Scratchpad
from widgets.github_discussions import GithubPodList, GithubDiscussionList
from widgets.standup import GithubViewSubmitLatestStandup
from widgets.github_issues import GithubIssueList

app = Flask(__name__)
api = Api(app)
CORS(app)

api.add_resource(Scratchpad, "/scratchpad/<string:id>")
api.add_resource(GithubPodList, "/github/list-pods/<string:oAuth_token>")
api.add_resource(
    GithubDiscussionList,
    "/github/list-discussions/<string:pod_slug>/<string:oAuth_token>",
)
api.add_resource(
    GithubViewSubmitLatestStandup,
    "/github/standup/<string:pod_slug>/<string:oAuth_token>",
)
api.add_resource(
    GithubIssueList, "/github/issues/<string:query_type>/<string:oAuth_token>"
)

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5000)
