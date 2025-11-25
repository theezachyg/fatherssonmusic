-- Form Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    form_type TEXT NOT NULL,
    additional_info TEXT,
    status TEXT DEFAULT 'new'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_type ON submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_email ON submissions(email);
