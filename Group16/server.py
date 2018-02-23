from flask import Flask, render_template, request
from Group16.dao import database
from Group16.config import config
from Group16.services import dataService
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

productService = dataService.ProductService()
retailService = dataService.RetailService()

@app.route("/")
def index():
    return render_template("index.html")

#
# Product routing
#

@app.route("/products/", methods=['POST'])
def addProduct():
    logger.info(request.get_json())
    result = productService.addProduct(request.get_json())
    return json.dumps(result), 201

@app.route("/products/", methods=['GET'])
def getAllProducts():
    return json.dumps(productService.getAllProducts()), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route("/products/<id>/", methods=['GET'])
def getProductById(id):
    return json.dumps(productService.getProductById(id)), 200, {'Content-Type': 'application/json; charset=utf-8'}

@app.route("/products/<id>/", methods=['PUT'])
def updateProductById(id):
    logger.info(request.get_json())
    result = productService.updateProductById(request.get_json(), id)
    return result, 200

@app.route("/products/<id>/", methods=['DELETE'])
def deleteProductById(id):
    result = productService.deleteProductById(id)
    return result, 200

#
#  Retail routing
#

@app.route("/retail/", methods=['GET', 'POST'])
def retail():
    if request.method == 'GET':
        return json.dumps(retailService.getAllLocations()), 200, {'Content-Type': 'application/json; charset=utf-8'}
    else:
        logger.info(request.get_json())
        return json.dumps(retailService.addLocation(request.get_json())), 201

@app.route("/retail/<id>/", methods=['GET', 'PUT', 'DELETE'])
def retailById(id):
    if request.method == 'GET':
        return json.dumps(retailService.getLocationById(id)), 200, {'Content-Type': 'application:json; charset=utf-8'}
    elif request.method == 'PUT':
        logger.info(request.get_json())
        return json.dumps(retailService.updateLocationById(request.get_json(), id)), 200
    else:
        return json.dumps(retailService.deleteLocationById(id)), 200

if __name__ == "__main__":
    app.run()