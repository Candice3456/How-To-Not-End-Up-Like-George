import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import rewards from '../../data/rewards';
import './Rewards.css';

export default function RewardsPage() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState('shop');
  const [justBought, setJustBought] = useState(null);
  const [confirmReward, setConfirmReward] = useState(null);

  function handleBuy(reward) {
    if (state.coins < reward.cost) return;

    dispatch({ type: 'SPEND_COINS', payload: reward.cost });
    const ticket = {
      id: 'ticket-' + Date.now(),
      rewardId: reward.id,
      name: reward.name,
      emoji: reward.emoji,
      category: reward.category,
      purchasedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TICKET', payload: ticket });
    setConfirmReward(null);
    setJustBought(reward.name);
    setTimeout(() => setJustBought(null), 2000);
  }

  function handleUse(ticketId) {
    dispatch({ type: 'USE_TICKET', payload: ticketId });
  }

  const categories = [...new Set(rewards.map((r) => r.category))];

  return (
    <div className="rewards-page">
      <h2>Rewards</h2>

      <div className="rewards-tabs">
        <button
          className={`tab-btn ${tab === 'shop' ? 'active' : ''}`}
          onClick={() => setTab('shop')}
        >
          Shop
        </button>
        <button
          className={`tab-btn ${tab === 'tickets' ? 'active' : ''}`}
          onClick={() => setTab('tickets')}
        >
          My Tickets ({state.ownedTickets.length})
        </button>
      </div>

      {justBought && (
        <div className="bought-banner">
          Purchased: {justBought}!
        </div>
      )}

      {/* Purchase confirmation modal */}
      {confirmReward && (
        <div className="modal-overlay" onClick={() => setConfirmReward(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="modal-emoji">{confirmReward.emoji}</span>
            <h3>Buy {confirmReward.name}?</h3>
            <p className="modal-cost">
              This will cost <span className="coin-icon">&#x1FA99;</span> {confirmReward.cost} coins
            </p>
            <p className="modal-balance">
              You'll have {state.coins - confirmReward.cost} coins left
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmReward(null)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => handleBuy(confirmReward)}>
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'shop' && (
        <div className="shop">
          {categories.map((cat) => (
            <div key={cat} className="reward-category">
              <h3 className="category-title">{cat}</h3>
              <div className="reward-grid">
                {rewards
                  .filter((r) => r.category === cat)
                  .map((reward) => {
                    const canAfford = state.coins >= reward.cost;
                    return (
                      <div key={reward.id} className={`reward-card ${!canAfford ? 'locked' : ''}`}>
                        <span className="reward-emoji">{reward.emoji}</span>
                        <span className="reward-name">{reward.name}</span>
                        <span className="reward-cost">
                          <span className="coin-icon">&#x1FA99;</span> {reward.cost}
                        </span>
                        <button
                          className="btn-primary small"
                          onClick={() => setConfirmReward(reward)}
                          disabled={!canAfford}
                        >
                          {canAfford ? 'Buy' : 'Need more coins'}
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tickets' && (
        <div className="tickets">
          {state.ownedTickets.length === 0 ? (
            <div className="empty-tickets">
              <p>No tickets yet. Complete tasks and quizzes to earn coins, then buy rewards!</p>
            </div>
          ) : (
            <div className="tickets-list">
              {state.ownedTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <span className="ticket-emoji">{ticket.emoji}</span>
                  <div className="ticket-info">
                    <span className="ticket-name">{ticket.name}</span>
                    <span className="ticket-date">
                      {new Date(ticket.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="btn-use"
                    onClick={() => handleUse(ticket.id)}
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
