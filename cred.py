import psycopg2
import os

def create_conn():
    conn = psycopg2.connect(host=os.environ['Host'],
                            user=os.environ['Username'],
                            password=os.environ['Password'],
                            port=os.environ['Port'],
                            dbname=os.environ['Database'])
    return conn


secret_key = os.environ['secret_key']
api_key = os.environ['api_key']

