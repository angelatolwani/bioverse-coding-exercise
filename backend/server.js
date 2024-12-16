const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      res.json({ 
        success: true, 
        user: {
          id: result.rows[0].id,
          username: result.rows[0].username,
          isAdmin: result.rows[0].is_admin
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get questionnaires
app.get('/api/questionnaires', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM questionnaires');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get questions for a questionnaire
app.get('/api/questionnaire/:id/questions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.*, qq.priority 
      FROM questions q
      JOIN questionnaire_questions qq ON q.id = qq.question_id
      WHERE qq.questionnaire_id = $1
      ORDER BY qq.priority ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/submit-answers', async (req, res) => {
  const { userId, questionnaireId, answers } = req.body;
  try {
    for (const answer of answers) {
      await pool.query(
        'INSERT INTO user_answers (user_id, question_id, questionnaire_id, answer) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id, question_id, questionnaire_id) DO UPDATE SET answer = $4',
        [userId, answer.questionId, questionnaireId, answer.answer]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
