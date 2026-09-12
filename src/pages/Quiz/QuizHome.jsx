import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import premadeLists from '../../data/premadeVocabLists';
import { todayKey } from '../../utils/storage';
import './Quiz.css';

export default function QuizHome() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [formName, setFormName] = useState('');
  const [formTerms, setFormTerms] = useState([{ term: '', definition: '' }]);

  const allLists = [...premadeLists, ...state.vocabLists];
  const claimedToday =
    state.quizRewards.date === todayKey() ? state.quizRewards.listIds : [];

  function resetForm() {
    setFormName('');
    setFormTerms([{ term: '', definition: '' }]);
    setShowCreate(false);
    setEditingList(null);
  }

  function addTerm() {
    setFormTerms([...formTerms, { term: '', definition: '' }]);
  }

  function updateTerm(index, field, value) {
    const updated = [...formTerms];
    updated[index] = { ...updated[index], [field]: value };
    setFormTerms(updated);
  }

  function removeTerm(index) {
    if (formTerms.length <= 1) return;
    setFormTerms(formTerms.filter((_, i) => i !== index));
  }

  function startEdit(list) {
    setEditingList(list.id);
    setFormName(list.name);
    setFormTerms(list.terms.map((t) => ({ ...t })));
    setShowCreate(false);
  }

  function startCreate() {
    setEditingList(null);
    setFormName('');
    setFormTerms([{ term: '', definition: '' }]);
    setShowCreate(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const validTerms = formTerms.filter((t) => t.term.trim() && t.definition.trim());
    if (!formName.trim() || validTerms.length === 0) return;

    if (editingList) {
      dispatch({
        type: 'UPDATE_VOCAB_LIST',
        payload: {
          id: editingList,
          name: formName.trim(),
          description: `${validTerms.length} terms`,
          isPremade: false,
          terms: validTerms,
        },
      });
    } else {
      dispatch({
        type: 'ADD_VOCAB_LIST',
        payload: {
          id: 'custom-' + Date.now(),
          name: formName.trim(),
          description: `${validTerms.length} terms`,
          isPremade: false,
          terms: validTerms,
        },
      });
    }
    resetForm();
  }

  function deleteList(id) {
    dispatch({ type: 'DELETE_VOCAB_LIST', payload: id });
    if (editingList === id) resetForm();
  }

  const showForm = showCreate || editingList;

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="quiz-home">
      <div className="welcome-banner">
        <p className="welcome-text">{greeting}, {state.profile?.name || 'friend'}!</p>
        <p className="welcome-sub">What do you want to study today?</p>
      </div>

      <div className="section-header">
        <h2>Vocab Lists</h2>
        {!showForm && (
          <button className="btn-primary small" onClick={startCreate}>
            + Create List
          </button>
        )}
        {showForm && (
          <button className="btn-secondary small" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      {showForm && (
        <form className="create-form" onSubmit={handleSave}>
          <h3 className="form-title">{editingList ? 'Edit List' : 'New List'}</h3>
          <input
            type="text"
            className="field-input"
            placeholder="List name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />

          {formTerms.map((t, i) => (
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
              {formTerms.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => removeTerm(i)}>
                  &times;
                </button>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={addTerm}>
              + Add Term
            </button>
            <button type="submit" className="btn-primary">
              {editingList ? 'Save Changes' : 'Create List'}
            </button>
          </div>
        </form>
      )}

      <div className="list-grid">
        {allLists.map((list) => (
          <div key={list.id} className="list-card">
            <div className="list-card-header">
              <h3>{list.name}</h3>
              {list.isPremade && <span className="badge">Built-in</span>}
              {claimedToday.includes(list.id) && (
                <span className="badge earned">Earned today</span>
              )}
            </div>
            <p className="list-desc">
              {list.terms.length} terms
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
                <>
                  <button className="btn-secondary small" onClick={() => startEdit(list)}>
                    Edit
                  </button>
                  <button className="btn-danger small" onClick={() => deleteList(list.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
