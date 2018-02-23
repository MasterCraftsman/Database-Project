from Group16.dao import database
from Group16.config import config

import logging

logger = logging.getLogger(__name__)

class ProductService:
    
    def __init__(self):
        pass
    
    def getAllProducts(self):
        logger.debug('Getting all Products')
        db = database.Database()
        q = """SELECT * FROM Products"""
        result = db.queryDB(q)
        return result
    
    def getProductById(self, id):
        logger.info('Getting product by id: %s', id)
        db = database.Database()
        q = """SELECT * FROM Products WHERE pID=%s"""
        result = db.queryDB(q,[id])
        return result
    
    def addProduct(self, jsonObj):
        logger.info('%s', jsonObj)
        logger.info('This is a %s', type(jsonObj))
        if(isinstance(jsonObj, dict)):
            db = database.Database()
            q = """
                INSERT INTO Products (pCost, pName, pDepartment, pWeight)
                VALUES(%s, %s, %s, %s)
            """
            params = [jsonObj['pCost'], jsonObj['pName'], jsonObj['pDepartment'], jsonObj['pWeight']]
            result = db.queryDB(q, params, True)
            return result
        else:
            return "Please send a JSON object"
        
    def updateProductById(self, jsonObj, id):
        logger.info('%s', jsonObj)
        logger.info('%s', id)
        if(isinstance(jsonObj, dict)):
            if(jsonObj['pID'] is None or jsonObj['pID'] is not id):
                jsonObj['pID'] = id
            db = database.Database()
            q = """
                UPDATE Products
                SET pCost = %s, pName = %s, pDepartment = %s, pWeight = %s
                WHERE pID = %s
            """
            params = [jsonObj['pCost'], jsonObj['pName'], jsonObj['pDepartment'], jsonObj['pWeight'], jsonObj['pID']]
            result = db.queryDB(q, params, True)
            return result
        else:
            return "Please send a JSON object"
        
    def deleteProductById(self, id):
        logger.info('Deleting product with id: %s', id)
        db = database.Database()
        q = """DELETE FROM Products WHERE pID=%s"""
        result = db.queryDB(q, [id], True)
        return result