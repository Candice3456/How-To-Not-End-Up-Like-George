import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { todayKey } from '../../utils/storage';
import { GeorgePopup } from '../../components/GeorgeRoast';
import { georgePhotos, quizZeroRoasts, quizZeroQuestion, quizRoastTiers, quizTierFor } from '../../data/georgeRoasts';
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

  // Bumped on "Try Again" so the questions and options reshuffle for a new round.
  const [round, setRound] = useState(0);

  const questions = useMemo(() => {
    if (!list) return [];
    // Dedupe definitions so a list with repeated definitions can't offer two
    // options that are both really correct.
    const allDefs = [...new Set(list.terms.map((t) => t.definition))];
    return shuffle(list.terms).map((term) => {
      const wrongAnswers = shuffle(
        allDefs.filter((d) => d !== term.definition)
      ).slice(0, 3);
      const options = shuffle([
        { text: term.definition, correct: true },
        ...wrongAnswers.map((d) => ({ text: d, correct: false })),
      ]);
      return { term: term.term, correctAnswer: term.definition, options };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, round]);

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  // Whether this round actually paid out (false on same-day replays).
  const [rewarded, setRewarded] = useState(false);
  const [showZeroRoast, setShowZeroRoast] = useState(false);
  // Graded roast for weak-but-nonzero scores: { tier, line } or null.
  const [gradedRoast, setGradedRoast] = useState(null);

  const alreadyClaimedToday =
    state.quizRewards.date === todayKey() &&
    state.quizRewards.listIds.includes(listId);

  if (!list || list.terms.length === 0) {
    return (
      <div className="quiz-message">
        <p>{list ? 'This list has no terms yet.' : 'List not found.'}</p>
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
      // Coins are awarded once per list per day — replays are free practice,
      // so nobody can farm a 10-question list into unlimited gaming time.
      const coinsEarned = Math.round((score / questions.length) * 30);
      if (coinsEarned > 0 && !alreadyClaimedToday) {
        dispatch({ type: 'ADD_COINS', payload: coinsEarned });
        dispatch({ type: 'CLAIM_QUIZ_REWARD', payload: listId });
        setRewarded(true);
      } else {
        setRewarded(false);
      }
      // A flat zero earns a visit from George; weak scores get a graded one.
      if (score === 0) {
        setShowZeroRoast(true);
      } else {
        const tier = quizTierFor(score, questions.length);
        if (tier) {
          const lines = quizRoastTiers[tier].lines;
          const line = lines[Math.floor(Math.random() * lines.length)]
            .replaceAll('{score}', score)
            .replaceAll('{total}', questions.length);
          setGradedRoast({ tier, line });
        }
      }
      setFinished(true);
    }
  }

  if (finished) {
    const coinsEarned = Math.round((score / questions.length) * 30);
    return (
      <div className="quiz-results">
        {showZeroRoast && (
          <GeorgePopup
            roast={quizZeroRoasts[Math.floor(Math.random() * quizZeroRoasts.length)].replace('{total}', questions.length)}
            photo={georgePhotos.length ? georgePhotos[Math.floor(Math.random() * georgePhotos.length)] : null}
            question={quizZeroQuestion}
            closeLabel="...no. Let me try again."
            onClose={() => setShowZeroRoast(false)}
          />
        )}
        {gradedRoast && (
          <GeorgePopup
            roast={gradedRoast.line}
            photo={georgePhotos.length ? georgePhotos[Math.floor(Math.random() * georgePhotos.length)] : null}
            question={quizRoastTiers[gradedRoast.tier].question}
            closeLabel={quizRoastTiers[gradedRoast.tier].closeLabel}
            onClose={() => setGradedRoast(null)}
          />
        )}
        <h2>{score === 0 ? 'Oof.' : 'Quiz Complete!'}</h2>
        <div className="results-score">
          <span className="score-big">{score}/{questions.length}</span>
          <span className="score-label">correct</span>
        </div>
        {rewarded ? (
          <p className="coins-earned">+ {coinsEarned} coins earned!</p>
        ) : (
          <p className="coins-note">
            {coinsEarned === 0
              ? 'Zero coins. Zero. George is proud of you, and that should worry you.'
              : 'Practice round — you already earned coins for this list today. Come back tomorrow for more!'}
          </p>
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
              setRewarded(false);
              setShowZeroRoast(false);
              setGradedRoast(null);
              setRound(round + 1);
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
