def handle_github_request_errors(response):
    if response.status_code == 401:
        abort(401, message="invalid oauth token")
    if response.status_code == 404:
        abort(404, message="resource not found, check request arguments")
