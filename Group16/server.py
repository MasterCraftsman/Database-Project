from flask import Flask, render_template
from Group16.dao import database
from Group16.config import config
import pymysql.cursors
import simplejson as json
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG, format=config.LOGGING_CONFIG['format'])

logger = logging.getLogger(__name__)

products = [
    {
        'pId': 1,
        'pName': 'Test',
        'pDepartment': 'Dept 21',
        'pWeight': 12.22,
        'pCost': 20.55
    }
]

db = database.Database()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/products/")
def getAllProducts():
    return json.dumps(products)

@app.route("/test/")
def test():
    q = """SELECT * FROM Products"""
    result = db.queryDB(q)
    return json.dumps(result), 204

if __name__ == "__main__":
    app.run()