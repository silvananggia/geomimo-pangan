#!/bin/bash

# Compilation script for IP Padi C++ application
echo "Compiling IP Padi application..."

# Create output directory
mkdir -p output

# Compile both C++ applications

echo "Compiling modul_ip_padi.cpp (file-based version)..."
g++ -std=c++17 -O2 -o modul_ip_padi app/modul_ip_padi.cpp

if [ $? -eq 0 ]; then
    echo "✓ modul_ip_padi.cpp compilation successful! Executable 'modul_ip_padi' created."
else
    echo "✗ modul_ip_padi.cpp compilation failed!"
    echo "Make sure you have g++ compiler installed"
    exit 1
fi

echo ""
echo "All compilations successful!"
echo "Executables created:"
echo "  - modul_ip_padi (file-based version)"
echo ""
echo "You can now run the Flask application with: python3 main.py"
