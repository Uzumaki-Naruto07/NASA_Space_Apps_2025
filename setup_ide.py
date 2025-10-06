#!/usr/bin/env python3
"""
IDE Setup Script for NASA Space Apps 2025
This script helps configure the IDE to use the correct Python interpreter
"""

import os
import sys
import json
from pathlib import Path

def setup_ide():
    """Configure IDE settings for the project"""
    print("🔧 Setting up IDE configuration...")
    
    # Get the current directory
    project_root = Path(__file__).parent.absolute()
    venv_python = project_root / "venv" / "bin" / "python"
    
    print(f"Project root: {project_root}")
    print(f"Virtual environment Python: {venv_python}")
    
    # Check if virtual environment exists
    if not venv_python.exists():
        print("❌ Virtual environment not found!")
        return False
    
    # Create .vscode directory if it doesn't exist
    vscode_dir = project_root / ".vscode"
    vscode_dir.mkdir(exist_ok=True)
    
    # Create settings.json
    settings = {
        "python.defaultInterpreterPath": str(venv_python),
        "python.terminal.activateEnvironment": True,
        "python.analysis.extraPaths": [
            str(project_root / "venv" / "lib" / "python3.13" / "site-packages")
        ],
        "python.analysis.autoImportCompletions": True,
        "python.analysis.typeCheckingMode": "basic",
        "python.linting.enabled": True,
        "python.linting.pylintEnabled": False,
        "python.linting.flake8Enabled": True,
        "python.formatting.provider": "black"
    }
    
    settings_file = vscode_dir / "settings.json"
    with open(settings_file, 'w') as f:
        json.dump(settings, f, indent=2)
    
    print(f"✅ Created {settings_file}")
    
    # Test imports
    print("\n🧪 Testing package imports...")
    try:
        import pandas as pd
        print("✅ pandas:", pd.__version__)
    except ImportError as e:
        print("❌ pandas:", e)
    
    try:
        import matplotlib.pyplot as plt
        print("✅ matplotlib")
    except ImportError as e:
        print("❌ matplotlib:", e)
    
    try:
        import seaborn as sns
        print("✅ seaborn")
    except ImportError as e:
        print("❌ seaborn:", e)
    
    try:
        import scipy
        print("✅ scipy:", scipy.__version__)
    except ImportError as e:
        print("❌ scipy:", e)
    
    try:
        import sklearn
        print("✅ sklearn:", sklearn.__version__)
    except ImportError as e:
        print("❌ sklearn:", e)
    
    try:
        import xgboost as xgb
        print("✅ xgboost:", xgb.__version__)
    except ImportError as e:
        print("❌ xgboost:", e)
    
    try:
        import lightgbm as lgb
        print("✅ lightgbm:", lgb.__version__)
    except ImportError as e:
        print("❌ lightgbm:", e)
    
    try:
        import shap
        print("✅ shap:", shap.__version__)
    except ImportError as e:
        print("❌ shap:", e)
    
    try:
        import prophet
        print("✅ prophet")
    except ImportError as e:
        print("❌ prophet:", e)
    
    try:
        import statsmodels
        print("✅ statsmodels:", statsmodels.__version__)
    except ImportError as e:
        print("❌ statsmodels:", e)
    
    try:
        import tqdm
        print("✅ tqdm:", tqdm.__version__)
    except ImportError as e:
        print("❌ tqdm:", e)
    
    print("\n🎉 IDE setup complete!")
    print("\n📝 Next steps:")
    print("1. Restart Cursor/VS Code")
    print("2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)")
    print("3. Type 'Python: Select Interpreter'")
    print(f"4. Select: {venv_python}")
    print("5. The import errors should disappear!")
    
    return True

if __name__ == "__main__":
    setup_ide()
