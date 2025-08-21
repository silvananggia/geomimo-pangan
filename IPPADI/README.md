# IP Padi Application

This application calculates the rice planting index using Sentinel-1 data analysis.

## Features

- **Dynamic Parameters**: All rice growth parameters can now be customized via HTTP request
- **Flask API**: RESTful endpoint to trigger the calculation process
- **Dual C++ Backend**: Two implementations available:
  - `ip_padi`: Modern MinIO S3-based version with streaming capabilities
  - `modul_ip_padi`: Traditional file-based version for local processing
- **Implementation Choice**: Users can choose which backend to use via API parameter

## Setup

### Prerequisites

- C++ compiler (g++ with C++17 support)
- MinIO C++ SDK
- libcurl development libraries
- Python 3.x with Flask

### Compilation

**On Windows:**
```bash
compile.bat
```

**On Linux/Mac:**
```bash
chmod +x compile.sh
./compile.sh
```

**Note:** This will create two executables:
- `hitung_ip` (or `hitung_ip.exe` on Windows) - MinIO S3 version
- `modul_ip_padi` (or `modul_ip_padi.exe` on Windows) - File-based version with AOI support

### Running the Application

1. Start the Flask server:
```bash
python main.py
```

2. The server will run on `http://localhost:5000`

## API Usage

### Run IP Padi Calculation

**Endpoint:** `GET /run_ip_padi`

**Parameters:**
- `list` (optional): Input file list path (default: `data/list_input.txt`)
- `output` (optional): Output name prefix (default: `Pantura`)
- `implementation` (optional): Choose between "ip_padi" (MinIO S3) or "modul_ip_padi" (file-based) (default: `ip_padi`)
- `per1sikluspadi` (optional): Distance between plantings in periods (default: `8`)
- `perekstremmin` (optional): Number of periods left/right to determine minimum (default: `4`)
- `perekstremmax` (optional): Number of periods left/right to determine maximum (default: `4`)
- `btsbedaekstremmaxmin` (optional): DN difference threshold between max and min during 60 periods (default: `0.3`)
- `batasekstremmin` (optional): Minimum DN threshold for extreme minimum detection (default: `0.7`)
- `jlmkelaspertumbuhanminimum` (optional): Minimum distance between planting and harvest (default: `7`)
- `aoi_xmin` (optional): AOI minimum longitude (default: full image)
- `aoi_xmax` (optional): AOI maximum longitude (default: full image)
- `aoi_ymin` (optional): AOI minimum latitude (default: full image)
- `aoi_ymax` (optional): AOI maximum latitude (default: full image)

**Example Requests:**

Basic usage (uses default parameters):
```
http://localhost:5000/run_ip_padi
```

Custom output name:
```
http://localhost:5000/run_ip_padi?output=JawaBarat
```

Custom planting cycle distance:
```
http://localhost:5000/run_ip_padi?per1sikluspadi=6
```

All parameters custom:
```
http://localhost:5000/run_ip_padi?list=data/custom_list.txt&output=JawaBarat&per1sikluspadi=10&perekstremmin=6&perekstremmax=6&btsbedaekstremmaxmin=0.4&batasekstremmin=0.6&jlmkelaspertumbuhanminimum=8
```

Custom planting cycle and extreme detection:
```
http://localhost:5000/run_ip_padi?per1sikluspadi=6&perekstremmin=5&perekstremmax=5
```

Custom thresholds:
```
http://localhost:5000/run_ip_padi?btsbedaekstremmaxmin=0.25&batasekstremmin=0.75
```

Using modul_ip_padi implementation (file-based):
```
http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&per1sikluspadi=6
```

Using modul_ip_padi with custom parameters:
```
http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&per1sikluspadi=10&perekstremmin=6&perekstremmax=6
```

Using AOI bbox to process only a specific area:
```
http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&aoi_xmin=110.0&aoi_xmax=110.1&aoi_ymin=-6.1&aoi_ymax=-6.0
```

Combining AOI with custom parameters:
```
http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&per1sikluspadi=6&aoi_xmin=110.0&aoi_xmax=110.05&aoi_ymin=-6.05&aoi_ymax=-6.0
```

**Response:**
```json
{
    "status": "success",
    "message": "Proses telah dijalankan",
    "implementation": "ip_padi",
    "executable": "./hitung_ip",
    "parameters": {
        "list_input": "data/list_input.txt",
        "nama_output": "Pantura",
        "per1sikluspadi": 8,
        "perekstremmin": 4,
        "perekstremmax": 4,
        "btsbedaekstremmaxmin": 0.3,
        "batasekstremmin": 0.7,
        "jlmkelaspertumbuhanminimum": 7
    },
    "stdout": "..."
}
```

**Response with AOI parameters:**
```json
{
    "status": "success",
    "message": "Proses telah dijalankan",
    "implementation": "modul_ip_padi",
    "executable": "./modul_ip_padi",
    "parameters": {
        "list_input": "data/list_input.txt",
        "nama_output": "Pantura",
        "per1sikluspadi": 8,
        "perekstremmin": 4,
        "perekstremmax": 4,
        "btsbedaekstremmaxmin": 0.3,
        "batasekstremmin": 0.7,
        "jlmkelaspertumbuhanminimum": 7,
        "aoi_xmin": 110.0,
        "aoi_xmax": 110.1,
        "aoi_ymin": -6.1,
        "aoi_ymax": -6.0
    },
    "stdout": "..."
}
```

### Check Results

**Endpoint:** `GET /cek_ip_padi`

**Parameters:**
- `output` (optional): Output name prefix to check (default: `Pantura`)

**Example:**
```
http://localhost:5000/cek_ip_padi?output=JawaBarat
```

## Implementation Details

### ip_padi (MinIO S3 Version)
- **Data Source**: MinIO S3 cloud storage
- **Processing**: Streaming data processing for large datasets
- **Dependencies**: Requires MinIO C++ SDK and libcurl
- **Use Case**: Cloud-based processing, large-scale data analysis
- **Performance**: Optimized for memory efficiency with streaming

### modul_ip_padi (File-based Version)
- **Data Source**: Local file system
- **Processing**: Traditional file I/O processing with AOI support
- **Dependencies**: Only requires standard C++ libraries
- **Use Case**: Local processing, smaller datasets, development/testing, area-specific analysis
- **Performance**: Direct file access, suitable for local environments
- **AOI Support**: Can process only specific geographic areas (bounding box)

## Parameter Details

### per1sikluspadi
- **Description**: Distance between rice planting cycles in time periods
- **Default Value**: 8
- **Range**: Positive integers (1, 2, 3, ...)
- **Unit**: Time periods (each period = 12 days)
- **Impact**: 
  - Lower values: More frequent planting cycles
  - Higher values: Less frequent planting cycles
  - Affects the detection of planting patterns in the time series data

### perekstremmin
- **Description**: Number of periods to the left/right to determine local minimum
- **Default Value**: 4
- **Range**: Positive integers (1, 2, 3, ...)
- **Unit**: Time periods
- **Impact**: 
  - Lower values: More sensitive to local minima
  - Higher values: More robust to noise, but may miss subtle patterns

### perekstremmax
- **Description**: Number of periods to the left/right to determine local maximum
- **Default Value**: 4
- **Range**: Positive integers (1, 2, 3, ...)
- **Unit**: Time periods
- **Impact**: 
  - Lower values: More sensitive to local maxima
  - Higher values: More robust to noise, but may miss subtle patterns

### btsbedaekstremmaxmin
- **Description**: Threshold for DN difference between maximum and minimum during 60 periods
- **Default Value**: 0.3
- **Range**: 0.0 to 1.0 (exclusive)
- **Unit**: Ratio of total DN range
- **Impact**: 
  - Lower values: More sensitive to smaller variations
  - Higher values: Only detects significant variations

### batasekstremmin
- **Description**: Minimum DN threshold for extreme minimum detection
- **Default Value**: 0.7
- **Range**: 0.0 to 1.0 (exclusive)
- **Unit**: Ratio of total DN range
- **Impact**: 
  - Lower values: More sensitive to higher DN values
  - Higher values: Only detects very low DN values

### jlmkelaspertumbuhanminimum
- **Description**: Minimum distance between planting and harvest periods
- **Default Value**: 7
- **Range**: Positive integers (1, 2, 3, ...)
- **Unit**: Time periods
- **Impact**: 
  - Lower values: Allows shorter growth cycles
  - Higher values: Ensures realistic growth periods

## AOI (Area of Interest) Parameters

### aoi_xmin, aoi_xmax, aoi_ymin, aoi_ymax
- **Description**: Geographic bounding box coordinates to limit processing area
- **Default Value**: Full image extent (no AOI restriction)
- **Range**: Valid geographic coordinates within image bounds
- **Unit**: Decimal degrees (longitude/latitude)
- **Impact**: 
  - **Performance**: Significantly faster processing for small areas
  - **Memory**: Reduced memory usage for large datasets
  - **Output**: Only processes and outputs data within specified area
  - **Use Cases**: Regional analysis, testing, focused studies
- **Note**: Only supported by `modul_ip_padi` implementation

## File Structure

```
IPPADI/
├── app/
│   ├── ip_padi.cpp          # Main C++ processing engine
│   └── modul_ip_padi.cpp    # Original module (reference)
├── data/                    # Input data directory
├── output/                  # Generated output files
├── main.py                  # Flask web server
├── test_api.py              # API testing script
├── compile.sh               # Linux/Mac compilation script
├── compile.bat              # Windows compilation script
└── run.sh                   # Run script
```

## Output Files

The application generates 9 output files:
1. `{output}_IP.ers` - Planting-Harvest Index
2. `{output}_Tanam_TW1.ers` - Planting Time Quarter 1
3. `{output}_Tanam_TW2.ers` - Planting Time Quarter 2
4. `{output}_Tanam_TW3.ers` - Planting Time Quarter 3
5. `{output}_Tanam_TW4.ers` - Planting Time Quarter 4
6. `{output}_Panen_TW1.ers` - Harvest Time Quarter 1
7. `{output}_Panen_TW2.ers` - Harvest Time Quarter 2
8. `{output}_Panen_TW3.ers` - Harvest Time Quarter 3
9. `{output}_Panen_TW4.ers` - Harvest Time Quarter 4

## Testing

A test script is provided to verify the API functionality:

```bash
python test_api.py
```

This script tests:
- Basic requests with default parameters
- Custom parameter combinations
- Error handling for invalid parameters
- All parameter customization scenarios

## Error Handling

- Invalid parameter values will result in a 400 error with descriptive messages
- Missing input files will result in a 400 error
- Compilation errors will be reported during the build process
- Parameter validation includes:
  - Positive integers for count parameters
  - Values between 0 and 1 for ratio parameters
  - Type validation for all parameters

http://localhost:5000/run_ip_padi?implementation=modul_ip_padi&aoi_xmin=110.0&aoi_xmax=110.1&aoi_ymin=-6.1&aoi_ymax=-6.0