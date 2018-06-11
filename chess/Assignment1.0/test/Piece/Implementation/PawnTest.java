package Piece.Implementation;

import Board.Board;
import Piece.*;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/7/17.
 */
public class PawnTest {
    private Board board1;
    private Piece[] pieces1;
    private int[] boardLimit = new int[] {8,8};
    private Pawn pawn1;
    private Pawn pawn0;
    private Pawn enemyPawn0;
    /**
     * Calls setup function before every test function
     * @throws Exception
     */
    @Before
    public void setUp() throws Exception {
        pawn0 = new Pawn(new Position(boardLimit, new int[] {1,1}), 0, 0);
        pawn1 = new Pawn(new Position(boardLimit, new int[] {2,1}), 0, 1);
        enemyPawn0 = new Pawn(new Position(boardLimit, new int[] {2,2}), 1, 1);
        pieces1 = new Piece[] {pawn0,
                               pawn1,
                               enemyPawn0};
        board1 = new Board(pieces1 , boardLimit);
    }

    @Test
    public void testPieceType() {
        assertEquals(pawn0.getPieceType(), PieceType.PAWN);
    }

    @Test
    public void testCanMove() throws Exception{
        int[] pawn0PositionArr = pawn0.getPosition().getPositionArray();
        int[] pawn1PositionArr = pawn1.getPosition().getPositionArray();
        int[] enemyPawn0PositionArr = enemyPawn0.getPosition().getPositionArray();

        assertFalse(pawn0.canMove(new Position(boardLimit, new int[]{4,4}), board1));
        assertFalse(pawn0.canMove(new Position(boardLimit, new int[]{2,1}), board1));
        assertFalse(pawn0.canMove(new Position(boardLimit, new int[]{0,1}), board1));
        assertFalse(pawn0.canMove(new Position(boardLimit, new int[]{0,2}), board1));
        assertFalse(pawn0.canMove(new Position(new int[]{10,10}, new int[]{9,9}), board1));
        assertFalse(pawn1.canMove(new Position(boardLimit, new int[]{2,3}), board1));
        assertFalse(pawn1.canMove(new Position(boardLimit, new int[]{1,2}), board1));
        assertFalse(pawn1.canMove(new Position(boardLimit, new int[]{2,2}), board1));
        assertFalse(pawn1.canMove(new Position(boardLimit, new int[]{3,2}), board1));
        assertFalse(enemyPawn0.canMove(new Position(boardLimit, new int[]{2,3}), board1));

        assertTrue(pawn0.canMove(new Position(boardLimit, new int[]{2,2}), board1));
        assertTrue(pawn0.canMove(new Position(boardLimit, new int[]{1,2}), board1));
        assertTrue(pawn0.canMove(new Position(boardLimit, new int[]{1,3}), board1));
        assertTrue(enemyPawn0.canMove(new Position(boardLimit, new int[]{1,1}), board1));

        assertArrayEquals(pawn0PositionArr, pawn0.getPosition().getPositionArray());
        assertArrayEquals(pawn1PositionArr, pawn1.getPosition().getPositionArray());
    }

    @Test
    public void testMove() throws Exception{
        int[] pawn0PositionArr = pawn0.getPosition().getPositionArray();
        int[] pawn1PositionArr = pawn1.getPosition().getPositionArray();
        int[] enemyPawn0PositionArr = enemyPawn0.getPosition().getPositionArray();

        assertFalse(pawn0.move(new Position(boardLimit, new int[]{4,4}), board1));
        assertFalse(pawn0.move(new Position(boardLimit, new int[]{2,1}), board1));
        assertFalse(pawn0.move(new Position(boardLimit, new int[]{0,1}), board1));
        assertFalse(pawn0.move(new Position(boardLimit, new int[]{0,2}), board1));
        assertFalse(pawn0.move(new Position(new int[]{10,10}, new int[]{9,9}), board1));
        assertFalse(pawn1.move(new Position(boardLimit, new int[]{2,2}), board1));
        assertFalse(pawn1.move(new Position(boardLimit, new int[]{2,3}), board1));
        assertFalse(pawn1.move(new Position(boardLimit, new int[]{1,2}), board1));
        assertFalse(pawn1.move(new Position(boardLimit, new int[]{3,2}), board1));
        assertFalse(enemyPawn0.move(new Position(boardLimit, new int[]{2,3}), board1));

        assertArrayEquals(pawn0PositionArr, pawn0.getPosition().getPositionArray());
        assertArrayEquals(pawn1PositionArr, pawn1.getPosition().getPositionArray());
        assertArrayEquals(enemyPawn0PositionArr, enemyPawn0.getPosition().getPositionArray());
        assertTrue(pawn0.move(new Position(boardLimit, new int[] {2,2}), board1));
        assertArrayEquals(new int[]{2,2}, pawn0.getPosition().getPositionArray());
        assertFalse(pawn0.move(new Position(new int[] {10,10}, new int[] {9,9}), board1));
        assertTrue(pawn0.move(new Position(boardLimit, new int[] {2,3}), board1));
        assertArrayEquals(new int[]{2,3}, pawn0.getPosition().getPositionArray());
    }

    @Test
    public void testGetFunctions() {
        assertArrayEquals(pawn0.getPosition().getPositionArray(), new int[] {1,1});
        assertArrayEquals(pawn1.getPosition().getPositionArray(), new int[] {2,1});
        assertArrayEquals(enemyPawn0.getPosition().getPositionArray(), new int[]{2,2});
    }


}