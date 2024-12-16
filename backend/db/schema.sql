-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_answers;
DROP TABLE IF EXISTS questionnaire_questions;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS questionnaires;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Create questionnaires table (matches questionnaire_questionnaires.csv)
CREATE TABLE questionnaires (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create questions table (matches questionnaire_questions.csv)
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  options TEXT[]
);

-- Create junction table (matches questionnaire_junction.csv)
CREATE TABLE questionnaire_questions (
  id SERIAL PRIMARY KEY,
  questionnaire_id INTEGER REFERENCES questionnaires(id),
  question_id INTEGER REFERENCES questions(id),
  priority INTEGER NOT NULL,
  UNIQUE(questionnaire_id, question_id)
);

-- Create table for user answers
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  questionnaire_id INTEGER REFERENCES questionnaires(id),
  answer TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test users
INSERT INTO users (username, password, is_admin) VALUES
  ('admin', 'admin123', true),
  ('user', 'user123', false);