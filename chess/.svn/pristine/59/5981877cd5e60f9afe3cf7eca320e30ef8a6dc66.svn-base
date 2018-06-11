package Board;


import Piece.Implementation.King;
import Piece.Piece;
import Util.Direction;
import Util.Position;

import java.util.ArrayList;

/**
 * Class that represents the chess board
 *
 * @author Taccio Yamamoto
 */
public class Board {
    private Piece[][] Board;
    private int[] limit;


    /**
     * Board constructor
     *
     * @param pieces - list of pieces to add to the board
     * @param limit  - limit of the board dimensions
     * @throws Exception throws Exception from the setPiece() function
     */
    public Board(Piece[] pieces, int[] limit) throws Exception {
        this.limit = limit.clone();
        this.Board = new Piece[this.limit[0]][this.limit[1]];
        for (int row = 0; row < this.limit[0]; row++) {
            for (int col = 0; col < this.limit[1]; col++) {
                Board[row][col] = null;
            }
        }
        this.setPiece(pieces);
    }

    /**
     * Checks if the targetPosition is out of bounds
     *
     * @param targetPosition - position object to check out of bounds condition
     * @return true if the targetPosition is out of bounds
     */
    public boolean isOutOfBound(Position targetPosition) {
        int[] positionArray = targetPosition.getPositionArray();
        for (int idx = 0; idx < this.limit.length; idx++) {
            if (positionArray[idx] < 0 || positionArray[idx] >= this.limit[idx]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the targetPosition is out of bounds
     *
     * @param x - x value to check
     * @param y - y value to check
     * @return true if the targetPosition is out of bounds
     */
    public boolean isOutOfBound(int x, int y) {
        return x < 0 || x >= this.limit[0] || y < 0 || y >= this.limit[1];
    }

    /**
     * Returns the piece at the targetPosition
     *
     * @param targetPosition - targetPosition to get the piece
     * @return the piece at the targetPosition or null if there are no pieces at the position
     * @throws Exception throws exception if the targetPosition is out of bounds
     */
    public Piece getPiece(Position targetPosition) throws Exception {
        if (this.isOutOfBound(targetPosition)) {
            throw new IndexOutOfBoundsException("Position parameter is out of bound");
        }
        int[] positionArray = targetPosition.getPositionArray();
        return Board[positionArray[0]][positionArray[1]];
    }

    /**
     * Returns the piece at the targetPosition
     *
     * @param x - target row
     * @param y - target col
     * @return the piece at the targetPosition or null if there are no pieces at the position
     * @throws Exception throws exceptino if the requested position is out of bounds
     */
    public Piece getPiece(int x, int y) throws Exception {
        if (x < 0 || x >= this.getNumColumns() ||
                y < 0 || y >= this.getNumRows()) {
            throw new IndexOutOfBoundsException("Position parameter is out of bound");
        }
        return Board[x][y];
    }

    /**
     * Checks if the target position is empty
     *
     * @param targetPosition - position to check if the piece is on the board
     * @return true if there are no pieces at target Position
     * @throws Exception - throws exception if targetPosition is outside the board
     */
    public boolean isEmpty(Position targetPosition) throws Exception {
        if (this.isOutOfBound(targetPosition)) {
            throw new IndexOutOfBoundsException("Position parameter is out of bound");
        }
        int[] positionArray = targetPosition.getPositionArray();
        return Board[positionArray[0]][positionArray[1]] == null;
    }

    /**
     * Sets the targetPiece on the board
     *
     * @param targetPiece - piece to add to the board
     * @throws Exception if the Piece has a position out of bounds or
     *                   the piece is setting on a non-empty location
     */
    public void setPiece(Piece targetPiece) throws Exception {
        Position targetPosition = targetPiece.getPosition();
        if (this.isOutOfBound(targetPosition)) {
            throw new IndexOutOfBoundsException("Position parameter is out of bound");
        }
        if (!this.isEmpty(targetPosition)) {
            throw new Exception("A piece already exists at the target location");
        }
        int[] positionArray = targetPosition.getPositionArray();
        Board[positionArray[0]][positionArray[1]] = targetPiece;
    }


    /**
     * Sets multiple pieces on the board
     *
     * @param targetPiece - array of Piece objects to add to the board
     * @throws Exception same exception as the setPiece(Piece) function
     */
    public void setPiece(Piece[] targetPiece) throws Exception {
        for (int idx = 0; idx < targetPiece.length; idx++) {
            this.setPiece(targetPiece[idx]);
        }
    }

    /**
     * Removes piece on the board at target position
     *
     * @param targetPosition target position to remove the piece
     * @return returns the piece object at targetPosition or null if no pieces were there
     * @throws Exception throws exception if targetPosition is out of bounds
     */
    public Piece removePiece(Position targetPosition) throws Exception {
        if (this.isOutOfBound(targetPosition)) {
            throw new IndexOutOfBoundsException("Position parameter is out of bound");
        }
        int[] positionArray = targetPosition.getPositionArray();
        Piece returnPiece = Board[positionArray[0]][positionArray[1]];
        Board[positionArray[0]][positionArray[1]] = null;
        return returnPiece;
    }

    /**
     * Checks if the king piece is in check
     *
     * @param kingPosition - king's position
     * @param enemyPieces  - An array list of enemy pieces
     * @return true if the king is in check
     */
    public boolean check(Position kingPosition, ArrayList<Piece> enemyPieces) throws Exception {
        for (Piece currentPiece : enemyPieces) {
            Direction targetDirection = currentPiece.getDirection(kingPosition);
            if (targetDirection != null) {
                Position currentPosition = new Position(currentPiece.getPosition());
                try {
                    while (!this.isOutOfBound(currentPosition)) {
                        currentPosition.moveByDirection(targetDirection, 1);
                        if (currentPosition.isEqual(kingPosition)) {
                            return true;
                        }
                        //checks if there is a piece on the way
                        if (this.getPiece(currentPosition) != null) {
                            continue;
                        }
                    }
                } catch (Exception e) {
                    continue;
                }
            }
        }
        return false;
    }

    /**
     * Checks if the king is in checkmate
     *
     * @param king        - king piece
     * @param enemyPieces - An array list of enemy pieces
     * @return true if there is a checkmate against the king
     */
    public boolean checkMate(King king, ArrayList<Piece> enemyPieces) throws Exception {
        int[] kingPositionArray = king.getPosition().getPositionArray();
        for (int posX = -1; posX <= 1; posX++) {
            for (int posY = -1; posY <= 1; posY++) {
                int[] checkPositionArr = new int[]{kingPositionArray[0] + posX, kingPositionArray[1] + posY};

                Position checkPosition = new Position(this.limit, checkPositionArr);
                if (!this.isOutOfBound(checkPosition)) {
                    if (this.check(checkPosition, enemyPieces)) {
                        continue;
                    } else {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * moves the current piece to the target position.
     *
     * @param currentPiece   - piece to move to target position
     * @param targetPosition - position to move the currentPiece
     * @return returns the piece at targetPosition. null if no piece is located at target Position
     */
    public Piece move(Piece currentPiece, Position targetPosition) throws Exception {
        Position currentPiecePosition = currentPiece.getPosition();
        if (this.isOutOfBound(targetPosition)) {
            throw new Exception("Target position is out of bounds");
        }
        if (currentPiece.getPosition().isEqual(targetPosition)) {
            throw new Exception("Target position is the same position");
        }
        if (this.getPiece(targetPosition) != null
                && this.getPiece(targetPosition).getUserId() == currentPiece.getUserId()) {
            throw new Exception("Target position belongs to the same team");
        }
        if (currentPiece.canMove(targetPosition, this)) {
            Piece targetPiece = this.removePiece(targetPosition);
            this.removePiece(currentPiecePosition);
            if (!currentPiece.move(targetPosition, this)) {
                throw new Exception("Unable to move piece");
            }
            this.setPiece(currentPiece);
            return targetPiece;
        }
        throw new Exception("Unable to move piece");
    }


    /**
     * Get board array
     *
     * @return the board object
     */
    public Piece[][] getBoard() {
        return this.Board;
    }

    /**
     * Gets the number of columns of the board
     *
     * @return the number of columns on the board
     */
    public int getNumColumns() {
        return this.limit[0];
    }


    /**
     * Gets the number of columns of the board
     *
     * @return the number of rows on the board
     */
    public int getNumRows() {
        return this.limit[1];
    }

    /**
     * Gets the limit array of the board
     *
     * @return the limit array representing the dimensions of the board
     */
    public int[] getLimit() {
        return this.limit;
    }


}
