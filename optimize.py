import os
import re
import shutil
import ast

def remove_python_comments_and_docstrings(source):
    # Try to parse and unparse using ast (requires Python 3.9+)
    try:
        parsed = ast.parse(source)
        # Remove docstrings
        for node in ast.walk(parsed):
            if not isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.AsyncFunctionDef, ast.Module)):
                continue
            if not len(node.body):
                continue
            if not isinstance(node.body[0], ast.Expr):
                continue
            if not hasattr(node.body[0], 'value') or not isinstance(node.body[0].value, ast.Constant):
                continue
            if isinstance(node.body[0].value.value, str):
                node.body.pop(0)
        # unparse will remove comments and empty lines
        if hasattr(ast, "unparse"):
            return ast.unparse(parsed)
    except Exception as e:
        print(f"AST parsing failed, falling back to regex: {e}")
        pass

    # Fallback if unparse fails or not available
    source = re.sub(r'#.*', '', source)
    source = re.sub(r'\"\"\"[\s\S]*?\"\"\"', '', source)
    source = re.sub(r"\'\'\'[\s\S]*?\'\'\'", '', source)
    lines = [line for line in source.splitlines() if line.strip()]
    return '\n'.join(lines)

def remove_js_css_comments(source, ext):
    # Remove block comments /* */
    source = re.sub(r'/\*[\s\S]*?\*/', '', source)
    if ext in ['.js', '.jsx']:
        # Remove single line comments // but avoid matching http:// or https://
        source = re.sub(r'(?<!:)\/\/.*', '', source)
    if ext == '.html':
        # Remove HTML comments <!-- -->
        source = re.sub(r'<!--[\s\S]*?-->', '', source)
    
    # Remove empty lines and trailing spaces
    lines = [line.rstrip() for line in source.splitlines() if line.strip()]
    return '\n'.join(lines)

def process_directory(src_dir, dest_dir):
    exclude_dirs = {'node_modules', '.git', 'optimized_workspace'}
    exclude_files = {'package-lock.json', 'optimize.py'}
    exclude_exts = {'.png', '.svg', '.ico', '.jpg', '.jpeg', '.woff2', '.ttf', '.db', '.pyc'}

    for root, dirs, files in os.walk(src_dir):
        # Exclude directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        # Determine current relative path and corresponding destination
        rel_path = os.path.relpath(root, src_dir)
        dest_path = os.path.join(dest_dir, rel_path)
        
        os.makedirs(dest_path, exist_ok=True)
        
        for file in files:
            if file in exclude_files:
                continue
            
            ext = os.path.splitext(file)[1].lower()
            src_file = os.path.join(root, file)
            dst_file = os.path.join(dest_path, file)
            
            if ext in exclude_exts:
                # Copy binary files directly without processing
                shutil.copy2(src_file, dst_file)
                continue

            try:
                with open(src_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                if ext == '.py':
                    content = remove_python_comments_and_docstrings(content)
                elif ext in ['.js', '.jsx', '.css', '.html', '.json', '.md']:
                    content = remove_js_css_comments(content, ext)

                with open(dst_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Processed: {src_file} -> {dst_file}")
            except Exception as e:
                print(f"Error processing {src_file}, copying instead: {e}")
                shutil.copy2(src_file, dst_file)

if __name__ == '__main__':
    src = r"c:\Users\OWNER\Desktop\psh1"
    dest = r"c:\Users\OWNER\Desktop\psh1\optimized_workspace"
    print("Starting optimization...")
    process_directory(src, dest)
    print("Optimization complete.")
