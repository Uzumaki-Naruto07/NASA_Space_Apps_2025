#!/usr/bin/env python3
"""
Run Canada TEMPO Bash Scripts
============================

This script runs the actual bash scripts to download TEMPO L2 data.
The bash scripts handle authentication properly.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_bash_script(script_path, output_dir):
    """Run a bash script and capture output"""
    print(f"🚀 Running: {os.path.basename(script_path)}")
    
    # Create output directory
    output_dir.mkdir(exist_ok=True)
    
    # Change to the script directory
    script_dir = Path(script_path).parent
    script_name = Path(script_path).name
    
    try:
        # Run the bash script
        result = subprocess.run(
            ['bash', script_name],
            cwd=script_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            print(f"  ✅ Script completed successfully")
            print(f"  Output: {result.stdout[:200]}...")
            return True
        else:
            print(f"  ❌ Script failed with return code {result.returncode}")
            print(f"  Error: {result.stderr[:200]}...")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  ⏰ Script timed out after 5 minutes")
        return False
    except Exception as e:
        print(f"  ❌ Error running script: {e}")
        return False

def main():
    print("🌍 Canada TEMPO L2 Data Downloader (Bash Scripts)")
    print("=" * 60)
    print("Running the actual bash scripts to download L2 data...")
    print()
    
    # Canada bash scripts
    bash_scripts = [
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_NO2_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_HCHO_L2_V03.sh",
        "Tempo and weather/Canada (Wildfire Source Region)May 23–28, 2025/Tempo bash converter  /TEMPO_O3TOT_L3_V03.sh"
    ]
    
    output_dir = Path("canada_tempo_l2_data")
    successful_scripts = 0
    
    for script_path in bash_scripts:
        if not os.path.exists(script_path):
            print(f"⚠️  Script not found: {script_path}")
            continue
        
        if run_bash_script(script_path, output_dir):
            successful_scripts += 1
    
    print(f"\n📊 SUMMARY:")
    print(f"  Successful scripts: {successful_scripts}/{len(bash_scripts)}")
    print(f"  Output directory: {output_dir.absolute()}")
    
    if successful_scripts > 0:
        print(f"\n🎉 SUCCESS! Check the downloaded files in: {output_dir}")
        print(f"Next steps:")
        print(f"1. Check what files were downloaded")
        print(f"2. Verify they contain real measurements")
        print(f"3. Use them in your validation system")
    else:
        print(f"\n❌ No scripts completed successfully.")
        print(f"Check your Earthdata credentials and try again.")

if __name__ == "__main__":
    main()
