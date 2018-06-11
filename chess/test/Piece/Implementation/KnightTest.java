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
public class KnightTest {
    private ChessBoard board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private Knight knight0;
    private Knight knight1;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        knight0 = new Knight(new Position(boardLimit, new int[]{0, 0}), 0, 2);
        knight1 = new Knight(new Position(boardLimit, new int[]{3, 3}), 1, 0);
        pieces1 = new Piece[]{new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 1),
                new Pawn(new Position(boardLimit, new int[]{5, 4}), 0, 3),
                knight0, knight1};
        board1 = new ChessBoard(pieces1, boardLimit);
    }

    @Test
    public void testPieceType() {
        assertEquals(knight0.getPieceType(), PieceType.KNIGHT);
    }

    @Test
    public void testCanMove() throws Exception {
        int[] knight0PositionArr = knight0.getPosition().getPositionArray();
        int[] knight1PositionArr = knight1.getPosition().getPositionArray();
        assertFalse(knight0.canMove(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(knight0.canMove(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(knight0.canMove(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(knight0PositionArr, knight0.getPosition().getPositionArray());
        assertTrue(knight1.canMove(new Position(boardLimit, new int[]{5, 4}), board1));
        assertArrayEquals(knight1PositionArr, knight1.getPosition().getPositionArray());
        assertTrue(knight1.canMove(new Position(boardLimit, new int[]{1, 2}), board1));
        assertTrue(knight0.canMove(new Position(boardLimit, new int[]{1, 2}), board1));
        assertTrue(knight0.canMove(new Position(boardLimit, new int[]{2, 1}), board1));
        assertTrue(knight1.canMove(new Position(boardLimit, new int[]{2, 1}), board1));
        assertTrue(knight1.canMove(new Position(boardLimit, new int[]{2, 5}), board1));
        assertArrayEquals(knight0PositionArr, knight0.getPosition().getPositionArray());
        assertArrayEquals(knight1PositionArr, knight1.getPosition().getPositionArray());
    }

    @Test
    public void testMove() throws Exception {
        int[] knight0PositionArr = knight0.getPosition().getPositionArray();
        int[] knight1PositionArr = knight1.getPosition().getPositionArray();
        assertFalse(knight0.move(new Position(boardLimit, new int[]{4, 4}), board1));
        assertFalse(knight1.move(new Position(boardLimit, new int[]{1, 1}), board1));
        assertFalse(knight0.move(new Position(new int[]{10, 10}, new int[]{9, 9}), board1));
        assertArrayEquals(knight0PositionArr, knight0.getPosition().getPositionArray());
        assertArrayEquals(knight1PositionArr, knight1.getPosition().getPositionArray());
        assertTrue(knight1.move(new Position(boardLimit, new int[]{5, 4}), board1));
        board1.removePiece(new Position(boardLimit, new int[]{5, 4}));
        board1.setPiece(knight1);
        assertArrayEquals(new int[]{5, 4}, knight1.getPosition().getPositionArray());
        board1.removePiece(new Position(boardLimit, new int[]{3, 3}));
        assertTrue(knight1.move(new Position(boardLimit, new int[]{3, 3}), board1));
        assertArrayEquals(new int[]{3, 3}, knight1.getPosition().getPositionArray());
        assertTrue(knight0.move(new Position(boardLimit, new int[]{2, 1}), board1));
        assertArrayEquals(new int[]{2, 1}, knight0.getPosition().getPositionArray());
    }

    @Test
    public void testGetFunctions() {
        assertArrayEquals(knight0.getPosition().getPositionArray(), new int[]{0, 0});
        assertArrayEquals(knight1.getPosition().getPositionArray(), new int[]{3, 3});
    }
}