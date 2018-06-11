package Board;

import Board.Implementation.ChessBoard;
import Game.ChessGame;
import Piece.Implementation.*;
import Piece.Piece;
import Util.Position;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/7/17.
 */
public class BoardTest {
    private Piece[] board1Pieces;
    private int[] boardLimit = new int[]{8, 8};
    private ChessBoard board1;
    // Setup to check check and checkmate conditions
    private Piece[] enemyPieces;
    private ArrayList<Piece> enemyList;
    private ChessBoard checkBoard;
    private King checkKing;
    private ChessGame completeGame;
    private ChessBoard completeBoard;

    @Before
    public void setup() throws Exception {
        board1Pieces = new Piece[]{new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{1, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{2, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{3, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{4, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{5, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{6, 1}), 0, 0),
                new Pawn(new Position(boardLimit, new int[]{7, 1}), 0, 0)};
        board1 = new ChessBoard(board1Pieces, boardLimit);
        enemyPieces = new Piece[]{new Pawn(new Position(boardLimit, new int[]{3, 1}), 0, 0),
                new Rook(new Position(boardLimit, new int[]{0, 0}), 0, 0),
                new Bishop(new Position(boardLimit, new int[]{2, 0}), 0, 0),
                new Knight(new Position(boardLimit, new int[]{4, 0}), 0, 0),
                new Queen(new Position(boardLimit, new int[]{5, 0}), 0, 0)};
        enemyList = new ArrayList<Piece>(Arrays.asList(enemyPieces));
        checkBoard = new ChessBoard(enemyPieces, boardLimit);
        checkKing = new King(new Position(boardLimit, new int[]{4, 4}), 1, 0);
        checkBoard.setPiece(checkKing);
        completeBoard = new ChessGame().getBoard();
    }

    @Test
    public void isOutOfBound() throws Exception {
        assertTrue(board1.isOutOfBound(-1, 0));
        assertTrue(board1.isOutOfBound(8, 0));
        assertTrue(board1.isOutOfBound(0, 8));
        assertFalse(board1.isOutOfBound(4, 0));
        assertFalse(board1.isOutOfBound(new Position(boardLimit, new int[]{0, 0})));

    }

    @Test
    public void getPiece() throws Exception {
        Position pawnPosition = board1Pieces[0].getPosition();
        int[] pawnArray = pawnPosition.getPositionArray();
        assertEquals(board1.getPiece(pawnPosition), board1Pieces[0]);
        assertEquals(board1.getPiece(pawnArray[0], pawnArray[1]), board1Pieces[0]);
    }


    @Test
    public void isEmpty() throws Exception {
        assertFalse(board1.isEmpty(new Position(boardLimit, new int[]{0, 1})));
        assertTrue(board1.isEmpty(new Position(boardLimit, new int[]{0, 0})));
    }

    @Test
    public void setPiece() throws Exception {
        Pawn testPawn = new Pawn(new Position(boardLimit, new int[]{0, 0}), 0, 0);
        board1.setPiece(testPawn);
        assertEquals(board1.getPiece(testPawn.getPosition()), testPawn);
    }

//    @Test(expected = Exception.class)
//    public void testSetPieceException() throws Exception {
//        Pawn sameLocationPawn = new Pawn(new Position(boardLimit, new int[]{0, 1}), 0, 0);
//        board1.setPiece(sameLocationPawn);
//    }


    @Test
    public void removePiece() throws Exception {
        assertEquals(board1.removePiece(new Position(boardLimit, new int[]{0, 1})), board1Pieces[0]);
        assertEquals(board1.removePiece(new Position(boardLimit, new int[]{0, 1})), null);
    }

    @Test
    public void check() throws Exception {
//        assertEquals(checkBoard.move(enemyPieces[0], new Position(boardLimit, new int[]{3,3})),null);
        // Rook
        assertEquals(checkBoard.move(enemyPieces[1], new Position(boardLimit, new int[]{0, 4})), null);
        assertTrue(checkBoard.check(checkKing.getPosition(), enemyList));
        assertTrue(checkBoard.isEmpty(new Position(boardLimit, new int[]{0, 0})));
        assertFalse(checkBoard.isEmpty(new Position(boardLimit, new int[]{0, 4})));
        assertEquals(checkBoard.move(enemyPieces[1], new Position(boardLimit, new int[]{0, 0})), null);
        assertFalse(checkBoard.isEmpty(new Position(boardLimit, new int[]{0, 0})));
        assertTrue(checkBoard.isEmpty(new Position(boardLimit, new int[]{0, 4})));

        //Bishop
        assertEquals(checkBoard.move(enemyPieces[2], new Position(boardLimit, new int[]{1, 1})), null);
        assertTrue(checkBoard.check(checkKing.getPosition(), enemyList));
        assertEquals(checkBoard.move(enemyPieces[2], new Position(boardLimit, new int[]{2, 0})), null);

        //Knight
        assertEquals(checkBoard.move(enemyPieces[3], new Position(boardLimit, new int[]{5, 2})), null);
        assertTrue(checkBoard.check(checkKing.getPosition(), enemyList));
        assertEquals(checkBoard.move(enemyPieces[3], new Position(boardLimit, new int[]{4, 0})), null);

        //Queen
        assertEquals(checkBoard.move(enemyPieces[4], new Position(boardLimit, new int[]{4, 1})), null);
        assertTrue(checkBoard.check(checkKing.getPosition(), enemyList));
        assertEquals(checkBoard.move(enemyPieces[4], new Position(boardLimit, new int[]{5, 0})), null);
    }


    @Test
    public void checkMate() throws Exception {
        Rook checkMateRook = new Rook(new Position(boardLimit, new int[]{3, 2}), 0, 0);
        enemyList.add(checkMateRook);
        checkBoard.setPiece(checkMateRook);
        Queen checkMateQueen = new Queen(new Position(boardLimit, new int[]{4, 1}), 0, 0);
        enemyList.add(checkMateQueen);
        checkBoard.setPiece(checkMateQueen);

    }

    @Test
    public void checkMate2() throws Exception {
        Rook checkMateRook = new Rook(new Position(boardLimit, new int[]{3, 2}), 0, 0);
        enemyList.add(checkMateRook);
        checkBoard.setPiece(checkMateRook);
        Queen checkMateQueen = new Queen(new Position(boardLimit, new int[]{4, 5}), 0, 0);
        enemyList.add(checkMateQueen);
        checkBoard.setPiece(checkMateQueen);

    }

    @Test
    public void testMove() throws Exception {
        assertEquals(board1.move(board1Pieces[0], new Position(boardLimit, new int[]{0, 3})), null);
        assertEquals(board1.getPiece(0, 3), board1Pieces[0]);
        assertEquals(board1.getPiece(0, 1), null);
        assertEquals(board1.move(board1Pieces[1], new Position(boardLimit, new int[]{1, 2})), null);
        assertEquals(board1.getPiece(1, 2), board1Pieces[1]);
        assertEquals(board1.getPiece(0, 1), null);
    }

    @Test(expected = Exception.class)
    public void testMoveException() throws Exception {
//        board1.move(board1Pieces[0], board1Pieces[0].getPosition());
        checkBoard.move(enemyPieces[1], enemyPieces[2].getPosition());
    }

    @Test
    public void getBoard() throws Exception {
        Piece[][] boardArray = board1.getBoard();
        assertEquals(boardArray[0][1], board1Pieces[0]);
        assertEquals(boardArray[1][1], board1Pieces[1]);
    }

    @Test
    public void getNumColumns() throws Exception {
        assertEquals(boardLimit[0], board1.getNumColumns());
    }

    @Test
    public void getNumRows() throws Exception {
        assertEquals(boardLimit[1], board1.getNumRows());
    }

    @Test
    public void getLimit() throws Exception {
        assertArrayEquals(boardLimit, board1.getLimit());
    }


}