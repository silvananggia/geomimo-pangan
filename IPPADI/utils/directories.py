import os

def create_directories(id_proses):
    workspace_dir = "./workspace"
    os.makedirs(workspace_dir, exist_ok=True)
    
    working_dir = os.path.join(workspace_dir, id_proses)
    os.makedirs(working_dir, exist_ok=True)
    os.makedirs(os.path.join(working_dir, 'cog'), exist_ok=True)
    os.makedirs(os.path.join(working_dir, 'output'), exist_ok=True)
    
    return working_dir


