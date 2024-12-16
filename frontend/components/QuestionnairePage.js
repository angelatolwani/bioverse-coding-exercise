import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchQuestions() {
      const response = await fetch(`http://localhost:3001/api/questionnaire/${id}/questions`);
      const data = await response.json();
      setQuestions(data);
    }
    if (id) fetchQuestions();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch('http://localhost:3001/api/submit-answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        questionnaireId: id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
      }),
    });
    if (response.ok) {
      router.push('/questionnaires');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <h1 className="text-2xl mb-4">Questionnaire</h1>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="block mb-2">{q.question_text}</label>
          <input
            type="text"
            value={answers[q.id] || ''}
            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}
