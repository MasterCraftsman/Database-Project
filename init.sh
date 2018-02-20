#!/bin/bash
export FLASK_APP=./Group16/server.py
source $(pipenv --venv)/bin/activate
flask run