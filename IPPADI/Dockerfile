FROM ghcr.io/osgeo/gdal:ubuntu-small-3.11.3

WORKDIR /app

# Install Python & tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-dev \
    python3-pip \
    python3-venv \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Virtualenv
RUN python3 -m venv /app/venv

# Install dependencies
COPY requirements.txt .
RUN /app/venv/bin/pip install --upgrade pip \
 && /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy kode
COPY app/ ./app
COPY utils/ ./utils
COPY workspace/ ./workspace

# Copy configuration and main files
COPY config.py .
COPY main.py .
COPY run.sh .
RUN chmod +x run.sh

# Compile C++
RUN g++ ./app/modul_ip_padi.cpp -O2 -o hitung_ip \
 && cp hitung_ip modul_ip_padi

CMD ["./run.sh"]
