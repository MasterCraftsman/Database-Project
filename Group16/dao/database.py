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
        try:
            conn = pymysql.connect(
                host=self.config['host'],
                user=self.config['user'],
                password=self.config['password'],
                db=self.config['db'],
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor)
        except Exception as e:
            logger.error('Error connectiong to %s', self.config['db'])
            conn.close()
        return conn
        
    def queryDB(self, q, params=None, update=False):
        logger.debug('Attempting to query db with: \n%s \n', q)
        conn = self.connect_db()
        if(params is not None):
            logger.debug('Params: %s\n', params)
            try:
                with conn.cursor() as curs:
                    curs.execute(q, params)
                    if (update):
                        # commit changes on update
                        conn.commit()
                        result = "success"
                    else:
                        result = curs.fetchall()
                    logger.info(result)
                    return result
            except Exception as e:
                logger.error('Error with query:\n%s\n', q)
                logger.error('Params: %s', params)
                logger.error(e)
            finally:
                logger.debug('Closing db connection after query')
                conn.close()
        else:
            try:
                with conn.cursor() as curs:
                    curs.execute(q)
                    result = curs.fetchall()
                    logger.info(result)
                    return result
            except Exception as e:
                logger.error('Error with query:\n %s \n', q)
            finally:
                logger.debug('Closing db connection after query')
                conn.close()