from Group16.dao import database
from Group16.config import config

import logging

logger = logging.getLogger(__name__)

class ProductService:
    
    def __init__(self):
        pass
    
    def getAllProducts(self):
        logger.info('Getting all Products')
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
    
class RetailService:
    
    def __init__(self):
        pass
    
    def getAllLocations(self):
        logger.info('Getting all Retail Locations')
        db = database.Database()
        q = """SELECT * FROM Retail_Locations"""
        result = db.queryDB(q)
        return result
    
    def getLocationById(self, id):
        logger.info('Getting Retail Location by id: %s', id)
        db = database.Database()
        q = """SELECT * FROM Retail_Locations WHERE rID=%s"""
        result = db.queryDB(q, [id])
        return result
    
    def addLocation(self, jsonObj):
        logger.info('%s', jsonObj)
        if(isinstance(jsonObj, dict)):
            db = database.Database()
            q = """
                INSERT INTO Retail_Locations (rName, rStreet, rCity, rState, rZip)
                VALUES (%s, %s, %s, %s, %s)
            """
            params = [
                jsonObj['rName'],
                jsonObj['rStreet'],
                jsonObj['rCity'],
                jsonObj['rState'],
                jsonObj['rZip']
            ]
            result = db.queryDB(q, params, True)
            return result
        else:
            return "Please send a JSON object"
    
    def updateLocationById(self, jsonObj, id):
        logger.info('%s', jsonObj)
        logger.info('%s', id)
        if(isinstance(jsonObj, dict)):
            if(jsonObj['rID'] is None or jsonObj['rID'] is not id):
                jsonObj['rID'] = id
            db = database.Database()
            q = """
                UPDATE Retail_Locations
                SET rName = %s, rStreet = %s, rCity = %s, rState = %s, rZip = %s
                WHERE rID = %s
            """
            params = [
                jsonObj['rName'], jsonObj['rStreet'], jsonObj['rCity'], jsonObj['rState'], jsonObj['rZip'], jsonObj['rID']
            ]
            result = db.queryDB(q, params, True)
            return result
        else:
            return "Please send a JSON object"
    
    def deleteLocationById(self, id):
        logger.info('Delete location with id: %s', id)
        db = database.Database()
        q = """DELETE FROM Retail_Locations WHERE rID=%s"""
        result = db.queryDB(q, [id], True)
        return result

class SellsService:

        def __init__(self):
            pass

        def getAllSells(self):
            logger.info('Getting all transactions')
            db = database.Database()
            q = """SELECT * FROM Sells"""
            result = db.queryDB(q)
            return result

        def getSellsById(self,id):
            logger.info('Getting Transaction by id: %s', id)
            db = database.Database()
            q = """SELECT * FROM Sells WHERE transactionID=%s"""
            result = db.queryDB(q, [id])
            return result

        def addSells(self, jsonObj):
            logger.info('%s', jsonObj)
            logger.info('This is a %s', type(jsonObj))
            if (isinstance(jsonObj, dict)):
                db = database.Database()
                q = """
                    INSERT INTO Sells (Sales_Price, Date, Qty, Retail_Locations_rID, Products_pID, transactionID)
                    VALUES(%s, %s, %s, %s, %s, %s)
                """
                params = [jsonObj['Sales_Price'], jsonObj['Date'], jsonObj['Qty'], jsonObj['Retail_Locations_rID'], jsonObj['Products_pID'], jsonObj['transactionID']]
                result = db.queryDB(q, params, True)
                return result
            else:
                return "Please send a JSON object"

        def updateSellsById(self, jsonObj, id):
            logger.info('%s', jsonObj)
            logger.info('%s', id)
            if (isinstance(jsonObj, dict)):
                if (jsonObj['transactionID'] is None or jsonObj['transactionID'] is not id):
                    jsonObj['transacctionID'] = id
                db = database.Database()
                q = """
                    UPDATE Sells
                    SET Sales_Price = %s, Date = %s, Qty = %s, Retail_Locations_rID = %s, Products_pID = %s, # Im pretty sure that we dont need to update the ID ever
                    WHERE transactionID = %s
                """
                params = [jsonObj['Sales_Price'], jsonObj['Date'], jsonObj['Qty'], jsonObj['Retail_Locations_rID'],
                          jsonObj['Products_pID'], jsonObj['transactionID']]
                result = db.queryDB(q, params, True)
                return result
            else:
                return "Please send a JSON object"

        def deleteSellsById(self, id):
            logger.info('Deleting transaction with id: %s', id)
            db = database.Database()
            q = """DELETE FROM Sells WHERE transactionID=%s"""
            result = db.queryDB(q, [id], True)
            return result