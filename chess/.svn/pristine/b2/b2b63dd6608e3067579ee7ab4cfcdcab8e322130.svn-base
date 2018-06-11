package Game;

import Board.Implementation.ChessBoard;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;
import Util.Score;

import java.util.ArrayList;


/**
 * Main game loop for the chess application
 *
 * @author Taccio Yamamoto
 */
public class ChessGame {

    private User user0;
    private User user1;
    private ArrayList<Piece> user0InitialPieceConfig;
    private ArrayList<Piece> user1InitialPieceConfig;
    private ChessBoard board;
    private int[] boardLimit;
    private int currentTurn = 0;
    private int userTurn = 0;
    private Score score;

    /**
     * Default constructor with default chess configuration
     *
     * @throws Exception
     */
    public ChessGame() throws Exception {
        this.score = new Score();
        this.boardLimit = new int[]{8, 8};
        this.user0 = new User(0);
        this.user1 = new User(1);
        this.board = new ChessBoard(user0.getLivePieceArray(), boardLimit);
        this.board.setPiece(user1.getLivePieceArray());
    }

    /**
     * Constructor to create custom games
     *
     * @param boardLimit
     * @param user0LivePieces
     * @param user0DeadPieces
     * @param user1LivePieces
     * @param user1DeadPieces
     * @throws Exception
     */
    public ChessGame(int[] boardLimit, ArrayList<Piece> user0LivePieces, ArrayList<Piece> user0DeadPieces,
                     ArrayList<Piece> user1LivePieces, ArrayList<Piece> user1DeadPieces) throws Exception {
        this.boardLimit = boardLimit.clone();
        user0 = new User(0, this.boardLimit, user0LivePieces, user0DeadPieces);
        user1 = new User(1, this.boardLimit, user1LivePieces, user1DeadPieces);
        board = new ChessBoard(user0.getLivePieceArray(), boardLimit);
        board.setPiece(user1.getLivePieceArray());
    }

    /**
     * Initializes game back to its original state
     *
     * @throws Exception throws possible Exception from User.reset()
     */
    public void resetGame() throws Exception {
        user0.reset();
        user1.reset();
        board.emptyBoard();
        board.setPiece(user0.getLivePieceArray());
        board.setPiece(user1.getLivePieceArray());
        this.currentTurn = 0;
        this.userTurn = 0;
    }

    /**
     * @return An ArrayList containing all of the white pieces
     */
    public ArrayList<Piece> getWhitePieces() {
        return user0.getLivePieces();
    }

    /**
     * @return An ArrayList containing all of the black pieces
     */
    public ArrayList<Piece> getBlackPieces() {
        return user1.getLivePieces();
    }

    /**
     * @return An array representation of the boundaries of the board
     */
    public int[] getBoardLimit() {
        return this.board.getLimit();
    }

    /**
     * Moves piece at the currentPosition to the targetPosition
     *
     * @param currentPosition origin to move from
     * @param targetPosition  target position to move to
     * @return true if the piece has moved succesfully
     * @throws Exception throws possible Exception from ChessBoard.Move()
     */
    public boolean move(Position currentPosition, Position targetPosition) throws Exception {
        // moving out of turn
        Piece currentPiece = this.board.getPiece(currentPosition);
        if (currentPiece == null) {
            return false;
        }
        if (currentPiece.getUserId() != this.currentTurn % 2) {
            return false;
        }
        User currentUser = getUserFromTurn();
        User opponentUser = getOpponentFromTurn();
        if (currentPiece.getPieceType() != PieceType.KING) {
            boolean isInCheck = this.board.check(currentUser.getKing().getPosition(), opponentUser.getLivePieces());
            this.board.removePiece(currentPosition);
            if (!isInCheck && this.board.check(currentUser.getKing().getPosition(), opponentUser.getLivePieces())) {
                this.board.setPiece(currentPiece);
                return false;
            }
            this.board.setPiece(currentPiece);
        } else {
            boolean targetPositionIsInCheck = this.board.check(targetPosition, opponentUser.getLivePieces());
            if (targetPositionIsInCheck) {
                return false;
            }
        }
        Piece targetPiece = this.board.move(currentPiece, targetPosition);
        opponentUser.killPiece(targetPiece);
        return true;
    }

    /**
     * @return true if the current user is in check
     */
    public boolean isInCheck() throws Exception {
        User currentUser = getUserFromTurn();
        User opponentUser = getOpponentFromTurn();
        return this.board.check(currentUser.getKing().getPosition(), opponentUser.getLivePieces());
    }

    /**
     * @return returns true if the current user is in checkmate
     * @throws Exception
     */
    public boolean isInCheckMate() throws Exception {
        User currentUser = getUserFromTurn();
        User opponentUser = getOpponentFromTurn();
        return this.board.checkMate(currentUser.getKing(), opponentUser.getLivePieces());
    }

    /**
     * @return the user able to move at current turn
     */
    public User getUserFromTurn() {
        if (this.currentTurn % 2 == 0) {
            return this.user0;
        }
        return this.user1;
    }

    /**
     * Current user forfeit game
     *
     * @return the name of the winner
     */
    public String userForfeit() {
        if (this.currentTurn % 2 == 0) {
            this.score.user1Win();
        } else {
            this.score.user0Win();
        }
        return this.getUserStringFromTurn();
    }

    /**
     * @return the name of the player able to move at the current turn
     */
    public String getUserStringFromTurn() {
        if (this.currentTurn % 2 == 0) {
            return "Black";
        }
        return "White";
    }

    /**
     * @return the name of the opponent at the current turn
     */
    public String getOpponentStringFromTurn() {
        if (this.currentTurn % 2 == 0) {
            return new String("White");
        }
        return new String("Black");
    }

    /**
     * @return the opponent at the current turn
     */
    public User getOpponentFromTurn() {
        if (this.currentTurn % 2 == 0) {
            return this.user1;
        }
        return this.user0;
    }

    /**
     * Increments the current turn
     */
    public void nextTurn() {
        this.currentTurn++;
    }

    /**
     * @return the ChessBoard object
     */
    public ChessBoard getBoard() {
        return this.board;
    }

    /**
     * @return the current turn
     */
    public int getTurn() {
        return this.currentTurn;
    }

    /**
     * @return String representation of the score
     */
    public String getScore() {
        return this.score.getScoreString();
    }

    /**
     * Increment the score for the winner
     *
     * @param userId Increment the player with the userId
     */
    public void win(int userId) {
        if (userId == 0) {
            this.score.user0Win();
        } else {
            this.score.user1Win();
        }
    }
}
