DROP TABLE IF EXISTS sounds;
CREATE TABLE sounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    key_mapping TEXT NOT NULL,  -- Keyboard key this sound maps to
    category TEXT NOT NULL,     -- e.g., 'piano', 'drums', 'effects'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);