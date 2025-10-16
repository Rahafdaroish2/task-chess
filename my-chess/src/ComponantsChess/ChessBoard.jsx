import React, { useState, useMemo, useEffect } from "react";
import "/src/componantsChess/ChessBoard.css";

export default function ChessBoard() {
  const SIZE = 8;
  const [queens, setQueens] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 2500);
    return () => clearTimeout(t);
  }, [message]);

  function attacks(r1, c1, r2, c2) {
    return r1 === r2 || c1 === c2 || Math.abs(r1 - r2) === Math.abs(c1 - c2);
  }

  function isAttackedByAny(r, c, skipIndex = -1) {
    return queens.some((q, i) => {
      if (i === skipIndex) return false;
      return attacks(q.r, q.c, r, c);
    });
  }

  const highlighted = useMemo(() => {
    if (selected == null) return new Set();
    const q = queens[selected];
    if (!q) return new Set();
    const s = new Set();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (r === q.r && c === q.c) continue;
        if (attacks(q.r, q.c, r, c)) s.add(`${r}-${c}`);
      }
    }
    return s;
  }, [selected, queens]);

  function onSquareClick(r, c) {
    const idx = queens.findIndex((q) => q.r === r && q.c === c);

    // 1) If clicked an existing queen -> toggle selection
    if (idx >= 0) {
      setSelected(selected === idx ? null : idx);
      return;
    }

    // 2) If there's a selected queen, treat this click as MOVE of that queen
    if (selected != null) {
      if (isAttackedByAny(r, c, selected)) {
        setMessage(
          "Forbidden: This square is under attack — you may not move the minister here."
        );
        return;
      }
      setQueens((prev) => prev.map((q, i) => (i === selected ? { r, c } : q)));
      setSelected(null);
      return;
    }

    // 3) Otherwise: placing a new queen
    if (queens.length >= 8) {
      setMessage("I can't have more than 8 ministers.");
      return;
    }
    if (isAttackedByAny(r, c)) {
      setMessage(
        "Forbidden: This square is under attack - you may not place a minister here"
      );
      return;
    }
    setQueens([...queens, { r, c }]);
    setSelected(null);
  }

  function onRemoveQueen(idx) {
    setQueens((prev) => prev.filter((_, i) => i !== idx));
    setSelected(null);
  }

  function resetBoard() {
    setQueens([]);
    setSelected(null);
  }

  function fillSampleSolution() {
    const cols = [0, 4, 7, 5, 2, 6, 1, 3];
    setQueens(cols.map((c, r) => ({ r, c })));
    setSelected(null);
  }

  return (
    <div className="chess-container">
      {/* control buttons stay above the board */}
      <div className="controls">
        <button onClick={resetBoard}>Empty the board</button>
        <button onClick={fillSampleSolution}>
          Fill in dissolving 8 ministers
        </button>
      </div>

      <div className="board">
        {Array.from({ length: SIZE }).map((_, r) => (
          <div key={r} className="row">
            {Array.from({ length: SIZE }).map((__, c) => {
              const isDark = (r + c) % 2 === 1;
              const queenIndex = queens.findIndex(
                (q) => q.r === r && q.c === c
              );
              const key = `${r}-${c}`;
              const isHighlighted = highlighted.has(key);

              return (
                <div
                  key={key}
                  onClick={() => onSquareClick(r, c)}
                  className={`square ${isDark ? "dark" : "light"} ${
                    isHighlighted ? "highlight" : ""
                  }`}
                >
                  {queenIndex >= 0 && (
                    <div className="queen">
                      <span className="queen-symbol">♛</span>

                      {/* action buttons with clearer labels; appear ABOVE the square now */}
                      <div
                        className="actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(
                              selected === queenIndex ? null : queenIndex
                            );
                          }}
                        >
                          Show moves
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveQueen(queenIndex);
                          }}
                        >
                          Delete the minister
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="status">Ministers in the painting: {queens.length} / 8</p>
      {message && <div className="message">{message}</div>}
    </div>
  );
}
