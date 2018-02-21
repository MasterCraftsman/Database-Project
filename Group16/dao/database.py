import pymysql.cursors
import logging

from Group16.config import config

logger = logging.getLogger(__name__)

class Database:
    
    def __init__(self):
        self.config = config.DATABASE_CONFIG
        
    def connect_db(self, dbname = "SER322db"):
        if(dbname is not config.DATABASE_CONFIG['db']):
            raise ValueError("Could not find DB with given name")
        logger.debug('Attempting to create connection to %s', self.config['db'])
        conn = pymysql.connect(
            host=self.config['host'],
            user=self.config['user'],
            password=self.config['password'],
            db=self.config['db'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor)
        
        return conn
        
    def queryDB(self, q):
        try:
            with self.connect_db().cursor() as curs:
                curs.execute(q)
                result = curs.fetchone()
                return result
        except Exception as e:
            print(e)
        finally:
            self.connect_db().close()