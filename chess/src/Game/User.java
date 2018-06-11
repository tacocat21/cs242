package Game;

import Piece.Implementation.*;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;

import java.util.ArrayList;


/**
 * Class to represent the players in the chess application
 */
public class User {
    private ArrayList<Piece> livePiecesList;
    private ArrayList<Piece> deadPiecesList;
    private ArrayList<Piece> initialLivePiecesList;
    private ArrayList<Piece> initialDeadPiecesList;
    private King king;
    int userId;
    int[] boardLimit;

    /**
     * Constructor
     *
     * @param userId - unique user identification for the user
     * @throws Exception throws possible Exceptions from
     */
    public User(int userId) throws Exception {
        this.userId = userId;
        this.boardLimit = new int[]{8, 8};
        this.livePiecesList = new ArrayList<Piece>(17);
        this.deadPiecesList = new ArrayList<Piece>(17);
        if (userId == 0) {
            initializeWhite();
        } else {
            initializeBlack();
        }

        this.initialLivePiecesList = new ArrayList<Piece>(this.livePiecesList);
        this.initialDeadPiecesList = new ArrayList<Piece>(this.deadPiecesList);
    }

    /**
     * Constructor
     *
     * @param userId     - unique user identification for the user
     * @param boardLimit - board limit the pieces are constrained to
     * @param livePieces - ArrayList of live pieces the user owns
     * @param deadPieces - ArrayList of dead pieces the user owns
     * @throws Exception throws possible Exceptions from
     */
    public User(int userId, int[] boardLimit, ArrayList<Piece> livePieces, ArrayList<Piece> deadPieces) throws Exception {
        this.userId = userId;
        this.boardLimit = boardLimit.clone();
        this.livePiecesList = new ArrayList<Piece>(livePieces);
        this.deadPiecesList = new ArrayList<Piece>(deadPieces);
        this.initialLivePiecesList = new ArrayList<Piece>(this.livePiecesList);
        this.initialDeadPiecesList = new ArrayList<Piece>(this.deadPiecesList);
        this.king = null;
        for (Piece piece : this.initialDeadPiecesList) {
            if (piece.getPieceType() == PieceType.KING) {
                this.king = (King) piece;
                break;
            }
        }
        if (this.king == null) {
            throw new Exception("No king piece found in livePiecesList");
        }
    }

    /**
     * Resets the user to the initial state
     */
    public void reset() throws Exception {
        this.livePiecesList = new ArrayList<Piece>(17);
        this.deadPiecesList = new ArrayList<Piece>(17);
        if (userId == 0) {
            initializeWhite();
        } else {
            initializeBlack();
        }
    }

    /**
     * Moves piece from livePiecesList to deadPiecesList
     *
     * @param piece piece to move to deadPiecesList
     * @return true if moves piece from livePiecesList to deadPiecesList successfully
     */
    public boolean killPiece(Piece piece) {
        if (piece == null) {
            return false;
        }
        int objIndex = this.livePiecesList.indexOf(piece);
        if (objIndex != -1) {
            Piece removedPiece = this.livePiecesList.remove(objIndex);
            this.deadPiecesList.add(removedPiece);
            return true;
        }
        return false;
    }

    /**
     * Moves piece from deadPiecesList to livePiecesList
     *
     * @param piece piece to move to livePiecesList
     * @return true if moves piece from deadPiecesList to livePiecesList successfully
     */
    public boolean revivePiece(Piece piece) {
        if (piece == null) {
            return false;
        }
        int objIndex = this.deadPiecesList.indexOf(piece);
        if (objIndex != -1) {
            Piece removedPiece = this.deadPiecesList.remove(objIndex);
            this.livePiecesList.add(removedPiece);
            return true;
        }
        return false;
    }

    /**
     * @return the king piece of the user
     */
    public King getKing() {
        return this.king;
    }

    /**
     * Gets the ArrayList of the live pieces
     *
     * @return the ArrayList of live pieces
     */
    public ArrayList<Piece> getLivePieces() {
        return this.livePiecesList;
    }

    /**
     * Gets the ArrayList of the dead pieces
     *
     * @return the ArrayList of dead pieces
     */
    public ArrayList<Piece> getDeadPieces() {
        return this.deadPiecesList;
    }

    /**
     * @return the array representation of the live pieces
     */
    public Piece[] getLivePieceArray() {
        return this.livePiecesList.toArray(new Piece[this.livePiecesList.size()]);
    }

    /**
     * @return the array representation of the dead pieces
     */
    public Piece[] getDeadPieceArray() {
        return this.deadPiecesList.toArray(new Piece[this.deadPiecesList.size()]);
    }

    /**
     * Helper function to initialize the standard chess white pieces
     *
     * @throws Exception throws Exception from the Position object
     */
    private void initializeBlack() throws Exception {
        int lastRow = this.boardLimit[1] - 1;
        int pieceId;
        for (pieceId = 0; pieceId < this.boardLimit[1]; pieceId++) {
            livePiecesList.add(new Pawn(new Position(this.boardLimit, new int[]{pieceId, lastRow - 1}), this.userId, pieceId));
        }
        livePiecesList.add(new Rook(new Position(this.boardLimit, new int[]{0, lastRow}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Knight(new Position(this.boardLimit, new int[]{1, lastRow}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Bishop(new Position(this.boardLimit, new int[]{2, lastRow}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Queen(new Position(this.boardLimit, new int[]{3, lastRow}), this.userId, pieceId));
        pieceId++;
        this.king = new King(new Position(this.boardLimit, new int[]{4, lastRow}), this.userId, pieceId);
        livePiecesList.add(this.king);
        pieceId++;
        livePiecesList.add(new Bishop(new Position(this.boardLimit, new int[]{5, lastRow}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Knight(new Position(this.boardLimit, new int[]{6, lastRow}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Rook(new Position(this.boardLimit, new int[]{7, lastRow}), this.userId, pieceId));
        pieceId++;
    }

    /**
     * Helper function to initialize the standard chess white pieces
     *
     * @throws Exception throws Exception from the Position object
     */
    private void initializeWhite() throws Exception {
        int pieceId;
        for (pieceId = 0; pieceId < this.boardLimit[1]; pieceId++) {
            livePiecesList.add(new Pawn(new Position(this.boardLimit, new int[]{pieceId, 1}), this.userId, pieceId));
        }
        livePiecesList.add(new Rook(new Position(this.boardLimit, new int[]{0, 0}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Knight(new Position(this.boardLimit, new int[]{1, 0}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Bishop(new Position(this.boardLimit, new int[]{2, 0}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Queen(new Position(this.boardLimit, new int[]{3, 0}), this.userId, pieceId));
        pieceId++;
        this.king = new King(new Position(this.boardLimit, new int[]{4, 0}), this.userId, pieceId);
        livePiecesList.add(this.king);
        pieceId++;
        livePiecesList.add(new Bishop(new Position(this.boardLimit, new int[]{5, 0}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Knight(new Position(this.boardLimit, new int[]{6, 0}), this.userId, pieceId));
        pieceId++;
        livePiecesList.add(new Rook(new Position(this.boardLimit, new int[]{7, 0}), this.userId, pieceId));
        pieceId++;
    }
}
