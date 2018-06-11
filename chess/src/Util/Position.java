package Util;

/**
 * A Position object to keep track of the position of a single Piece object
 *
 * @author Taccio Yamamoto <tyamamo2@illinois.edu>
 */
public class Position {

    private int[] position;
    private int[] limit;
    private int numDimension;

    /*
     * Constructor of the Position object.
     * @param startLimit - an array to set the upper bound of the piece position. The lower bound is 0.
     * @param startPosition - an array to set the position of the piece
     */

    /**
     * Constructor
     *
     * @param startLimit    - an array to set the upper bound of the piece position. The lower bound is 0.
     * @param startPosition - an array to set the position of the piece
     * @throws Exception throws an exception if the startPosition is out of bounds or
     *                   the startLimit and startPosition have different lengths
     */
    public Position(int[] startLimit, int[] startPosition) throws Exception {
        if (startLimit.length != startPosition.length) {
            throw new Exception("Initial limit and position arrays have different lengths");
        }

        for (int idx = 0; idx < startLimit.length; idx++) {
            if (startLimit[idx] <= startPosition[idx]
                    || startPosition[idx] < 0) {
                throw new IndexOutOfBoundsException("Initial Position parameters out of bound");
            }
        }

        this.numDimension = startLimit.length;
        this.position = new int[this.numDimension];
        this.limit = new int[this.numDimension];
        for (int idx = 0; idx < this.numDimension; idx++) {
            this.position[idx] = startPosition[idx];
            this.limit[idx] = startLimit[idx];
        }
    }

    /**
     * Copy constructor
     *
     * @param startPosition - Position object to copy from
     */
    public Position(Position startPosition) {
        int[] startPositionArray = startPosition.getPositionArray();
        int[] startPositionLimit = startPosition.getLimit();
        this.numDimension = startPosition.getNumDimension();
        this.position = new int[this.numDimension];
        this.limit = new int[this.numDimension];
        for (int idx = 0; idx < this.numDimension; idx++) {
            this.position[idx] = startPositionArray[idx];
            this.limit[idx] = startPositionLimit[idx];
        }
    }

    /**
     * Sets the new position of the object given a Position object
     *
     * @param newPosition - Position object to copy from
     * @throws Exception - throws Exception if the input position object has different
     *                   position array lengths
     */
    public void setPosition(Position newPosition) throws Exception {
        int[] newPositionArray = newPosition.getPositionArray();
        if (newPositionArray.length != this.numDimension ||
                this.position.length != this.numDimension) {
            throw new Exception("Input Position object has different position array length");
        }

        for (int idx = 0; idx < this.numDimension; idx++) {
            this.position[idx] = newPositionArray[idx];
        }
    }

    /**
     * Sets the new position of the object and checks if new position is within boundary.
     *
     * @param newPosition - an array to set the new position of the piece
     * @throws Exception - throws Exception if the newPosition is out of bounds
     */
    public void setPosition(int[] newPosition) throws Exception {
        if (newPosition.length != this.numDimension ||
                this.position.length != this.numDimension) {
            throw new Exception("Position input array has different length");
        }

        for (int idx = 0; idx < this.numDimension; idx++) {
            if (limit[idx] <= newPosition[idx] || newPosition[idx] < 0) {
                throw new IndexOutOfBoundsException("Initial Position parameters out of bound");
            }
        }

        for (int idx = 0; idx < this.numDimension; idx++) {
            this.position[idx] = newPosition[idx];
        }
    }

    /**
     * Checks if the targetPosition is beyond the limit defined in the position object
     *
     * @return true if the targetPosition is outOfBound
     */
    public boolean isOutOfBound(Position targetPosition) {
        int[] positionArray = targetPosition.getPositionArray();
        for (int idx = 0; idx < this.numDimension; idx++) {
            if (positionArray[idx] < 0 || limit[idx] <= positionArray[idx]) {
                return true;
            }
        }
        return false;
    }

    /**
     * moves the position in the targetDirection by numSteps
     *
     * @param targetDirection - target direction to move to
     * @param numSteps        - number of steps to move in target direction
     */
    public void moveByDirection(Direction targetDirection, int numSteps) throws Exception {
        if (numSteps < 0) {
            throw new Exception("Unable to have negative steps");
        }
        int[] directionArr = targetDirection.getDirection();
        int[] newPosition = this.getPositionArray();
        for (int idx = 0; idx < this.position.length; idx++) {
            newPosition[idx] += directionArr[idx] * numSteps;
        }
        this.setPosition(newPosition);
    }

    /**
     * Get column number
     *
     * @return column number
     */
    public int getColumn() {
        return this.position[0];
    }

    /**
     * Get row number
     *
     * @return row number
     */
    public int getRow() {
        return this.position[1];
    }

    /**
     * Gets the array representation of the position
     *
     * @return array representation of the position
     */
    public int[] getPositionArray() {
        return this.position;
    }

    /**
     * returns the upper bound limit of the board
     *
     * @return the array representation of the upper bound limit of the board
     */
    public int[] getLimit() {
        return this.limit;
    }


    /**
     * Checks if the otherPosition object has the same position as this object
     *
     * @param otherPosition - Position object to compare to
     * @return true if the other object has the same position
     */
    public boolean isEqual(Position otherPosition) {
        if (this.numDimension != otherPosition.getNumDimension()) {
            return false;
        }
        int[] otherPositionArray = otherPosition.getPositionArray();
        for (int idx = 0; idx < this.numDimension; idx++) {
            if (this.position[idx] != otherPositionArray[idx]) {
                return false;
            }
        }
        return true;
    }

    /**
     * the length of the position array
     *
     * @return - the length of the position array
     */
    public int getNumDimension() {
        return this.numDimension;
    }
}
