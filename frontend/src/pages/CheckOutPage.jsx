import React, { useState } from 'react';
import '../styles/CheckOutPage.css';

function OrderPage() {
  const rows = 3;
  const cols = 3;
  const tileSize = 100;

  const boardLeft = 0;
  const boardTop = 0;

  const [pieces, setPieces] = useState(() => {
    let arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const randomX = Math.random() * 200 - 50;
        const randomY = Math.random() * 200 - 50;
        arr.push({
          id: r * cols + c,
          correctTop: boardTop + r * tileSize,
          correctLeft: boardLeft + c * tileSize,
          top: boardTop + 50 + randomY,
          left: boardLeft + 50 + randomX,
          locked: false
        });
      }
    }
    return arr;
  });

  const [draggedId, setDraggedId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, id) => {
    const piece = pieces.find(p => p.id === id);
    setDraggedId(id);
    setOffset({ x: e.clientX - piece.left, y: e.clientY - piece.top });
  };

  const handleMouseMove = (e) => {
    if (draggedId === null) return;
    setPieces(pieces.map(p => {
      if (p.id === draggedId && !p.locked) {
        return { ...p, left: e.clientX - offset.x, top: e.clientY - offset.y };
      }
      return p;
    }));
  };

  const handleMouseUp = () => {
    if (draggedId === null) return;
    setPieces(pieces.map(p => {
      if (p.id === draggedId) {
        const pz = pieces.find(x => x.id === draggedId);

        const snapX = Math.round((pz.left - boardLeft) / tileSize) * tileSize + boardLeft;
        const snapY = Math.round((pz.top - boardTop) / tileSize) * tileSize + boardTop;

        const dx = Math.abs(pz.correctLeft - snapX);
        const dy = Math.abs(pz.correctTop - snapY);
        const snapThreshold = 30;

        if (dx + dy <= snapThreshold) {
          return { ...pz, left: pz.correctLeft, top: pz.correctTop, locked: true };
        }
      }
      return p;
    }));
    setDraggedId(null);
  };

  return (
    <div className="order-container">
      <h1>Foto-Puzlė</h1>
      <p>Drag-and-drop demo</p>

      <div
        className="board-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          position: 'relative',
          width: cols * tileSize,
          height: rows * tileSize,
          border: '2px solid #333',
          background: '#eee',
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {pieces.map(p => (
          <div
            key={p.id}
            className="puzzle-piece"
            style={{
              width: tileSize,
              height: tileSize,
              top: p.top,
              left: p.left,
              position: 'absolute',
              border: '2px solid #333',
              background: p.locked ? '#2ecc71' : '#3498db',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              userSelect: 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, p.id)}
          >
            {p.id + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderPage;