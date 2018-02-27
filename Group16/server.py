from flask import Flask, render_template, request, send_from_directory
from Group16.dao import database
from Group16.config import config
from Group16.services import dataService
#import simplejson as json
import json
import decimal
from datetime import date, datetime
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
sellsService = dataService.SellsService()

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/<path:path>")
def path_proxy(path):
    return app.send_static_file(path)

#
# Product routing
#

@app.route("/products/", methods=['GET', 'POST'])
def product():
    if request.method == 'GET':
        return json.dumps(productService.getAllProducts()), 200, {'Content-Type': 'application/json; charset=utf-8'}
    else:
        logger.info(request.get_json())
        return json.dumps(productService.addProduct(request.get_json())), 201
    
@app.route("/products/<id>/", methods=['GET', 'PUT', 'DELETE'])
def productById(id):
    if request.method == 'GET':
        return json.dumps(productService.getProductById(id)), 200, {'Content-Type': 'application/json; charset=utf-8'}
    elif request.method == 'PUT':
        logger.info(request.get_json())
        return productService.updateProductById(request.get_json(), id), 200
    else:
        return productService.deleteProductById(id), 200

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

#
# Sells routing
#

@app.route("/sells/", methods=['GET','POST'])
def sells():
    if request.method == 'GET':
<<<<<<< HEAD
        return json.dumps(sellsService.getAllTransactions(), default=json_serial), 200, {'Content-Type': 'application/json; charset=utf-8'}
    else:
        logger.info(request.get_json())
        return json.dumps(sellsServie.addTransaction(request.get_json()), parse_float=decimal.Decimal, default=json_serial), 201
=======
        return json.dumps(sellsService.getAllSells()), 200, {'Content-Type': 'application/json; charset=utf-8'}
    else:
        logger.info(request.get_json())
        return json.dumps(sellsService.addSells(request.get_json())), 201
>>>>>>> b69fe17949178e3597b8a1b28302235742bc520d

@app.route("/sells/<id>/", methods=['GET','PUT','DELETE'])
def sellsById(id):
    if request.method == 'GET':
        return json.dumps(sellsService.getSellsById(id)), 200, {'Content-Type': 'application"json; charset=utf-8'}
    elif request.method == 'PUT':
        logger.info(request.get_json())
        return json.dumps(sellsService.updateSellsById(request.get_json(), id)), 200
    else:
<<<<<<< HEAD
        return json.dumps(sellsService.deleteTransactionById(id)), 200

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, decimal.Decimal):
        return float(obj)
    raise TypeError ("Type %s not serializable", type(obj))
=======
        return json.dumps(sellsService.deleteSellsById(id)), 200
>>>>>>> b69fe17949178e3597b8a1b28302235742bc520d
