from flask import Flask, request, jsonify
import subprocess
import os
from utils.db_operations import update_status, update_percentage, insert_result, update_time_start, update_time_finish
from utils.directories import create_directories
from utils.ers_processor import process_ers_to_cog, cleanup_temp_files
from utils.geoserver_operations import upload_to_geoserver

app = Flask(__name__)

# Folder output default
DEFAULT_OUTPUT_DIR = "workspace/output"

# Membuat daftar nama file output yang diharapkan berdasarkan nama_output
def get_expected_output_files(nama_output):
    return [
        f"{nama_output}_IP.ers", f"{nama_output}_Tanam_TW1.ers", f"{nama_output}_Tanam_TW2.ers",
        f"{nama_output}_Tanam_TW3.ers", f"{nama_output}_Tanam_TW4.ers", f"{nama_output}_Panen_TW1.ers",
        f"{nama_output}_Panen_TW2.ers", f"{nama_output}_Panen_TW3.ers", f"{nama_output}_Panen_TW4.ers"
    ]

@app.route("/run_ip_padi", methods=["GET"])
def submit_process():
    list_input = request.args.get("list", "data/list_input.txt")
    nama_output = request.args.get("output", "Pantura")
    implementation = request.args.get("implementation", "ip_padi")  # "ip_padi" or "modul_ip_padi"
    id_proses = request.args.get("id_proses", "").strip()
    output_dir_param = request.args.get("output_dir", "").strip()
    # Compute output dir: prefer id_proses if provided
    if id_proses:
        output_dir = os.path.join("workspace", id_proses, "output")
    elif output_dir_param:
        output_dir = output_dir_param
    else:
        output_dir = DEFAULT_OUTPUT_DIR
    
    # Get all rice growth parameters with defaults
    per1sikluspadi = request.args.get("per1sikluspadi", "8")
    perekstremmin = request.args.get("perekstremmin", "4")
    perekstremmax = request.args.get("perekstremmax", "4")
    btsbedaekstremmaxmin = request.args.get("btsbedaekstremmaxmin", "0.3")
    batasekstremmin = request.args.get("batasekstremmin", "0.7")
    jlmkelaspertumbuhanminimum = request.args.get("jlmkelaspertumbuhanminimum", "7")
    
    # Get AOI bbox parameters (optional)
    aoi_xmin = request.args.get("aoi_xmin", "")
    aoi_xmax = request.args.get("aoi_xmax", "")
    aoi_ymin = request.args.get("aoi_ymin", "")
    aoi_ymax = request.args.get("aoi_ymax", "")

    update_status(id_proses, "preparing")
    update_time_start(id_proses)
    update_percentage(id_proses, 10)

    # Validate all parameters
    try:
        per1sikluspadi_int = int(per1sikluspadi)
        if per1sikluspadi_int <= 0:
            return jsonify({"status": "error", "message": "per1sikluspadi must be a positive integer"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "per1sikluspadi must be a valid integer"}), 400
    
    try:
        perekstremmin_int = int(perekstremmin)
        if perekstremmin_int <= 0:
            return jsonify({"status": "error", "message": "perekstremmin must be a positive integer"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "perekstremmin must be a valid integer"}), 400
    
    try:
        perekstremmax_int = int(perekstremmax)
        if perekstremmax_int <= 0:
            return jsonify({"status": "error", "message": "perekstremmax must be a positive integer"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "perekstremmax must be a valid integer"}), 400
    
    try:
        btsbedaekstremmaxmin_float = float(btsbedaekstremmaxmin)
        if btsbedaekstremmaxmin_float <= 0.0 or btsbedaekstremmaxmin_float >= 1.0:
            return jsonify({"status": "error", "message": "btsbedaekstremmaxmin must be between 0 and 1"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "btsbedaekstremmaxmin must be a valid number"}), 400
    
    try:
        batasekstremmin_float = float(batasekstremmin)
        if batasekstremmin_float <= 0.0 or batasekstremmin_float >= 1.0:
            return jsonify({"status": "error", "message": "batasekstremmin must be between 0 and 1"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "batasekstremmin must be a valid number"}), 400
    
    try:
        jlmkelaspertumbuhanminimum_int = int(jlmkelaspertumbuhanminimum)
        if jlmkelaspertumbuhanminimum_int <= 0:
            return jsonify({"status": "error", "message": "jlmkelaspertumbuhanminimum must be a positive integer"}), 400
    except ValueError:
        return jsonify({"status": "error", "message": "jlmkelaspertumbuhanminimum must be a valid integer"}), 400
    
    # Validate AOI parameters if provided
    aoi_params = []
    if aoi_xmin and aoi_xmax and aoi_ymin and aoi_ymax:
        try:
            aoi_xmin_float = float(aoi_xmin)
            aoi_xmax_float = float(aoi_xmax)
            aoi_ymin_float = float(aoi_ymin)
            aoi_ymax_float = float(aoi_ymax)
            
            if aoi_xmin_float >= aoi_xmax_float:
                return jsonify({"status": "error", "message": "aoi_xmin must be less than aoi_xmax"}), 400
            if aoi_ymin_float >= aoi_ymax_float:
                return jsonify({"status": "error", "message": "aoi_ymin must be less than aoi_ymax"}), 400
                
            aoi_params = [str(aoi_xmin_float), str(aoi_xmax_float), str(aoi_ymin_float), str(aoi_ymax_float)]
        except ValueError:
            return jsonify({"status": "error", "message": "AOI parameters must be valid numbers"}), 400
    
    # Cek file input ada
    if not os.path.exists(list_input):
        return jsonify({"status": "error", "message": f"File {list_input} tidak ditemukan"}), 400

    # Ensure directory structure exists
    if id_proses:
        working_dir = create_directories(id_proses)
        output_dir = os.path.join(working_dir, 'output')
    else:
        os.makedirs(output_dir, exist_ok=True)

    update_status(id_proses, "processing")
    update_percentage(id_proses, 30)
    
    # Choose implementation and build command (with fallback if one binary name is missing)
    if implementation == "modul_ip_padi":
        # Prefer modul_ip_padi name, fallback to hitung_ip if not present
        executable = "./modul_ip_padi" if os.path.exists("./modul_ip_padi") else "./hitung_ip"
        cmd = [executable, list_input, nama_output, str(per1sikluspadi_int),
               str(perekstremmin_int), str(perekstremmax_int), str(btsbedaekstremmaxmin_float),
               str(batasekstremmin_float), str(jlmkelaspertumbuhanminimum_int)]
        # Add AOI parameters if provided
        if aoi_params:
            cmd.extend(aoi_params)
        # Pass dynamic output directory if running modul_ip_padi
        if os.path.basename(executable) in ("modul_ip_padi", "modul_ip_padi.exe"):
            cmd.append(f"--outdir={output_dir}")
    else:
        # Default path prefers hitung_ip name, fallback to modul_ip_padi if not present
        executable = "./hitung_ip" if os.path.exists("./hitung_ip") else "./modul_ip_padi"
        cmd = [executable, list_input, nama_output, str(per1sikluspadi_int),
               str(perekstremmin_int), str(perekstremmax_int), str(btsbedaekstremmaxmin_float),
               str(batasekstremmin_float), str(jlmkelaspertumbuhanminimum_int)]
        # Add AOI parameters if provided and executable supports it (modul_ip_padi)
        if aoi_params and os.path.basename(executable) in ("modul_ip_padi", "modul_ip_padi.exe"):
            cmd.extend(aoi_params)
        # Only pass outdir when using modul_ip_padi
        if os.path.basename(executable) in ("modul_ip_padi", "modul_ip_padi.exe"):
            cmd.append(f"--outdir={output_dir}")
    
    result = subprocess.run(cmd, capture_output=True, text=True)

    # After ERS generation, convert each expected ERS to COG GeoTIFF
    expected_output_files = get_expected_output_files(nama_output)
    ers_full_paths = [os.path.join(output_dir, f) for f in expected_output_files]
    # Determine working directory for COG/temp outputs
    final_working_dir = output_dir if not id_proses else working_dir
    generated_cog_files = []
    failed_cog_files = []
    for ers_path in ers_full_paths:
        if os.path.exists(ers_path):
            cog_path = process_ers_to_cog(ers_path, final_working_dir, id_proses or "")
            if cog_path:
                generated_cog_files.append(cog_path)
            else:
                failed_cog_files.append(ers_path)
        else:
            failed_cog_files.append(ers_path)
    # Cleanup temporary files created during conversion
    try:
        cleanup_temp_files(final_working_dir)
    except Exception:
        pass

    # Upload generated COGs to GeoServer
    geoserver_workspace = request.args.get("geoserver_workspace", "test")
    geoserver_style = request.args.get("geoserver_style", "ippadi_style")
    geoserver_upload_results = []
    geoserver_failed_uploads = []
    first_datastore_name = None

    for cog_path in generated_cog_files:
        try:
            base_name = os.path.splitext(os.path.basename(cog_path))[0]
            datastore_name = f"ippadi_{id_proses}_{base_name}" if id_proses else base_name
            
            # Store the first datastore name for insertion
            if first_datastore_name is None:
                first_datastore_name = datastore_name
            
            upload_resp = upload_to_geoserver(cog_path, geoserver_workspace, datastore_name, geoserver_style)
            geoserver_upload_results.append({
                "file": cog_path,
                "datastore": datastore_name,
                "response": upload_resp
            })
        except Exception as e:
            geoserver_failed_uploads.append({
                "file": cog_path,
                "error": str(e)
            })
    
    # Only insert the first data
    if first_datastore_name:
        insert_result(id_proses, geoserver_workspace, first_datastore_name)
    update_percentage(id_proses, 100)
    update_status(id_proses, "finished")
    update_time_finish(id_proses)
    # Return status sukses bahwa proses telah dijalankan
    response_data = {
        "status": "success",
        "message": "Proses telah dijalankan",
        "implementation": implementation,
        "executable": executable,
        "parameters": {
            "list_input": list_input,
            "nama_output": nama_output,
            "per1sikluspadi": per1sikluspadi_int,
            "perekstremmin": perekstremmin_int,
            "perekstremmax": perekstremmax_int,
            "btsbedaekstremmaxmin": btsbedaekstremmaxmin_float,
            "batasekstremmin": batasekstremmin_float,
            "jlmkelaspertumbuhanminimum": jlmkelaspertumbuhanminimum_int,
            "output_dir": output_dir,
            "working_dir": working_dir if id_proses else None,
            "id_proses": id_proses or None
        },
        "stdout": result.stdout
    }

    # Attach COG conversion results
    response_data["cog_conversion"] = {
        "generated": generated_cog_files,
        "failed": failed_cog_files
    }
    # Attach GeoServer upload results
    response_data["geoserver_upload"] = {
        "uploaded": geoserver_upload_results,
        "failed": geoserver_failed_uploads
    }
    
    # Add AOI parameters if provided
    if aoi_params:
        response_data["parameters"]["aoi_xmin"] = float(aoi_xmin)
        response_data["parameters"]["aoi_xmax"] = float(aoi_xmax)
        response_data["parameters"]["aoi_ymin"] = float(aoi_ymin)
        response_data["parameters"]["aoi_ymax"] = float(aoi_ymax)
    
    return jsonify(response_data)


@app.route("/cek_ip_padi", methods=["GET"]) 
def check_results():
    nama_output = request.args.get("output", "Pantura")
    id_proses = request.args.get("id_proses", "").strip()
    output_dir_param = request.args.get("output_dir", "").strip()
    if id_proses:
        output_dir = os.path.join("workspace", id_proses, "output")
    elif output_dir_param:
        output_dir = output_dir_param
    else:
        output_dir = DEFAULT_OUTPUT_DIR
    
    # Daftar file output yang diharapkan
    expected_output_files = get_expected_output_files(nama_output)
    
    # Cek apakah semua file output yang diharapkan ada
    try:
        after_files = set(os.listdir(output_dir))
    except FileNotFoundError:
        return jsonify({
            "status": "error",
            "message": f"Direktori output tidak ditemukan: {output_dir}"
        }), 400
    missing_files = [file for file in expected_output_files if file not in after_files]
    
    if missing_files:
        return jsonify({
            "status": "error",
            "message": f"Beberapa file output tidak ditemukan: {', '.join(missing_files)}"
        }), 500

    return jsonify({
        "status": "success",
        "message": "Semua file output ditemukan",
        "expected_output_files": expected_output_files,
        "output_dir": output_dir
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
