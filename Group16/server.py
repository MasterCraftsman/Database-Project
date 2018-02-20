from flask import Flask, render_template, jsonify

app = Flask(__name__)

products = [
    {
        'pId': 1,
        'pName': 'Test',
        'pDepartment': 'Dept 21',
        'pWeight': 12.22,
        'pCost': 20.55
    }
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/products")
def getAllProducts():
    return jsonify(products)