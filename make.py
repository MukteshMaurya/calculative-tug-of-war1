import os

# Define the relative paths to be created
files_to_create = [
    "src/components/GameBoard/GameBoard.tsx",
    "src/types/game.ts",
    "src/App.tsx",
    "src/index.css",
    "src/main.tsx",
]

for file_path in files_to_create:
    # Ensure intermediate directories exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Create the file if it does not already exist
    if not os.path.exists(file_path):
        with open(file_path, "w", encoding="utf-8") as f:
            f.write("")
        print(f"Created: {file_path}")
    else:
        print(f"Skipped (already exists): {file_path}")