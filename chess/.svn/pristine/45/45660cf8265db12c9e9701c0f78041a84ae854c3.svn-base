package Piece.Implementation;

import Board.Implementation.ChessBoard;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/13/17.
 */
public class RookTest {
    private ChessBoard board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private Rook rook1;
    private Rook rook0;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        rook0 = new Rook(new Position(boardLimit, new int[]{0, 0}), 0, 2);
        rook1 = new Rook(new Position(boardLimit, new int[]{4, 4}), 1, 0);
        pieces1 = new Piece[]{new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 1),
                rook0, rook1};
        board1 = new ChessBoard(pieces1, boardLimit);
    }

    /**
     * Checks the piece has correct PieceType
     */
    @Test
    public void testPieceType() {
        assertEquals(rook0.getPieceType(), PieceType.ROOK);
    }

    /**
     * Tests the canMove() function
     *
     * @throws Exception throws Exception from canMove() funciton
     */
    @Test
    public void testCanMove() throws Exception {
        int[] rook0PositionArr = rook0.getPosition().getPositionArray();
        int[] rook1PositionArr = rook1.getPosition().getPositionArray();
        assertFalse(rook0.canMove(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(rook0.canMove(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(rook0.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(rook0.canMove(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(rook0PositionArr, rook0.getPosition().getPositionArray());
        assertTrue(rook1.canMove(new Position(boardLimit, new int[]{3, 4}), board1));
        assertTrue(rook0.canMove(new Position(boardLimit, new int[]{3, 0}), board1));
        assertArrayEquals(rook0PositionArr, rook0.getPosition().getPositionArray());
        assertArrayEquals(rook1PositionArr, rook1.getPosition().getPositionArray());
    }

    /**
     * Tests the move() function
     *
     * @throws Exception throws Exception from move() funciton
     */
    @Test
    public void testMove() throws Exception {
        int[] rook0PositionArr = rook0.getPosition().getPositionArray();
        assertFalse(rook0.move(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(rook0.move(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(rook0.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertArrayEquals(rook0PositionArr, rook0.getPosition().getPositionArray());
        assertTrue(rook1.move(new Position(boardLimit, new int[]{3, 4}), board1));
        assertArrayEquals(new int[]{3, 4}, rook1.getPosition().getPositionArray());
        assertFalse(rook0.move(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertTrue(rook0.move(new Position(boardLimit, new int[]{3, 0}), board1));
//        assertTrue(rook1.move(new Position(boardLimit, new int[]{3, 0}), board1));
        assertArrayEquals(new int[]{3, 0}, rook0.getPosition().getPositionArray());
        assertArrayEquals(new int[]{3, 0}, rook0.getPosition().getPositionArray());
    }

    /**
     * Tests different Get funcitons
     */
    @Test
    public void testGetFunctions() {
        assertArrayEquals(rook0.getPosition().getPositionArray(), new int[]{0, 0});
        assertArrayEquals(rook1.getPosition().getPositionArray(), new int[]{4, 4});
    }

}