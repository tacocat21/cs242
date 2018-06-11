package Util;

import Board.Board;
import Piece.Piece;

/**
 * Class to handle directions of each piece
 *
 * @author Taccio Yamamoto
 */
public class Direction {
    private int[] dirVector;
    private int distance;

    /**
     * Constructor to create direction objects
     *
     * @param dx       - row vector
     * @param dy       - column vector
     * @param distance - distance piece can move, -1 if piece can move
     *                 infinitely long until it reaches another piece
     */
    public Direction(int dx, int dy, int distance) throws Exception {
        this.dirVector = new int[]{dx, dy};
        this.simplify();
        this.setDistance(distance);
    }

    /**
     * Constructor to create direction objects
     *
     * @param dirVector - direction vector to assign to dirVector
     * @param distance  - distance piece can move, -1 if piece can move
     *                  infinitely long until it reaches another piece
     */
    public Direction(int[] dirVector, int distance) throws Exception {
        this.dirVector = new int[2];
        for (int idx = 0; idx < dirVector.length; idx++) {
            this.dirVector[idx] = dirVector[idx];
        }
        this.setDistance(distance);
        this.simplify();
    }

    /**
     * Constructor to create direction objects
     *
     * @param copyDir - Direction to copy from
     */
    public Direction(Direction copyDir) throws Exception {
        int[] copyVector = copyDir.getDirection();
        this.dirVector = new int[2];
        for (int idx = 0; idx < this.dirVector.length; idx++) {
            this.dirVector[idx] = copyVector[idx];
        }
        this.setDistance(copyDir.getDistance());
        this.simplify();
    }

    /**
     * Constructor to create direction objects from position objects
     *
     * @param initial  - initial position
     * @param end      - end position
     * @param distance - distance piece can move, -1 if piece can move
     *                 infinitely long until it reaches another piece
     */
    public Direction(Position initial, Position end, int distance) throws Exception {
        int[] initial_array = initial.getPositionArray();
        int[] end_array = end.getPositionArray();
        if (initial_array.length != end_array.length) {
            throw new Exception("Initial and end positions have different array distance");
        }
        dirVector = new int[initial_array.length];
        for (int idx = 0; idx < dirVector.length; idx++) {
            dirVector[idx] = end_array[idx] - initial_array[idx];
        }
        this.setDistance(distance);
        this.simplify();
    }

    /**
     * Returns direction vector
     *
     * @return int[] array of the direction vector
     */
    public int[] getDirection() {
        return this.dirVector;
    }

    /**
     * Sets the direction vector
     *
     * @param newDirection - Direction object to copy from
     */
    public void setDirection(Direction newDirection) {
        int[] copyArray = newDirection.getDirection();
        for (int idx = 0; idx < this.dirVector.length; idx++) {
            this.dirVector[idx] = copyArray[idx];
        }
        this.simplify();
    }

    /**
     * Checks if the Direcion object allows to move from currentPosition
     * to targetPosition.
     *
     * @param currentPosition - current position
     * @param targetPosition  - target position
     * @param board           - board object that keeps track of all the pieces
     * @return true if the Direction object can move from the currentPosition
     * to the targetPosition
     */
    public boolean canMoveInDirection(Position currentPosition, Position targetPosition, Board board) throws Exception {
        if (currentPosition.isEqual(targetPosition)) {
            return true;
        }
        Direction directionVector = new Direction(currentPosition, targetPosition, -1);
        // calculate change in position
        int[] directionVectorArr = new int[2];
        int[] currentPositionArr = currentPosition.getPositionArray();
        int[] targetPositionArr = targetPosition.getPositionArray();
        for (int idx = 0; idx < directionVectorArr.length; idx++) {
            directionVectorArr[idx] = targetPositionArr[idx] - currentPositionArr[idx];
        }
        if (this.equals(directionVector)) {
            // The GCD measures how many steps it will take to reach the target position
            // if GCD = 0, the targetPosition and currentPosition are at the same position
            // at that dimension
            int firstIdxGCD = this.gcd(this.dirVector[0], directionVectorArr[0]);
            int secondIdxGCD = this.gcd(this.dirVector[1], directionVectorArr[1]);
            if (this.distance == -1
                    || (this.distance >= firstIdxGCD && firstIdxGCD != 0)
                    || (this.distance >= secondIdxGCD && secondIdxGCD != 0)) {
                // Copies the position so it won't modify the currentPosition object
                Position copyPosition = new Position(currentPosition);
                //iterate through the path to see if there is a piece on the way
                while (!board.isOutOfBound(copyPosition)) {
                    copyPosition.moveByDirection(this, 1);
                    if (copyPosition.isEqual(targetPosition)) {
                        return true;
                    }
                    Piece currentPositionPiece = board.getPiece(copyPosition);
                    if (currentPositionPiece == null) {
                        continue;
                    } else {
                        return false;
                    }
                }
            }
        }
        return false;

    }

    /**
     * Get distance function
     *
     * @return distance piece can move, -1 if piece can move
     * infinitely long until it reaches another piece
     */
    public int getDistance() {
        return this.distance;
    }

    /**
     * Sets the distance function
     *
     * @param distance - new distance, -1 if piece can move
     *                 infinitely long until it reaches another piece
     */
    public void setDistance(int distance) throws Exception {
        this.distance = distance;
        if (distance < -1) {
            throw new Exception("Invalid distance value");
        }
    }

    /**
     * Sets the direction vector
     *
     * @param dx - row vector
     * @param dy - column vector
     */
    public void setDirection(int dx, int dy) {
        this.dirVector[0] = dx;
        this.dirVector[1] = dy;
        this.simplify();
    }

    /**
     * Sets the direction vector
     *
     * @param directionArr - direction vector to set
     */
    public void setDirection(int[] directionArr) {
        for (int idx = 0; idx < directionArr.length; idx++) {
            this.dirVector[idx] = directionArr[idx];
        }
        this.simplify();
    }

    /**
     * Sets the direction vector
     *
     * @param initial - initial Position object
     * @param end     - final Position object
     * @throws Exception - throws exception if the positions have different array lengths
     */
    public void setDirection(Position initial, Position end) throws Exception {
        int[] initial_array = initial.getPositionArray();
        int[] end_array = end.getPositionArray();
        if (initial_array.length != end_array.length) {
            throw new Exception("Initial and end positions have different array distance");
        }
        dirVector = new int[initial_array.length];
        for (int idx = 0; idx < dirVector.length; idx++) {
            dirVector[idx] = end_array[idx] - initial_array[idx];
        }
        this.simplify();
    }

    /**
     * Checks if the two Direction objects have the same direction vector
     *
     * @param otherDirection Direction object to compare to
     * @return boolean ths is true if both Direction objects has the same direction
     */
    public boolean equals(Direction otherDirection) {
        boolean isEqual = true;
        int[] otherDirectionVector = otherDirection.getDirection();
        for (int idx = 0; idx < this.dirVector.length; idx++) {
            isEqual = isEqual && (this.dirVector[idx] == otherDirectionVector[idx]);
        }
        return isEqual;
    }

    /**
     * Divides the dirVector by its greatest common denominator
     */
    private void simplify() {
        int gcd = this.gcd();
        if (gcd == 0) {
            return;
        }
        for (int idx = 0; idx < this.dirVector.length; idx++) {
            this.dirVector[idx] = this.dirVector[idx] / gcd;
        }
    }

    /**
     * Gets the greatest common denominator from the dirVector
     *
     * @return
     */
    private int gcd() {
        return this.gcd(this.dirVector[0], this.dirVector[1]);
    }

    /**
     * Gets the greatest common denominator given the input
     *
     * @param first  - first int
     * @param second - second int
     * @return the greatest common denominator
     */
    private int gcd(int first, int second) {
        first = Math.abs(first);
        second = Math.abs(second);
        while (second != 0) {
            int temp = second;
            second = first % second;
            first = temp;
        }
        return first;
    }
}
