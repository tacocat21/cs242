package Piece.Implementation;

import Board.Board;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/13/17.
 */
public class BishopTest {
    private Board board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private Bishop bishop1;
    private Bishop bishop0;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        bishop0 = new Bishop(new Position(boardLimit, new int[]{0, 0}), 0, 2);
        bishop1 = new Bishop(new Position(boardLimit, new int[]{4, 4}), 1, 0);
        pieces1 = new Piece[]{new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 1),
                bishop0, bishop1};
        board1 = new Board(pieces1, boardLimit);
    }

    @Test
    public void testPieceType() {
        assertEquals(bishop0.getPieceType(), PieceType.BISHOP);
    }

    @Test
    public void testCanMove() throws Exception {
        int[] bishop0PositionArr = bishop0.getPosition().getPositionArray();
        assertFalse(bishop0.canMove(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(bishop0.canMove(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(bishop0.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(bishop0.canMove(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(bishop0PositionArr, bishop0.getPosition().getPositionArray());
        assertTrue(bishop1.canMove(new Position(boardLimit, new int[]{3, 3}), board1));
        assertTrue(bishop1.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
    }

    @Test
    public void testMove() throws Exception {
        int[] bishop0PositionArr = bishop0.getPosition().getPositionArray();
        assertFalse(bishop0.move(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(bishop0.move(new Position(boardLimit, new int[]{0, 1}), board1));
        assertFalse(bishop0.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertArrayEquals(bishop0PositionArr, bishop0.getPosition().getPositionArray());
        assertTrue(bishop1.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertArrayEquals(bishop1.getPosition().getPositionArray(), new int[]{1, 1});
        assertFalse(bishop0.move(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
    }

    @Test
    public void testGetFunctions() {
        assertArrayEquals(bishop0.getPosition().getPositionArray(), new int[]{0, 0});
        assertArrayEquals(bishop1.getPosition().getPositionArray(), new int[]{4, 4});
    }

}