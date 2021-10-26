import sqlite3

DB_NAME = "danarchy"

conn = sqlite3.connect(DB_NAME)
curs = conn.cursor()

curs.close
