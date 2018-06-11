package Piece.Implementation;

import Board.Board;
import Util.Direction;
import Util.Position;
import Piece.Piece;
import java.util.ArrayList;
import Piece.PieceType;
import com.sun.xml.internal.bind.annotation.OverrideAnnotationOf;

/**
 * Class that defines the Pawn chess piece
 * @author Taccio Yamamoto
 */

public class Pawn extends Piece{
    private ArrayList<Direction> attackDirection;
    private int pawnDirection;
    /**
     * Constructor
     * @param startPosition - start position of the piece
     * @param assignUserId - user identification of the owner of the piece
     * @param assignPieceId - unique id assigned to the piece
     * @throws Exception throws possible exceptions from the initDirections function
     */

    public Pawn(Position startPosition, int assignUserId, int assignPieceId) throws Exception {
        super(startPosition, assignUserId, assignPieceId);
        this.type = PieceType.PAWN;
    }

    /**
     * Initializes the legal directions of the piece
     * @throws Exception throws exceptions from the Direction constructor
     */
    @Override
    protected void initDirections() {
        // dir changes the y direction of the pawn movements
        this.pawnDirection = 1;
        if(this.getUserId()==1){
            this.pawnDirection = -1;
        }
        this.directions = new ArrayList<Direction>(3);

    }

    @Override
    /**
     * Overrides the move function to move a piece object to the newPosition.
     * @Param newPosition - tentative position to set piece
     * @Param board - board that keeps track of all the pieces
     * @return true if the piece was successfully able to be moved
     * @throws Exception from the helper functions that checks different possible positions
     */
    public boolean move(Position newPosition, Board board) throws Exception {
        if(newPosition.isEqual(this.position)){
            return true;
        }
        if(board.isOutOfBound(newPosition)){
            return false;
        }
        //Check if there exists a piece at newPosition. Return false if the piece is friendly
        Piece pieceAtNewPosition = board.getPiece(newPosition);
        if(pieceAtNewPosition!=null){
            if(pieceAtNewPosition.getUserId() == this.getUserId()){
                return false;
            }
        }
        int[] newPositionArr = newPosition.getPositionArray();
        boolean result = false;
        // Checks all the possible positions the pawn can make
        if(checkFrontPosition(newPositionArr, board)){
            result = super.move(newPosition, board);
        }
        else if(checkFrontLeftPosition(newPositionArr, board)){
            result = super.move(newPosition, board);
        }
        else if(checkFrontRightPosition(newPositionArr, board)){
            result = super.move(newPosition, board);
        }
        else if(checkTwoPositionAhead(newPositionArr, board)){
            result = super.move(newPosition, board);
        }
        this.directions.clear();
        return result;
    }

    /**
     * Checks if the piece can move to the newPosition. This function overrides the canMove Piece function
     * @param newPosition - tentative position to set piece
     * @param board - board that keeps track of all the pieces
     * @return true if the piece can move to the newPosition
     * @throws Exception throws possible exception from the board.getPiece() function
     */
    @Override
    public boolean canMove(Position newPosition, Board board) throws Exception {
        if(newPosition.isEqual(this.position)){
            return true;
        }
        if(board.isOutOfBound(newPosition)){
            return false;
        }
        //Check if there exists a piece at newPosition. Return false if the piece is friendly
        Piece pieceAtNewPosition = board.getPiece(newPosition);
        if(pieceAtNewPosition!=null){
            if(pieceAtNewPosition.getUserId() == this.getUserId()){
                return false;
            }
        }
        int[] newPositionArr = newPosition.getPositionArray();
        boolean result = false;
        // Checks all the possible positions the pawn can make
        if(checkFrontPosition(newPositionArr, board)){
            result = super.canMove(newPosition, board);
        }
        else if(checkFrontLeftPosition(newPositionArr, board)){
            result = super.canMove(newPosition, board);
        }
        else if(checkFrontRightPosition(newPositionArr, board)){
            result = super.canMove(newPosition, board);
        }
        else if(checkTwoPositionAhead(newPositionArr, board)){
            result = super.canMove(newPosition, board);
        }
        this.directions.clear();
        return result;
    }

    /**
     * Helper function to check if the pawn can move to the position in front of it. Adds
     * a direction to the directions ArrayList if it can move to it
     * @param targetPositionArr - tentative position to set piece
     * @param board - board that keeps track of all the pieces
     * @return true if the pawn is able to move to the position in front of it
     * @throws Exception throws possible exceptions from the Board.getPiece function
     */
    private boolean checkFrontPosition(int[] targetPositionArr, Board board) throws Exception {
        int [] currentPositionArr = this.position.getPositionArray();
        Piece pieceInFront = board.getPiece(currentPositionArr[0], currentPositionArr[1]+this.pawnDirection);
        if(pieceInFront != null){
            return false;
        }
        if((currentPositionArr[0] == targetPositionArr[0])
                && (currentPositionArr[1] + this.pawnDirection == targetPositionArr[1])){
            this.addDirection(new Direction(0,this.pawnDirection,1));
            return true;
        }
        return false;
    }

    /**
     * Helper function to check if the pawn can move to the diagonal right position. Adds
     * a direction to the directions ArrayList if it can move to it
     * @param targetPositionArr - tentative position to set piece
     * @param board - board that keeps track of all the pieces
     * @return true if the pawn is able to move to the position diagonally right of it
     * @throws Exception throws possible exceptions from the Board.getPiece function
     */
    private boolean checkFrontRightPosition(int[] targetPositionArr, Board board) throws Exception {
        int[] currentPositionArr = this.position.getPositionArray();
        // checks if the piece can move diagonally right
        if(currentPositionArr[0]== board.getLimit()[0]-1
                || (currentPositionArr[1]+this.pawnDirection == board.getLimit()[1])
                || (currentPositionArr[1]+this.pawnDirection < 0)){
            return false;
        }
        Piece targetPiece = board.getPiece(currentPositionArr[0]+1, currentPositionArr[1]+this.pawnDirection);
        // Needs to have a piece at the location to be able to move
        if(targetPiece == null){
            return false;
        }

        if ((currentPositionArr[0] < board.getLimit()[0] - 1)
                && (currentPositionArr[1] + this.pawnDirection == targetPositionArr[1])
                && (currentPositionArr[0] + 1 == targetPositionArr[0])) {
            this.addDirection(new Direction(1, this.pawnDirection, 1));
            return true;
        }
        return false;
    }

    /**
     * Helper function to check if the pawn can move to the diagonal left position. Adds
     * a direction to the directions ArrayList if it can move to it
     * @param targetPositionArr - tentative position to set piece
     * @param board - board that keeps track of all the pieces
     * @return true if the pawn is able to move to the position diagonally left of it
     * @throws Exception throws possible exceptions from the Board.getPiece function
     */
    private boolean checkFrontLeftPosition(int[] targetPositionArr, Board board) throws Exception {
        int[] currentPositionArr = this.position.getPositionArray();
        // checks if targetPosition is out of bounds
        if(currentPositionArr[0]==0
                || (currentPositionArr[1]+this.pawnDirection == board.getLimit()[1])
                || (currentPositionArr[1]+this.pawnDirection < 0)){
            return false;
        }
        // checks if a piece exists at target position
        Piece targetPiece = board.getPiece(currentPositionArr[0]-1, currentPositionArr[1]+this.pawnDirection);
        if(targetPiece == null){
            return false;
        }
        if ((currentPositionArr[1] + this.pawnDirection == targetPositionArr[1])
                && (currentPositionArr[0] - 1 == targetPositionArr[0])) {
            this.addDirection(new Direction(-1, this.pawnDirection, 1));
            return true;
        }
        return false;
    }

    /**
     * Helper function to check if the pawn can move two positions ahead. Adds
     * a direction to the directions ArrayList if it can move to it
     * @param targetPositionArr - tentative position to set piece
     * @param board - board that keeps track of all the pieces
     * @return true if the pawn is able to move to two squares in front of it
     * @throws Exception throws possible exceptions from the Board.getPiece function
     */
    private boolean checkTwoPositionAhead(int[] targetPositionArr, Board board) throws Exception {
        int [] currentPositionArr = this.position.getPositionArray();
        // checks if the pawn is in the initial position
        if(!((currentPositionArr[1] == 1 && this.pawnDirection == 1)
                || (currentPositionArr[1] == board.getLimit()[1]-2 && this.pawnDirection == -1))){
            return false;
        }
        int twoPositionAhead = currentPositionArr[1]+2*this.pawnDirection;
        // checks if target position y value is 2 indices ahead or it's out of bounds
        if(twoPositionAhead != targetPositionArr[1]
                || twoPositionAhead < 0
                || twoPositionAhead >= board.getLimit()[1]){
            return false;
        }
        Piece pieceInFront = board.getPiece(targetPositionArr[0], targetPositionArr[1]+this.pawnDirection);
        Piece pieceTwoStepAhead = board.getPiece(targetPositionArr[0], targetPositionArr[1]+2*this.pawnDirection);
        if(pieceInFront == null
                && pieceTwoStepAhead == null
                && (currentPositionArr[0] == targetPositionArr[0])){
            this.addDirection(new Direction(0,2*this.pawnDirection,1));
            return true;
        }
        return false;
    }
}
