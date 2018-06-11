package Piece.Implementation;

import Piece.Piece;
import Piece.PieceType;
import Util.Direction;
import Util.Position;

import java.util.ArrayList;

/**
 * Class that defines the King chess piece
 *
 * @author Taccio Yamamoto
 */
public class King extends Piece {
    /**
     * Constructor
     *
     * @param startPosition - start position of the piece
     * @param assignUserId  - user identification of the owner of the piece
     * @param assignPieceId - unique id assigned to the piece
     * @throws Exception throws possible exceptions from the initDirections function
     */
    public King(Position startPosition, int assignUserId, int assignPieceId) throws Exception {
        super(startPosition, assignUserId, assignPieceId);
        this.type = PieceType.KING;
    }

    /**
     * Initializes the legal directions of the piece
     *
     * @throws Exception throws exceptions from the Direction constructor
     */
    @Override
    protected void initDirections() throws Exception {
        this.directions = new ArrayList<Direction>(8);
        this.directions.add(new Direction(1, 1, 1));
        this.directions.add(new Direction(1, 0, 1));
        this.directions.add(new Direction(1, -1, 1));
        this.directions.add(new Direction(0, -1, 1));
        this.directions.add(new Direction(-1, -1, 1));
        this.directions.add(new Direction(-1, 0, 1));
        this.directions.add(new Direction(-1, 1, 1));
        this.directions.add(new Direction(0, 1, 1));
    }


}
