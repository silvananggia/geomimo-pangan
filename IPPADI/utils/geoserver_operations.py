import requests
from requests.auth import HTTPBasicAuth
from config import GEOSERVER_CONFIG

def upload_to_geoserver(file_path, workspace, datastore, style_name):
    geoserver_url = GEOSERVER_CONFIG['url']
    geoserver_user = GEOSERVER_CONFIG['user']
    geoserver_password = GEOSERVER_CONFIG['password']

    headers_tiff = {'Content-Type': 'image/tiff'}
    
    with open(file_path, 'rb') as fileobj:
        response = requests.put(
            f'{geoserver_url}/workspaces/{workspace}/coveragestores/{datastore}/file.geotiff',
            headers=headers_tiff,
            data=fileobj,
            auth=HTTPBasicAuth(geoserver_user, geoserver_password)
        )

    if response.status_code != 201:
        raise Exception(f"Failed to upload file to GeoServer: {response.text}")
    
    headers_xml = {'Content-Type': 'application/xml'}
    
    # 3) Set the default style
    style_url = f"{geoserver_url}/layers/{workspace}:{datastore}"
    style_data = f"<layer><defaultStyle><name>{style_name}</name></defaultStyle></layer>"
    
    response = requests.put(
        style_url,
        auth=HTTPBasicAuth(geoserver_user, geoserver_password),
        data=style_data,
        headers=headers_xml
    )
    
    if response.status_code != 200:
        raise Exception(f"Failed to set style. Status code: {response.status_code}, Response: {response.text}")
    
    return response.text
