#!/usr/bin/env python3
"""
Check Earthdata Authentication
==============================

This script helps you check what NASA applications need to be authorized
for TEMPO data access.
"""

import requests
import webbrowser
from urllib.parse import urlparse

def check_application_access():
    """Check which applications need authorization"""
    
    print("🔐 Earthdata Authentication Checker")
    print("=" * 50)
    print("Checking which NASA applications need authorization...")
    print()
    
    # Test URLs for different NASA applications
    test_urls = [
        {
            "name": "ASDC Data Search Tool",
            "url": "https://data.asdc.earthdata.nasa.gov/asdc-prod-protected/TEMPO/TEMPO_NO2_L2_V03/2025.05.24/TEMPO_NO2_L2_V03_20250524T164226Z_S008G05.nc",
            "app_id": "F2TN1UIAkP8pHBZ2yWVWkQ"
        },
        {
            "name": "ASDC Production OPeNDAP", 
            "url": "https://data.asdc.earthdata.nasa.gov/opendap/TEMPO/TEMPO_NO2_L2_V03/2025.05.24/TEMPO_NO2_L2_V03_20250524T164226Z_S008G05.nc",
            "app_id": "OPeNDAP"
        }
    ]
    
    print("🧪 Testing application access...")
    print()
    
    for i, test in enumerate(test_urls):
        print(f"[{i+1}/{len(test_urls)}] Testing: {test['name']}")
        
        try:
            # Test with .netrc authentication
            response = requests.get(test['url'], timeout=10)
            
            if response.status_code == 200:
                print(f"    ✅ SUCCESS: {test['name']} is authorized!")
            elif response.status_code == 401:
                print(f"    ❌ UNAUTHORIZED: {test['name']} needs authorization")
                print(f"    🔗 Authorization URL: https://urs.earthdata.nasa.gov/oauth/authorize?client_id={test['app_id']}")
            elif response.status_code == 404:
                print(f"    ⚠️  NOT FOUND: URL might be incorrect")
            else:
                print(f"    ⚠️  STATUS {response.status_code}: {response.reason}")
                
        except Exception as e:
            print(f"    ❌ ERROR: {e}")
    
    print(f"\n📋 NEXT STEPS:")
    print(f"1. Go to: https://urs.earthdata.nasa.gov/profile")
    print(f"2. Click 'Authorize' for these applications:")
    print(f"   - ASDC Data Search Tool")
    print(f"   - ASDC Production OPeNDAP") 
    print(f"   - ASDC Prod UAT Data Download")
    print(f"   - directdatadownload-asdc")
    print(f"   - tempo_subset")
    print(f"3. After authorizing, run the download script again")
    
    print(f"\n🔗 Quick links:")
    print(f"   - Earthdata Profile: https://urs.earthdata.nasa.gov/profile")
    print(f"   - Applications: https://urs.earthdata.nasa.gov/profile")

if __name__ == "__main__":
    check_application_access()
