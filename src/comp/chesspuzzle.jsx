import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import axios from 'axios';
import './chesspuzzle.css';

const ChessPuzzle = () => {
    const [puzzle, setPuzzle] = useState(null);
    const [game, setGame] = useState(new Chess());
    const [error, setError] = useState(null);
    const [moves, setMoves] = useState([]); // To store the moves made by the user and bot
    const [fen, setFen] = useState('');
    const [turn, setTurn] = useState('');
    const [lastFen, setLastFen] = useState(''); // Store the last valid position
    const [isSolved, setIsSolved] = useState(false); // Flag to check if the puzzle is solved

    useEffect(() => {
        if (!isLoggedIn()) {
            alert('You need to log in to access this page.');
            window.location.href = '/login'; // Redirect to login page
            return;
        }

        const storedPuzzle = localStorage.getItem('puzzle');
        const puzzleSolved = localStorage.getItem('puzzleSolved');

        if (storedPuzzle) {
            const parsedPuzzle = JSON.parse(storedPuzzle);
            setPuzzle(parsedPuzzle);
            const newGame = new Chess(parsedPuzzle.FEN);
            setGame(newGame);
            setFen(newGame.fen());
            setTurn(newGame.turn());
            setLastFen(newGame.fen()); // Initialize lastFen with the starting FEN
            setIsSolved(puzzleSolved === 'true'); // Set the solved state if it was solved
        } else {
            fetchPuzzle();
        }
    }, []);

    const fetchPuzzle = async () => {
        try {
            const response = await axios.get('/puzzles.json');
            const data = response.data;
            const randomPuzzle = data[Math.floor(Math.random() * data.length)];
            setPuzzle(randomPuzzle);
            const newGame = new Chess(randomPuzzle.FEN);
            setGame(newGame);
            setFen(newGame.fen());
            setTurn(newGame.turn());
            setLastFen(newGame.fen()); // Initialize lastFen with the starting FEN
            localStorage.setItem('puzzle', JSON.stringify(randomPuzzle));
            setIsSolved(false); // Reset the solved state
            localStorage.removeItem('puzzleSolved'); // Remove solved flag
        } catch (error) {
            setError(error.message);
        }
    };

    const handleRefresh = () => {
        localStorage.removeItem('puzzle');
        fetchPuzzle();
        setMoves([]); // Clear the moves list
    };

    const handleBotMove = () => {
        const possibleMoves = game.moves();
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            game.move(randomMove);
            setFen(game.fen());
            setTurn(game.turn());
            setMoves(prevMoves => [...prevMoves, { san: randomMove, player: 'bot' }]);
        }
    };

    const handleDrop = (sourceSquare, targetSquare) => {
        const sourcePiece = game.get(sourceSquare);

        if (!sourcePiece) {
            alert('No piece on the source square');
            return false;
        }

        const isPawnPromotion = sourcePiece.type === 'p' &&
            ((sourcePiece.color === 'w' && targetSquare[1] === '8') ||
             (sourcePiece.color === 'b' && targetSquare[1] === '1'));

        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: isPawnPromotion ? 'q' : undefined,
        });

        if (move === null) {
            alert('Illegal move');
            return false;
        }

        const currentMoveIndex = moves.filter(m => m.player === 'user').length;
        const expectedMove = puzzle.Moves[currentMoveIndex]?.trim();
        const madeMove = move.san.trim();

        console.log(`Expected move: ${expectedMove}, Made move: ${madeMove}`);

        if (expectedMove !== madeMove) {
            alert(`Incorrect Move: Your move ${madeMove} is incorrect. The correct move is ${expectedMove}.`);
            game.undo(); // Undo the incorrect move
            setFen(lastFen); // Reset to the last valid FEN
            setMoves(moves.slice(0, -1)); // Remove the last move from the list
            return false;
        } else {
            setLastFen(game.fen()); // Store the new valid position
            setMoves(prevMoves => [...prevMoves, { san: madeMove, player: 'user' }]);
            setFen(game.fen());
            setTurn(game.turn());

            if (moves.filter(m => m.player === 'user').length + 1 === puzzle.Moves.length) {
                alert('Puzzle solved!');
                setIsSolved(true);
                localStorage.setItem('puzzleSolved', 'true');
                return true;
            }

            setTimeout(() => {
                handleBotMove();
            }, 500);
        }

        return true;
    };

    const showSolution = async () => {
        if (!puzzle || !puzzle.Moves) {
            alert('No solution available for this puzzle.');
            return;
        }

        const solutionMoves = puzzle.Moves;

        for (let i = 0; i < solutionMoves.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const move = game.move(solutionMoves[i]);
            setFen(game.fen());
            setMoves(prevMoves => [...prevMoves, { san: move.san, player: 'bot' }]);
            setTurn(game.turn());
        }
    };

    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    if (!puzzle) {
        return <div className="loading-message">Loading...</div>;
    }

    return (
        <div className="chess-puzzle-container">
            <h1>Chess Puzzle</h1>
            <div className="puzzle-info">
                <p>Rating: {puzzle.Rating}</p>
                <p>Popularity: {puzzle.Popularity}</p>
                <p>Themes: {puzzle.Themes.join(', ')}</p>
                <p className="turn-info">Current turn: {turn === 'w' ? 'White' : 'Black'}</p>
            </div>
            <div className="content-container">
                <div className="move-list-container">
                    <h2>Moves</h2>
                    <ol>
                        {moves.map((move, index) => (
                            <li key={index} style={{ color: move.player === 'user' ? 'black' : 'red', backgroundColor: '#f0e68c' }}>
                                {move.player === 'user' ? 'User: ' : 'Bot: '} {move.san}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="chessboard-container">
                    <Chessboard
                        position={fen}
                        onPieceDrop={handleDrop}
                        boardWidth={600}
                    />
                </div>
            </div>
            <div className="button-container">
                
                <button className="refresh-puzzle-button" onClick={handleRefresh}>Refresh Puzzle</button>
            </div>
        </div>
    );
};

export default ChessPuzzle;
