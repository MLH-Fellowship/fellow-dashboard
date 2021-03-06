# Fellow Dashboard

An all in one place you could stay in during your fellowship.

# 💡 The idea

During the fellowship, you have multiple people to meet, multiple tasks to do, multiple platforms to do all this at. The first two are fun but so many platforms not so much. But what if we could give you one platform for all? Have your meeting schedule, your Github discussions, Github stats, LMS, Topic box everything in one place? Then we have exactly what you(we) need!

# ⚙️ Features planned

A dashboard which would have the following "widgets":

- [ ] Welcome page with Fellowship details
- [ ] Github stats with all the issues and PRs recently made
- [ ] A calendar with your schedule and events lined up
- [ ] A Github discussions embed so you can post your stand up notes
- [ ] A link to the LMS(Trainual)
- [ ] A link to Topic box for clear communication with your pod
      <br/>... more coming soon

# 📚 Tech stack

- <code><img height="35" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/python/python.png"></code> Python
- <code><img height="35" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png"></code> GIT
- <code><img height="35" src="https://github.com/edent/SuperTinyIcons/blob/master/images/svg/github.svg"></code> Github
- <code><img height="35" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/flask/flask.png"></code> Flask
- <code><img height="35" src="https://github.com/edent/SuperTinyIcons/blob/master/images/svg/react.svg"></code> React

### GitHub Authentication

To get the GitHub authentication to work, you need to create a `.env` file in the `frontend` directory with the following content

```bash
GITHUB_ID=<your_github_client_id>
GITHUB_SECRET=<your_github_client_secret>
AUTH_SECRET=<your_auth_secret>
JWT_SECRET=<your_auth_secret>
```

Follow the guide [here](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app) to create a new GitHub OAuth app.

The details should look something like this:

![OAuth App Details](images/githubAuth.png?raw=True)

On creating the OAuth app on GitHub, you need to set the `GITHUB_ID` in the `.env` file as the Client ID you see in the GitHub OAuth App in your account, and the `GITHUB_SECRET` to the Client Secret that you generate. Refer to the image below for more details

![GitHub OAuth App Creds](images/githubCLient.png?raw=True)

After adding the GITHUB_ID and GITHUB_SECRET to your `.env` create two more values called `AUTH_SECRET` and `JWT_SECRET` which you can generate yourself as any
string which will be used to authenticate with Github.

## Getting Started

### Running the App

You can run this app with just one simple command (i.e if you have Docker Compose installed)

```bash
# Make sure you are in the root directory of the repository
docker-compose up
```

Just wait for a minute or two till all containers finish spinning up, then navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Development

To start the frontend app, run the development server:

```bash
cd frontend

npm run dev
# or
yarn dev
```

To start the backend app, install the dependencies using `poetry`:

`poetry install`

Then start the app:

`poetry run python api.py`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
