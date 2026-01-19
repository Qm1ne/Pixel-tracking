-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- pageview, scroll, click, submit
    page_url TEXT NOT NULL,
    referrer TEXT,
    source VARCHAR(100), -- inferred from referrer or utm
    campaign_id VARCHAR(100),
    session_id VARCHAR(100),
    anonymous_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}', -- Flexible storage for implementation-specific details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_anonymous_id ON events(anonymous_id);
CREATE INDEX idx_events_created_at ON events(created_at);
