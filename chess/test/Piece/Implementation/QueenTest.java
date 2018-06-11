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
public class QueenTest {
    private ChessBoard board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private Queen queen0;
    private Queen queen1;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        queen0 = new Queen(new Position(boardLimit, new int[]{0, 0}), 0, 2);
        queen1 = new Queen(new Position(boardLimit, new int[]{4, 4}), 1, 0);
        pieces1 = new Piece[]{new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 1),
                queen0, queen1};
        board1 = new ChessBoard(pieces1, boardLimit);
    }

    @Test
    public void testPieceType() {
        assertEquals(queen0.getPieceType(), PieceType.QUEEN);
    }

    @Test
    public void testCanMove() throws Exception {
        int[] queen0PositionArr = queen0.getPosition().getPositionArray();
        assertFalse(queen0.canMove(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(queen0.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(queen0.canMove(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(queen0PositionArr, queen0.getPosition().getPositionArray());
        assertTrue(queen1.canMove(new Position(boardLimit, new int[]{3, 3}), board1));
        assertTrue(queen1.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertTrue(queen0.canMove(new Position(boardLimit, new int[]{7, 0}), board1));
        assertTrue(queen1.canMove(new Position(boardLimit, new int[]{4, 0}), board1));
        assertTrue(queen1.canMove(new Position(boardLimit, new int[]{4, 6}), board1));
    }

    @Test
    public void testMove() throws Exception {
        int[] queen0PositionArr = queen0.getPosition().getPositionArray();
        assertFalse(queen0.move(new Position(boardLimit, new int[]{4, 4}), board1));
        assertArrayEquals(queen0PositionArr, queen0.getPosition().getPositionArray());
        assertTrue(queen1.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertArrayEquals(queen1.getPosition().getPositionArray(), new int[]{1, 1});
        assertFalse(queen0.move(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(queen0PositionArr, queen0.getPosition().getPositionArray());
        assertTrue(queen1.move(new Position(boardLimit, new int[]{0, 1}), board1));
        assertTrue(queen0.move(new Position(boardLimit, new int[]{7, 0}), board1));
        assertArrayEquals(new int[]{0, 1}, queen1.getPosition().getPositionArray());
        assertArrayEquals(new int[]{7, 0}, queen0.getPosition().getPositionArray());
    }

    @Test
    public void testGetFunctions() {
        assertEquals(queen0.getUserId(), 0);
        assertEquals(queen0.getPieceId(), 2);
        assertEquals(queen1.getUserId(), 1);
        assertEquals(queen1.getPieceId(), 0);
        assertArrayEquals(queen0.getPosition().getPositionArray(), new int[]{0, 0});
        assertArrayEquals(queen1.getPosition().getPositionArray(), new int[]{4, 4});
    }


}