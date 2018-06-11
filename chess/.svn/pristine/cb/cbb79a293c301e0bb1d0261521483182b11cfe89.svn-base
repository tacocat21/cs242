package UserInterface;

import Game.ChessGame;
import Piece.Piece;
import Piece.PieceType;
import Util.Position;

import javax.imageio.ImageIO;
import javax.swing.*;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.io.File;

/**
 * User interface for the chess application
 * Code help from: http://stackoverflow.com/questions/21142686/making-a-robust-resizable-swing-chess-gui
 */
public class UserInterface {
    private int NUMCOL = 8;
    private int COLLENGTH = 60;
    private int NUMROW = 8;
    private int ROWLENGTH = 60;
    private JPanel gui = new JPanel(new BorderLayout(3, 3));
    private JPanel chessBoard;
    private PositionButton[][] chessBoardGrid;
    private Image[][] chessPiecesImages = new Image[2][6];
    private PositionButton currentPositionButton = null;
    private ChessGame game;
    private JFrame frame;
    private boolean newGame = true;


    private final JLabel turnMessage = new JLabel("Ready to start the game. White's turn");
    private final JLabel score = new JLabel(" Score 0-0");

    public static final int WHITE = 0, BLACK = 1;
    public static final int QUEEN = 0, KING = 1, ROOK = 2, KNIGHT = 3, BISHOP = 4, PAWN = 5;
    public static final int[] STARTING_ROW = {
            ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK
    };

    /**
     * Default constructor
     */
    public UserInterface() throws Exception {
        this.game = new ChessGame();
        this.chessBoardGrid = new PositionButton[NUMROW][NUMCOL];
        this.createBoard();
    }


    /**
     * Initializes the board user interface
     */
    public void createBoard() throws Exception {
        //Loads the images from the folder
        this.initializeImages();

        //Setup the frame
        gui.setBorder(new EmptyBorder(5, 5, 5, 5));
        JToolBar tools = new JToolBar();
        tools.setFloatable(false);
        gui.add(tools, BorderLayout.PAGE_START);
        //Start the game button
        Action startGameAction = new AbstractAction("Start") {
            @Override
            public void actionPerformed(ActionEvent e) {
                setupBoardPieces();
            }
        };
        // setup the toolbar
        tools.add(startGameAction);
        // Reset the game button
        Action resetGame = new AbstractAction("Restart") {
            @Override
            public void actionPerformed(ActionEvent actionEvent) {
                try {
                    game.resetGame();
                    resetFrame();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };

        // player forfeit game button
        Action forfeitAction = new AbstractAction("Forfeit") {
            @Override
            public void actionPerformed(ActionEvent actionEvent) {
                String winner = game.userForfeit();
                score.setText(game.getScore());
                try {
                    game.resetGame();
                    resetFrame();
                    turnMessage.setText(winner + " wins!");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };
        // add buttons to toolbar
        tools.add(resetGame);
        tools.add(forfeitAction);
        tools.addSeparator();
        tools.add(turnMessage);
        tools.add(score);

        chessBoard = new JPanel(new GridLayout(0, 8)) {
            @Override
            public final Dimension getPreferredSize() {
                return new Dimension(NUMCOL*COLLENGTH, NUMROW*ROWLENGTH);
            }
        };
        chessBoard.setBorder(new CompoundBorder(
                new EmptyBorder(8, 8, 8, 8),
                new LineBorder(Color.BLACK)
        ));

        JPanel boardConstrain = new JPanel(new GridBagLayout());
        boardConstrain.add(chessBoard);
        gui.add(boardConstrain);

        // create the chess board squares
        Insets buttonMargin = new Insets(0, 0, 0, 0);
        for (int xIdx = 0; xIdx < NUMCOL; xIdx++) {
            for (int yIdx = 0; yIdx < NUMROW; yIdx++) {
                PositionButton button = new PositionButton(yIdx, xIdx, this.game.getBoardLimit());
                this.addButtonListener(button);
                button.setMargin(buttonMargin);
                ImageIcon icon = new ImageIcon(
                        new BufferedImage(ROWLENGTH, COLLENGTH, BufferedImage.TYPE_INT_ARGB));
                button.setIcon(icon);
                this.unsetButton(button);
                chessBoardGrid[yIdx][xIdx] = button;
            }
        }

        for (int yIdx = 0; yIdx < NUMROW; yIdx++) {
            for (int xIdx = 0; xIdx < NUMCOL; xIdx++) {
                chessBoard.add(chessBoardGrid[xIdx][yIdx]);
            }
        }

    }

    /**
     * Resets the user interface to the initial position
     */
    public void resetFrame() {
        this.newGame = true;
        for (int xIdx = 0; xIdx < NUMCOL; xIdx++) {
            for (int yIdx = 0; yIdx < NUMCOL; yIdx++) {
                chessBoardGrid[xIdx][yIdx].setIcon(new ImageIcon(
                        new BufferedImage(ROWLENGTH, COLLENGTH, BufferedImage.TYPE_INT_ARGB)));
            }
        }
        this.setupBoardPieces();
        this.frame.repaint();
        this.turnMessage.setText("White's turn.");
    }

    /**
     * @return the gui object
     */
    public final JComponent getGui() {
        return gui;
    }

    /**
     * Initializes frame parameters
     */
    public void initializeFrame() {
        this.frame = new JFrame("Chess");
        this.frame.add(this.getGui());
        // Ensures JVM closes after frame(s) closed and
        // all non-daemon threads are finished
        this.frame.setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        // See http://stackoverflow.com/a/7143398/418556 for demo.
        this.frame.setLocationByPlatform(true);

        // ensures the frame is the minimum size it needs to be
        // in order display the components within it
        this.frame.pack();
        // ensures the minimum size is enforced.
        this.frame.setMinimumSize(this.frame.getSize());
        this.frame.setVisible(true);

    }

    /**
     * Adds button interaction
     * @param button button to add listeners
     */
    public void addButtonListener(PositionButton button) {
        button.addActionListener(new ActionListener() {
            /**
             * Defines action performed when clicking the button
             * @param actionEvent
             */
            @Override
            public void actionPerformed(ActionEvent actionEvent) {
                try {
                    if (game.isInCheckMate()) {
                        String winner = game.getUserStringFromTurn();
                        turnMessage.setText("Checkmate! " + winner + " wins!");
                        if(newGame){
                            if (winner.equals("White")) {
                                game.win(0);
                            } else {
                                game.win(1);
                            }
                        }
                        newGame = false;
                        score.setText(game.getScore());
                    } else if (game.isInCheck()) {
                        String currentUser = game.getOpponentStringFromTurn();
                        turnMessage.setText(currentUser + " is in check!");
                        checkCommand(button);
                    } else {
                        buttonCommand(button);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }

            }

            /**
             * Helper function to move the pieces
             * @param button - button to add functionality
             */
            public void buttonCommand(PositionButton button) {
                int[] currentPositionArray = button.getPosition().getPositionArray();

                if (currentPositionButton == null) {
                    currentPositionButton = button;
                    setButton(button);
                } else if (currentPositionButton.getPosition().isEqual(button.getPosition())) {
                    unsetButton(button);
                    currentPositionButton = null;
                } else {
                    Position targetPosition = button.getPosition();
                    try {
                        boolean moveResult = game.move(currentPositionButton.getPosition(), targetPosition);
                        unsetButton(currentPositionButton);
                        unsetButton(button);
                        if (moveResult) {
                            moveImage(currentPositionButton.getPosition(), targetPosition);
                            game.nextTurn();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    currentPositionButton = null;
                }
            }

            /**
             * Helper function when king is in check
             * @param button button to add functionality
             */
            public void checkCommand(PositionButton button) {
                if (currentPositionButton == null || currentPositionButton.getPosition().isEqual(button.getPosition())) {
                    buttonCommand(button);
                } else {
                    try {
                        Position targetPosition = button.getPosition();
                        boolean moveResult = game.move(currentPositionButton.getPosition(), targetPosition);
                        if (game.isInCheck()) {
                            throw new Exception("Still in check");
                        }
                        unsetButton(currentPositionButton);
                        unsetButton(button);
                        if (moveResult) {
                            moveImage(currentPositionButton.getPosition(), targetPosition);
                            game.nextTurn();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });
    }


    /**
     * Changes the color of the button
     *
     * @param button button to change color
     */
    public void setButton(PositionButton button) {
        button.setBackground(Color.yellow);
    }

    /**
     * Restore Button to default color
     * @param button button to change color
     */
    public void unsetButton(PositionButton button) {
        int[] buttonPosition = button.getPosition().getPositionArray();
        if ((buttonPosition[1] % 2 == 1 && buttonPosition[0] % 2 == 1)
                || (buttonPosition[1] % 2 == 0 && buttonPosition[0] % 2 == 0)) {
            button.setBackground(Color.WHITE);
        } else {
            button.setBackground(Color.BLUE);
        }

    }

    /**
     * Moves the image from currentPosition to targetPosition
     *
     * @param currentPosition
     * @param targetPosition
     */
    public void moveImage(Position currentPosition, Position targetPosition) {

        this.turnMessage.setText(this.game.getUserStringFromTurn() + "'s turn");
        int[] currentPositionArray = currentPosition.getPositionArray();
        PositionButton currentPositionButton = this.chessBoardGrid[currentPositionArray[0]][currentPositionArray[1]];
        Icon currentIcon = currentPositionButton.getIcon();
        int[] targetPositionArray = targetPosition.getPositionArray();
        PositionButton targetPositionButton = this.chessBoardGrid[targetPositionArray[0]][targetPositionArray[1]];
        targetPositionButton.setIcon(currentIcon);
        ImageIcon icon = new ImageIcon(
                new BufferedImage(ROWLENGTH, COLLENGTH, BufferedImage.TYPE_INT_ARGB));
        currentPositionButton.setIcon(icon);
        this.frame.repaint();
    }

    /**
     * Places the pieces on the board
     */
    private void setupBoardPieces() {
        for (Piece piece : this.game.getWhitePieces()) {
            Image pieceImage = this.getImage(piece);
            int[] piecePositionArray = piece.getPosition().getPositionArray();
            chessBoardGrid[piecePositionArray[0]][piecePositionArray[1]].setIcon(new ImageIcon(pieceImage));
        }

        for (Piece piece : this.game.getBlackPieces()) {
            Image pieceImage = this.getImage(piece);
            int[] piecePositionArray = piece.getPosition().getPositionArray();
            chessBoardGrid[piecePositionArray[0]][piecePositionArray[1]].setIcon(new ImageIcon(pieceImage));
        }
    }

    /**
     * Gets a corresponding image given the piece
     *
     * @param piece
     */
    private Image getImage(Piece piece) {
        PieceType type = piece.getPieceType();
        switch (type) {
            case PAWN:
                return chessPiecesImages[piece.getUserId()][PAWN];
            case ROOK:
                return chessPiecesImages[piece.getUserId()][ROOK];
            case KNIGHT:
                return chessPiecesImages[piece.getUserId()][KNIGHT];
            case BISHOP:
                return chessPiecesImages[piece.getUserId()][BISHOP];
            case QUEEN:
                return chessPiecesImages[piece.getUserId()][QUEEN];
            case KING:
                return chessPiecesImages[piece.getUserId()][KING];
        }
        return null;
    }

    /**
     * Loads images from the chessPiecesImage folder
     */
    private void initializeImages() throws Exception {
        try {
            chessPiecesImages[WHITE][ROOK] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whiteRook.png"));
            chessPiecesImages[WHITE][BISHOP] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whiteBishop.png"));
            chessPiecesImages[WHITE][KNIGHT] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whiteKnight.png"));
            chessPiecesImages[WHITE][QUEEN] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whiteQueen.png"));
            chessPiecesImages[WHITE][KING] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whiteKing.png"));
            chessPiecesImages[WHITE][PAWN] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/whitePawn.png"));

            chessPiecesImages[BLACK][ROOK] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackRook.png"));
            chessPiecesImages[BLACK][BISHOP] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackBishop.png"));
            chessPiecesImages[BLACK][KNIGHT] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackKnight.png"));
            chessPiecesImages[BLACK][QUEEN] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackQueen.png"));
            chessPiecesImages[BLACK][KING] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackKing.png"));
            chessPiecesImages[BLACK][PAWN] = ImageIO.read(new File("./src/UserInterface/chessPiecesImage/blackPawn.png"));
        } catch (Exception e) {
            throw new Exception("Unable to load chess images");
        }
    }


    public static void main(String args[]) {
        // Default board configuration

        Runnable r = new Runnable() {

            @Override
            public void run() {
                try {

                    UserInterface cg = new UserInterface();
                    cg.initializeFrame();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        };

        SwingUtilities.invokeLater(r);

    }
}
