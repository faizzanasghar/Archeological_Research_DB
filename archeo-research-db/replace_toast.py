import os
import re

directory = r"c:\Users\User1\Downloads\Archeological_Research_DB-main\Archeological_Research_DB-main\archeo-research-db\src\pages"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "const [toast, setToast] = useState(null);" not in content:
        return
        
    print(f"Updating {filepath}")
    
    # Remove toast state
    content = re.sub(r"\s*const \[toast, setToast\] = useState\(null\);", "", content)
    
    # Remove showToast function
    content = re.sub(r"\s*const showToast = \([^)]*\) => \{\s*setToast\([^)]*\);\s*setTimeout\([^)]*\);\s*\};\s*", "\n", content)
    
    # Add import
    if "react-hot-toast" not in content:
        content = re.sub(r"(import .*? from 'lucide-react';)", r"\1\nimport toast from 'react-hot-toast';", content)
        if "react-hot-toast" not in content:
            content = "import toast from 'react-hot-toast';\n" + content
    
    # Replace showToast calls with toast.success
    # Since error handling is mostly caught by axios now, we just replace showToast('...', 'error') with console.error or let axios handle it
    content = re.sub(r"showToast\('([^']+)',\s*'error'\)", r"console.error('\1')", content)
    content = re.sub(r"showToast\(([^,]+),\s*'error'\)", r"console.error(\1)", content)
    
    # Replace showToast('...') with toast.success('...')
    content = re.sub(r"showToast\(([^)]+)\)", r"toast.success(\1)", content)
    
    # Remove AnimatePresence toast block
    toast_block = r"\{\/\* Toast \*\/\}\s*<AnimatePresence>\s*\{toast && \(\s*<motion\.div[^>]+>.*?</motion\.div>\s*\)\}\s*</AnimatePresence>"
    content = re.sub(toast_block, "", content, flags=re.DOTALL)
    
    # Alternate toast block format without comment
    toast_block2 = r"<AnimatePresence>\s*\{toast && \(\s*<motion\.div[^>]+>.*?</motion\.div>\s*\)\}\s*</AnimatePresence>"
    content = re.sub(toast_block2, "", content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        process_file(os.path.join(directory, filename))
