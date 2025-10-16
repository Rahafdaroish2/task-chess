import React from "react";
import ChessBoard from "/src/componantsChess/ChessBoard.jsx"; 
import "/src/componantsChess/ChessBoard.css";
 function App() {
   return (
     <div className="app-container">
       <div className="app-inner">
         <h1 className="title">Chess Game</h1>
         <ChessBoard />
       </div>
     </div>
   );
 }
export default App;