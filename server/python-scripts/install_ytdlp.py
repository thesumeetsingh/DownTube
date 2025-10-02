#!/usr/bin/env python3
import subprocess
import sys

def install_yt_dlp():
    try:
        subprocess.run(['yt-dlp', '--version'], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("yt-dlp is already installed")
    except Exception:
        print("Installing yt-dlp via pip")
        subprocess.run([sys.executable, "-m", "pip", "install", "yt-dlp"], check=True)
        print("yt-dlp installation completed")

if __name__ == "__main__":
    install_yt_dlp()
