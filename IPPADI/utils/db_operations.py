import psycopg2
from config import DB_CONFIG
from utils.common import generate_uuid

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

def insert_job(id_proses, status="preparing", progress=0):
    """Insert a new job record into the database"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO jobs (id, status, progress) VALUES (%s, %s, %s)", (id_proses, status, progress))
    conn.commit()
    cur.close()
    conn.close()

def get_job_status(id_proses):
    """Get the status of a job from the database"""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, status, progress, created_at, updated_at FROM jobs WHERE id = %s", (id_proses,))
    result = cur.fetchone()
    cur.close()
    conn.close()
    
    if result:
        return {
            "id": result[0],
            "status": result[1],
            "progress": result[2],
            "created_at": result[3].isoformat() if result[3] else None,
            "updated_at": result[4].isoformat() if result[4] else None
        }
    else:
        return {"status": "error", "message": "Job not found"}

def update_percentage(id_proses, percentage):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET progress = %s WHERE id = %s", (percentage, id_proses))
    conn.commit()
    cur.close()
    conn.close()

def update_status(id_proses, status):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET status = %s WHERE id = %s", (status, id_proses))
    conn.commit()
    cur.close()
    conn.close()

def insert_result(id_proses, workspace, layer):
    result_id = generate_uuid()  
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO results (id, jobid, workspace, layer) VALUES (%s, %s, %s, %s)", (result_id, id_proses, workspace, layer))
    conn.commit()
    cur.close()
    conn.close()

def update_time_start(id_proses):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET time_start = NOW() WHERE id = %s", (id_proses,))
    conn.commit()
    cur.close()
    conn.close()

def update_time_finish(id_proses):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("UPDATE jobs SET time_finish = NOW() WHERE id = %s", (id_proses,))
    conn.commit()
    cur.close()
    conn.close()