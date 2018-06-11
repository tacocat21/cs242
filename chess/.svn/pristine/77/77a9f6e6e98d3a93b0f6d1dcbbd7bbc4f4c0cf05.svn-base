package Piece.Implementation;

import Board.Board;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/14/17.
 */
public class CustomPiece2Test {

    private Board board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private CustomPiece2 customPiece1;
    private CustomPiece2 customPiece0;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        customPiece0 = new CustomPiece2(new Position(boardLimit, new int[]{0, 0}), 0, 2);
        customPiece1 = new CustomPiece2(new Position(boardLimit, new int[]{4, 4}), 1, 0);
        pieces1 = new Piece[]{new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 1),
                customPiece0, customPiece1};
        board1 = new Board(pieces1, boardLimit);
    }

    /**
     * Checks the piece has correct PieceType
     */
    @Test
    public void testPieceType() {
        assertEquals(customPiece0.getPieceType(), PieceType.CUSTOM2);
    }

    /**
     * Tests the canMove() function
     *
     * @throws Exception throws Exception from canMove() funciton
     */
    @Test
    public void testCanMove() throws Exception {
        int[] customPiece0PositionArr = customPiece0.getPosition().getPositionArray();
        int[] customPiece1PositionArr = customPiece1.getPosition().getPositionArray();
        assertFalse(customPiece0.canMove(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(customPiece0.canMove(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(customPiece0.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(customPiece0.canMove(new Position(boardLimit, new int[]{0, 2}), board1));

        assertArrayEquals(customPiece0PositionArr, customPiece0.getPosition().getPositionArray());
        assertTrue(customPiece1.canMove(new Position(boardLimit, new int[]{5, 5}), board1));
        assertTrue(customPiece1.canMove(new Position(boardLimit, new int[]{3, 4}), board1));
        assertTrue(customPiece1.canMove(new Position(boardLimit, new int[]{2, 4}), board1));
        assertTrue(customPiece0.canMove(new Position(boardLimit, new int[]{2, 0}), board1));
        assertTrue(customPiece0.canMove(new Position(boardLimit, new int[]{1, 0}), board1));
        assertArrayEquals(customPiece0PositionArr, customPiece0.getPosition().getPositionArray());
        assertArrayEquals(customPiece1PositionArr, customPiece1.getPosition().getPositionArray());
    }

    /**
     * Tests the move() function
     *
     * @throws Exception throws Exception from move() funciton
     */
    @Test
    public void testMove() throws Exception {
        int[] customPiece0PositionArr = customPiece0.getPosition().getPositionArray();
        assertFalse(customPiece0.move(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(customPiece0.move(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(customPiece0.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertArrayEquals(customPiece0PositionArr, customPiece0.getPosition().getPositionArray());
        assertTrue(customPiece1.move(new Position(boardLimit, new int[]{2, 4}), board1));
        assertTrue(customPiece0.move(new Position(boardLimit, new int[]{2, 0}), board1));
        assertArrayEquals(new int[]{2, 4}, customPiece1.getPosition().getPositionArray());
        assertArrayEquals(new int[]{2, 0}, customPiece0.getPosition().getPositionArray());
    }

    /**
     * Tests different Get funcitons
     */
    @Test
    public void testGetFunctions() {
        assertArrayEquals(customPiece0.getPosition().getPositionArray(), new int[]{0, 0});
        assertArrayEquals(customPiece1.getPosition().getPositionArray(), new int[]{4, 4});
    }

}