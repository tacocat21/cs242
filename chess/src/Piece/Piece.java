package Piece;

import Board.Board;
import Util.Direction;
import Util.Position;

import java.util.ArrayList;

/**
 * The Piece abstract class holds the basic framework to create other pieces.
 *
 * @author Taccio Yamamoto
 */
public abstract class Piece {
    protected PieceType type;
    protected ArrayList<Direction> directions;
    protected Position position;
    protected int userId;
    protected int pieceId;

    /**
     * Piece constructor to initialize the position, userId, and assignPieceId of the piece
     *
     * @throws Exception throws possible exceptions from the initDirections function
     * @Param startPosition - initial Piece's position
     * @Param assignedUserId - id of the owner of the piece
     * @Param assignPieceId - id of the specific piece
     */
    public Piece(Position startPosition, int assignUserId, int assignPieceId) throws Exception {
        this.position = new Position(startPosition);
        this.userId = assignUserId;
        this.pieceId = assignPieceId;
        initDirections();
    }

    /**
     * Initializes the legal directions for the piece. Each inherited class
     * should define the possible directions.
     */
    protected abstract void initDirections() throws Exception;

    /**
     * Gets the PieceType of the Piece object
     *
     * @return
     */
    public PieceType getPieceType() {
        return this.type;
    }

    /**
     * Removes Direction object from direction arraylist
     *
     * @param remDirection - target direction to remove
     * @return true if removed object from the list
     */
    public boolean removeDirection(Direction remDirection) {
        return this.directions.remove(remDirection);
    }

    /**
     * Adds a Direction object to the direction Arraylist
     *
     * @param newDirection - target direction to add
     */
    public void addDirection(Direction newDirection) {
        if (!this.directions.contains(newDirection)) {
            this.directions.add(newDirection);
        }
    }

    /**
     * Returns direction from the piece to the target Position
     *
     * @param targetPosition - position to move to
     * @return Direction object to the target position. If null, there is no direction to target position
     */
    public Direction getDirection(Position targetPosition) throws Exception {
        if (this.position.isEqual(targetPosition)) {
            return new Direction(0, 0, 0);
        }
        Direction newDirection = new Direction(this.position, targetPosition, -1);
        for (Direction direction : this.directions) {
            if (direction.isEqual(newDirection)) {
                return direction;
            }
        }
        return null;
    }

    /**
     * Returns the direction array list
     *
     * @return the direction array list
     */
    public ArrayList<Direction> getAllDirections() {
        return this.directions;
    }

    /**
     * Moves the piece object to the newPosition.
     *
     * @return true if the piece was successfully able to be moved
     * @Param newPosition - tentative position to set piece
     * @Param board - board that keeps track of all the pieces
     */
    public boolean move(Position newPosition, Board board) throws Exception {
        if (newPosition.isEqual(this.position)) {
            return true;
        }
        if (this.position.isOutOfBound(newPosition)) {
            return false;
        }
        //Check if there exists a piece at newPosition. Return false if the piece is friendly
        Piece pieceAtNewPosition = board.getPiece(newPosition);
        if (pieceAtNewPosition != null) {
            if (pieceAtNewPosition.getUserId() == this.getUserId()) {
                return false;
            }
        }
        Direction movementDir = this.getDirection(newPosition);
        if (movementDir == null) {
            return false;
        } else if (movementDir.canMoveInDirection(this.position, newPosition, board)) {
            try {
                this.position.setPosition(newPosition);
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
            return true;
        }
        return false;
    }

    /**
     * Checks if the piece can move to the newPosition
     *
     * @param newPosition - tentative position to set piece
     * @param board       - board that keeps track of all the pieces
     * @return true if the piece can move to the newPosition
     * @throws Exception throws possible exception from the board.getPiece() function
     */
    public boolean canMove(Position newPosition, Board board) throws Exception {
        if (newPosition.isEqual(this.position)) {
            return true;
        }
        if (this.position.isOutOfBound(newPosition)) {
            return false;
        }
        //Check if there exists a piece at newPosition. Return false if the piece is friendly
        Piece pieceAtNewPosition = board.getPiece(newPosition);
        if (pieceAtNewPosition != null) {
            if (pieceAtNewPosition.getUserId() == this.getUserId()) {
                return false;
            }
        }
        Direction movementDir = this.getDirection(newPosition);
        if (movementDir == null) {
            return false;
        } else if (movementDir.canMoveInDirection(this.position, newPosition, board)) {
            return true;
        }
        return false;
    }

    /**
     * Checks if the piece can reach the new Position. This is different than canMove() because the piece at newPosition
     * does not matter
     *
     * @param newPosition target position to reach
     * @param board       ChessBoard object
     * @return true if the piece can reach the newPosition
     * @throws Exception throws Exception from the canMove() function
     */
    public boolean canReach(Position newPosition, Board board) throws Exception {
        Piece targetPiece = board.removePiece(newPosition);
        boolean canReach = this.canMove(newPosition, board);
        if (targetPiece != null) {
            board.setPiece(targetPiece);
        }
        return canReach;
    }

    /**
     * Get userId function
     *
     * @return userId that keeps track of the owner of the piece
     */
    public int getUserId() {
        return userId;
    }

    /**
     * Get pieceId function
     *
     * @return pieceId to keep track of each unique piece
     */
    public int getPieceId() {
        return pieceId;
    }

    /**
     * Get the position object
     *
     * @return the Position object
     */
    public Position getPosition() {
        return this.position;
    }


}
