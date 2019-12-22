def commitAndClose(conn):
	conn.commit()
	conn.close()
