import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import premadeLists from '../../data/premadeVocabLists';
import './Quiz.css';

export default function FlashcardMode() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();

  const list = useMemo(() => {
    return [...premadeLists, ...state.vocabLists].find((l) => l.id === listId);
  }, [listId, state.vocabLists]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!list || list.terms.length === 0) {
    return (
      <div className="quiz-message">
        <p>{list ? 'This list has no terms yet.' : 'List not found.'}</p>
        <button className="btn-primary" onClick={() => navigate('/quiz')}>Back</button>
      </div>
    );
  }

  const term = list.terms[currentIndex];
  const total = list.terms.length;

  function next() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  }

  function prev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  }

  return (
    <div className="flashcard-mode">
      <div className="flashcard-header">
        <button className="btn-back" onClick={() => navigate('/quiz')}>&larr; Back</button>
        <h2>{list.name}</h2>
        <span className="progress-text">{currentIndex + 1} / {total}</span>
      </div>

      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="flashcard-label">Term</span>
            <p className="flashcard-text">{term.term}</p>
            <span className="flashcard-hint">Tap to flip</span>
          </div>
          <div className="flashcard-back">
            <span className="flashcard-label">Definition</span>
            <p className="flashcard-text">{term.definition}</p>
            <span className="flashcard-hint">Tap to flip</span>
          </div>
        </div>
      </div>

      <div className="flashcard-controls">
        <button className="btn-secondary" onClick={prev} disabled={currentIndex === 0}>
          &larr; Prev
        </button>
        {currentIndex === total - 1 ? (
          <button className="btn-primary" onClick={() => navigate('/quiz')}>
            Done!
          </button>
        ) : (
          <button className="btn-primary" onClick={next}>
            Next &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
