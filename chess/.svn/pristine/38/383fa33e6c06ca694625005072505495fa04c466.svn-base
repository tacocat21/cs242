package Game;

import Util.Position;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by taccio on 2/20/17.
 */
public class ChessGameTest {
    private ChessGame game;
    @Before
    public void setUp() throws Exception {
        game = new ChessGame();
    }

    @Test
    public void testCheck() throws Exception {
        Position pawnPosition = new Position(game.getBoardLimit(), new int[]{4,1} );
        Position newPawnPosition = new Position(game.getBoardLimit(), new int[]{4,3} );
        assertTrue(game.move(pawnPosition, newPawnPosition));
        User currentUser = game.getUserFromTurn();
        User opponentUser = game.getOpponentFromTurn();
        assertFalse(game.getBoard().check(currentUser.getKing().getPosition(), opponentUser.getLivePieces()));
    }
}