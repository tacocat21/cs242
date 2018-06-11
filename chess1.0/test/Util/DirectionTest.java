package Util;

import Board.Board;
import Piece.Implementation.Bishop;
import Piece.Implementation.Pawn;
import Piece.Piece;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/12/17.
 */
public class DirectionTest {
    private static int[] direction1Arr;
    private static Position beginPos;
    private static Position endPos;
    private Direction direction1;
    private static int[] direction2Arr;
    private Direction direction2;
    private Pawn testPawn0;
    private Bishop testBishop0;
    private Board board1;
    private Direction bishopToPawn;

    /**
     * Initializes all of the test variables so the test functions can test them
     *
     * @throws Exception
     */
    private void setup() throws Exception {
        direction1Arr = new int[]{1, 1};
        int[] limit = new int[]{8, 8};
        beginPos = new Position(limit, new int[]{0, 0});
        endPos = new Position(limit, new int[]{7, 7});
        direction1 = new Direction(direction1Arr, -1);
        direction2Arr = new int[]{-1, -1};
        direction2 = new Direction(direction2Arr, -1);
        testPawn0 = new Pawn(new Position(new int[]{8, 8}, new int[]{2, 2}), 0, 0);
        testBishop0 = new Bishop(new Position(new int[]{8, 8}, new int[]{0, 0}), 1, 0);
        Piece[] piece_array = new Piece[]{testPawn0, testBishop0};
        board1 = new Board(piece_array, new int[]{8, 8});
        bishopToPawn = new Direction(testBishop0.getPosition(), testPawn0.getPosition(), -1);
    }

    /**
     * Tests different constructors
     *
     * @throws Exception
     */
    @Test
    public void testConstructors() throws Exception {
        setup();
        Direction copyDirection = new Direction(direction1);
        Direction positionDirection = new Direction(beginPos, endPos, 1);
        assertArrayEquals(copyDirection.getDirection(), direction1.getDirection());
        assertArrayEquals(positionDirection.getDirection(), direction1.getDirection());
        assertArrayEquals(bishopToPawn.getDirection(), new int[]{1, 1});
    }

    /**
     * Tests the getDirection method
     *
     * @throws Exception
     */
    @Test
    public void getDirection() throws Exception {
        setup();
        assertArrayEquals(direction1.getDirection(), direction1Arr);
    }

    /**
     * Tests different methods of setDirection
     *
     * @throws Exception
     */
    @Test
    public void setDirection() throws Exception {
        setup();
        int[] testDirectionArr = new int[]{-2, 3};
        direction1.setDirection(direction2);
        direction2.setDirection(testDirectionArr);
        assertArrayEquals(direction1.getDirection(), direction2Arr);
        assertArrayEquals(direction2.getDirection(), testDirectionArr);
        direction2.setDirection(beginPos, endPos);
        assertArrayEquals(direction2.getDirection(), direction1Arr);
    }

    /**
     * Tests equals() function
     *
     * @throws Exception
     */
    @Test
    public void equals() throws Exception {
        setup();
        Direction positionDirection = new Direction(beginPos, endPos, -1);
        assertTrue(direction1.equals(positionDirection));
    }

    @Test
    public void moveByDirection() throws Exception {
        setup();
    }

    /**
     * @throws Exception
     */
    @Test
    public void canMove() throws Exception {
        setup();
        Position testPosition1 = new Position(testBishop0.getPosition());
        assertTrue(bishopToPawn.canMoveInDirection(testBishop0.getPosition(), testPawn0.getPosition(), board1));
        assertArrayEquals(testPosition1.getPositionArray(), testBishop0.getPosition().getPositionArray());
        assertFalse(bishopToPawn.canMoveInDirection(testBishop0.getPosition(), new Position(new int[]{8, 8}, new int[]{4, 4}), board1));
        assertFalse(bishopToPawn.canMoveInDirection(testBishop0.getPosition(), new Position(new int[]{8, 8}, new int[]{4, 0}), board1));
    }

}