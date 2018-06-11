package Piece.Implementation;


import Board.Implementation.ChessBoard;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/14/17.
 */
public class KingTest {
    private ChessBoard board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[]{8, 8};
    private Pawn pawn;
    private King king;

    /**
     * Calls setup function before every test function
     *
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        pawn = new Pawn(new Position(boardLimit, new int[]{0, 0}), 0, 0);
        king = new King(new Position(boardLimit, new int[]{1, 1}), 1, 0);
        pieces1 = new Piece[]{pawn, king};
        board1 = new ChessBoard(pieces1, boardLimit);
    }

    @Test
    public void testPieceType() {
        assertEquals(king.getPieceType(), PieceType.KING);
    }

    @Test
    public void testCanMove() throws Exception {
        int[] kingPositionArr = king.getPosition().getPositionArray();
        assertTrue(king.canMove(new Position(boardLimit, new int[]{0, 0}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{0, 1}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{0, 2}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{1, 2}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{2, 2}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{2, 1}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{0, 2}), board1));
        assertTrue(king.canMove(new Position(boardLimit, new int[]{0, 1}), board1));

        assertArrayEquals(kingPositionArr, king.getPosition().getPositionArray());
    }

    @Test
    public void testMove() throws Exception {

    }

    @Test
    public void testGetFunctions() {
        assertArrayEquals(pawn.getPosition().getPositionArray(), new int[]{0, 0});
    }
}