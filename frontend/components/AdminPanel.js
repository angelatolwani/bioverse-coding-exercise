import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`);
      const data = await response.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleUserClick = async (userId) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${userId}/answers`);
    const data = await response.json();
    setSelectedUser(userId);
    setUserAnswers(data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Admin Panel</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            <button
              onClick={() => handleUserClick(user.id)}
              className="text-blue-500 hover:underline"
            >
              {user.username}
            </button>
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div className="mt-8">
          <h2 className="text-xl mb-4">User Answers</h2>
          <ul>
            {userAnswers.map((answer) => (
              <li key={answer.id}>
                <strong>Q:</strong> {answer.question_text} <strong>A:</strong> {answer.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
