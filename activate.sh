#!/bin/bash
# NASA Space Apps 2025 - Project Activation Script

echo "🚀 NASA Space Apps 2025 - Air Quality Forecasting System"
echo "========================================================"

# Check if we're in the right directory
if [ ! -f "requirements_complete.txt" ]; then
    echo "❌ Error: Please run this script from the NASA_Space_Apps_2025 directory"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check Python version
echo "🐍 Python version: $(python --version)"
echo "📍 Python path: $(which python)"

# Test key imports
echo "🧪 Testing key package imports..."
python -c "
import sys
print('Python executable:', sys.executable)

# Test critical imports
try:
    import pandas as pd
    print('✅ pandas:', pd.__version__)
except ImportError as e:
    print('❌ pandas:', e)

try:
    import matplotlib.pyplot as plt
    print('✅ matplotlib')
except ImportError as e:
    print('❌ matplotlib:', e)

try:
    import seaborn as sns
    print('✅ seaborn')
except ImportError as e:
    print('❌ seaborn:', e)

try:
    import scipy
    print('✅ scipy:', scipy.__version__)
except ImportError as e:
    print('❌ scipy:', e)

try:
    import sklearn
    print('✅ sklearn:', sklearn.__version__)
except ImportError as e:
    print('❌ sklearn:', e)

try:
    import xgboost as xgb
    print('✅ xgboost:', xgb.__version__)
except ImportError as e:
    print('❌ xgboost:', e)

try:
    import lightgbm as lgb
    print('✅ lightgbm:', lgb.__version__)
except ImportError as e:
    print('❌ lightgbm:', e)

try:
    import shap
    print('✅ shap:', shap.__version__)
except ImportError as e:
    print('❌ shap:', e)

try:
    import prophet
    print('✅ prophet')
except ImportError as e:
    print('❌ prophet:', e)

try:
    import statsmodels
    print('✅ statsmodels:', statsmodels.__version__)
except ImportError as e:
    print('❌ statsmodels:', e)

try:
    import tqdm
    print('✅ tqdm:', tqdm.__version__)
except ImportError as e:
    print('❌ tqdm:', e)
"

echo ""
echo "🎉 Environment ready!"
echo ""
echo "📝 Available scripts:"
echo "  • python comprehensive_data_integration.py"
echo "  • python forecasting_system.py"
echo "  • python advanced_validation.py"
echo "  • python scientific_validation.py"
echo ""
echo "💡 IDE Setup:"
echo "  1. Restart Cursor/VS Code"
echo "  2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)"
echo "  3. Type 'Python: Select Interpreter'"
echo "  4. Select: $(pwd)/venv/bin/python"
echo "  5. The import errors should disappear!"
echo ""
echo "🔧 To deactivate: deactivate"
