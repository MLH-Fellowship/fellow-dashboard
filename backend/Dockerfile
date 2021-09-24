FROM python:3.9

WORKDIR app/

COPY . .

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python -

RUN /root/.local/bin/poetry install

EXPOSE 3001

CMD ["/root/.local/bin/poetry", "run", "gunicorn","-b", "0.0.0.0:3001", "api:app"]
