import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import premadeLists from '../../data/premadeVocabLists';
import './Quiz.css';

export default function QuizHome() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTerms, setNewTerms] = useState([{ term: '', definition: '' }]);

  const allLists = [...premadeLists, ...state.vocabLists];

  function addTerm() {
    setNewTerms([...newTerms, { term: '', definition: '' }]);
  }

  function updateTerm(index, field, value) {
    const updated = [...newTerms];
    updated[index] = { ...updated[index], [field]: value };
    setNewTerms(updated);
  }

  function removeTerm(index) {
    if (newTerms.length <= 1) return;
    setNewTerms(newTerms.filter((_, i) => i !== index));
  }

  function handleCreate(e) {
    e.preventDefault();
    const validTerms = newTerms.filter((t) => t.term.trim() && t.definition.trim());
    if (!newName.trim() || validTerms.length === 0) return;

    const newList = {
      id: 'custom-' + Date.now(),
      name: newName.trim(),
      description: `${validTerms.length} terms`,
      isPremade: false,
      terms: validTerms,
    };

    dispatch({ type: 'ADD_VOCAB_LIST', payload: newList });
    setNewName('');
    setNewTerms([{ term: '', definition: '' }]);
    setShowCreate(false);
  }

  function deleteList(id) {
    dispatch({ type: 'DELETE_VOCAB_LIST', payload: id });
  }

  return (
    <div className="quiz-home">
      <div className="section-header">
        <h2>Vocab Lists</h2>
        <button className="btn-primary small" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : '+ Create List'}
        </button>
      </div>

      {showCreate && (
        <form className="create-form" onSubmit={handleCreate}>
          <input
            type="text"
            className="field-input"
            placeholder="List name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          {newTerms.map((t, i) => (
            <div key={i} className="term-row">
              <input
                type="text"
                className="field-input half"
                placeholder="Term"
                value={t.term}
                onChange={(e) => updateTerm(i, 'term', e.target.value)}
              />
              <input
                type="text"
                className="field-input half"
                placeholder="Definition"
                value={t.definition}
                onChange={(e) => updateTerm(i, 'definition', e.target.value)}
              />
              {newTerms.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeTerm(i)}>
                  &times;
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-secondary" onClick={addTerm}>
            + Add Term
          </button>
          <button type="submit" className="btn-primary">
            Save List
          </button>
        </form>
      )}

      <div className="list-grid">
        {allLists.map((list) => (
          <div key={list.id} className="list-card">
            <div className="list-card-header">
              <h3>{list.name}</h3>
              {list.isPremade && <span className="badge">Built-in</span>}
            </div>
            <p className="list-desc">
              {list.description || `${list.terms.length} terms`}
            </p>
            <div className="list-card-actions">
              <button
                className="btn-primary small"
                onClick={() => navigate(`/quiz/flashcards/${list.id}`)}
              >
                Flashcards
              </button>
              <button
                className="btn-secondary small"
                onClick={() => navigate(`/quiz/multiple-choice/${list.id}`)}
              >
                Quiz
              </button>
              {!list.isPremade && (
                <button className="btn-danger small" onClick={() => deleteList(list.id)}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
