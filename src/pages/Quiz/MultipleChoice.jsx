import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import premadeLists from '../../data/premadeVocabLists';
import './Quiz.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MultipleChoice() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const list = useMemo(() => {
    return [...premadeLists, ...state.vocabLists].find((l) => l.id === listId);
  }, [listId, state.vocabLists]);

  const questions = useMemo(() => {
    if (!list) return [];
    return list.terms.map((term) => {
      const wrongAnswers = shuffle(
        list.terms.filter((t) => t.definition !== term.definition)
      ).slice(0, 3);
      const options = shuffle([
        { text: term.definition, correct: true },
        ...wrongAnswers.map((w) => ({ text: w.definition, correct: false })),
      ]);
      return { term: term.term, correctAnswer: term.definition, options };
    });
  }, [list]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!list) {
    return (
      <div className="quiz-message">
        <p>List not found.</p>
        <button className="btn-primary" onClick={() => navigate('/quiz')}>Back</button>
      </div>
    );
  }

  function handleSelect(option, index) {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    if (option.correct) {
      setScore(score + 1);
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const coinsEarned = Math.round((score / questions.length) * 30);
      if (coinsEarned > 0) {
        dispatch({ type: 'ADD_COINS', payload: coinsEarned });
      }
      setFinished(true);
    }
  }

  if (finished) {
    const coinsEarned = Math.round((score / questions.length) * 30);
    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <div className="results-score">
          <span className="score-big">{score}/{questions.length}</span>
          <span className="score-label">correct</span>
        </div>
        {coinsEarned > 0 && (
          <p className="coins-earned">+ {coinsEarned} coins earned!</p>
        )}
        <div className="results-actions">
          <button className="btn-primary" onClick={() => navigate('/quiz')}>
            Back to Lists
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              setCurrentQ(0);
              setSelected(null);
              setAnswered(false);
              setScore(0);
              setFinished(false);
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="multiple-choice">
      <div className="flashcard-header">
        <button className="btn-back" onClick={() => navigate('/quiz')}>&larr; Back</button>
        <h2>{list.name}</h2>
        <span className="progress-text">{currentQ + 1} / {questions.length}</span>
      </div>

      <div className="question-card">
        <p className="question-prompt">What is the definition of:</p>
        <h3 className="question-term">{q.term}</h3>

        <div className="options-list">
          {q.options.map((opt, i) => {
            let className = 'option-btn';
            if (answered && i === selected) {
              className += opt.correct ? ' correct' : ' wrong';
            } else if (answered && opt.correct) {
              className += ' correct';
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => handleSelect(opt, i)}
              >
                {opt.text}
              </button>
            );
          })}
        </div>

        {answered && (
          <button className="btn-primary" onClick={handleNext}>
            {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
