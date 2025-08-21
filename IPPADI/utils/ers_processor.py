import os
import subprocess
import tempfile
from utils.db_operations import update_percentage

def process_ers_to_cog(ers_file_path, working_dir, id_proses):
    """
    Convert ERS file to Cloud Optimized GeoTIFF (COG) format
    
    Args:
        ers_file_path (str): Path to the input ERS file
        working_dir (str): Working directory for output files
        id_proses (str): Process ID for progress tracking
    
    Returns:
        str: Path to the output COG file, or None if conversion failed
    """
    try:
        # Get the base name of the ERS file
        base_name = os.path.splitext(os.path.basename(ers_file_path))[0]
        
        # Create output directory for COG files
        cog_output_dir = os.path.join(working_dir, 'cog')
        os.makedirs(cog_output_dir, exist_ok=True)
        
        # Output COG file path
        cog_output_path = os.path.join(cog_output_dir, f"{base_name}.tif")
        
        # Check if GDAL is available
        if not check_gdal_availability():
            raise Exception("GDAL is not available. Please install GDAL with COG support.")
        
        # Convert ERS to GeoTIFF first (if needed)
        geotiff_path = ers_file_path
        if not ers_file_path.lower().endswith('.tif') and not ers_file_path.lower().endswith('.tiff'):
            # Convert ERS to GeoTIFF first
            geotiff_path = convert_ers_to_geotiff(ers_file_path, working_dir)
            if not geotiff_path:
                raise Exception(f"Failed to convert ERS file to GeoTIFF: {ers_file_path}")
        
        # Convert to COG format
        cog_file = convert_to_cog(geotiff_path, cog_output_path)
        
        if cog_file and os.path.exists(cog_file):
            print(f"Successfully converted {ers_file_path} to COG: {cog_file}")
            return cog_file
        else:
            raise Exception(f"COG conversion failed for {ers_file_path}")
            
    except Exception as e:
        print(f"Error processing ERS file {ers_file_path}: {str(e)}")
        return None

def check_gdal_availability():
    """Check if GDAL is available and has COG support"""
    try:
        result = subprocess.run(['gdalinfo', '--version'], 
                              capture_output=True, text=True, timeout=10)
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, subprocess.SubprocessError):
        return False

def convert_ers_to_geotiff(ers_file_path, working_dir):
    """
    Convert ERS file to GeoTIFF format using GDAL
    
    Args:
        ers_file_path (str): Path to the input ERS file
        working_dir (str): Working directory for output files
    
    Returns:
        str: Path to the output GeoTIFF file, or None if conversion failed
    """
    try:
        base_name = os.path.splitext(os.path.basename(ers_file_path))[0]
        geotiff_path = os.path.join(working_dir, 'temp', f"{base_name}.tif")
        
        # Create temp directory
        temp_dir = os.path.join(working_dir, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        
        # Use gdal_translate to convert ERS to GeoTIFF
        cmd = [
            'gdal_translate',
            '-of', 'GTiff',
            '-co', 'COMPRESS=LZW',
            '-co', 'TILED=YES',
            ers_file_path,
            geotiff_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0 and os.path.exists(geotiff_path):
            return geotiff_path
        else:
            print(f"ERS to GeoTIFF conversion failed: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"Error converting ERS to GeoTIFF: {str(e)}")
        return None

def convert_to_cog(input_file, output_file):
    """
    Convert GeoTIFF to Cloud Optimized GeoTIFF (COG) format
    
    Args:
        input_file (str): Path to the input GeoTIFF file
        output_file (str): Path to the output COG file
    
    Returns:
        str: Path to the output COG file, or None if conversion failed
    """
    try:
        # Use gdal_translate with COG-specific options
        cmd = [
            'gdal_translate',
            '-of', 'COG',
            '-co', 'COMPRESS=LZW',
            '-co', 'OVERVIEW_COMPRESS=LZW',
            '-co', 'BLOCKSIZE=512',
            '-co', 'OVERVIEW_RESAMPLING=NEAREST',
            input_file,
            output_file
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
        
        if result.returncode == 0 and os.path.exists(output_file):
            return output_file
        else:
            print(f"COG conversion failed: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"Error converting to COG: {str(e)}")
        return None

def validate_cog_file(cog_file_path):
    """
    Validate that the generated COG file is valid
    
    Args:
        cog_file_path (str): Path to the COG file to validate
    
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        if not os.path.exists(cog_file_path):
            return False
        
        # Use gdalinfo to check if the file is valid
        cmd = ['gdalinfo', cog_file_path]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"Error validating COG file: {str(e)}")
        return False

def cleanup_temp_files(working_dir):
    """
    Clean up temporary files created during processing
    
    Args:
        working_dir (str): Working directory containing temp files
    """
    try:
        temp_dir = os.path.join(working_dir, 'temp')
        if os.path.exists(temp_dir):
            import shutil
            shutil.rmtree(temp_dir)
            print(f"Cleaned up temporary directory: {temp_dir}")
    except Exception as e:
        print(f"Error cleaning up temp files: {str(e)}")
