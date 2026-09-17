-- Schema for German Writing Trainer MVP

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(2) NOT NULL, -- 'A2', 'B1', 'B2', 'C1'
    type VARCHAR(50) NOT NULL, -- e.g., 'email', 'essay', 'forum'
    topic TEXT NOT NULL,
    instructions TEXT NOT NULL,
    required_points JSONB NOT NULL,
    target_word_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_text TEXT,
    image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'analyzing', 'completed', 'error'
    feedback_data JSONB,
    model_answer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
