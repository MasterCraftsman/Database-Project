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
        result = db.selectFromDB(q)
        return result
    
    def getProductById(self, id):
        logger.info('Getting product by id: %s', id)
        db = database.Database()
        q = """SELECT * FROM Products WHERE Id=%s"""
        result = db.selectFromDB(q,[id])
        return result