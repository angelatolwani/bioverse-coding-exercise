"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function QuestionnaireSelection() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchQuestionnaires() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questionnaires`);
      const data = await response.json();
      setQuestionnaires(data);
    }
    fetchQuestionnaires();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Select a Questionnaire</h1>
      <ul>
        {questionnaires.map((q) => (
          <li key={q.id} className="mb-2">
            <button
              onClick={() => router.push(`/questionnaire/${q.id}`)}
              className="text-blue-500 hover:underline"
            >
              {q.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
