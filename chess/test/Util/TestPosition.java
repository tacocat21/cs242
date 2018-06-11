package Test.Util;

import Util.Position;

import org.junit.Test;
import static junit.framework.Assert.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertArrayEquals;

/**
 * Unit tests for the Position Class
 *
 * @author Taccio Yamamoto <tyamamo2@illinois.edu>
 *         NOTE: The @BeforeClass and @Before were not working for some reason. So, I decided to change to a temporary
 *         solution for now. However, will fix this later.
 */

class TestPosition {
    private static int[] position0Limit = new int[]{8, 8};
    private static int[] position0StartPosition = new int[]{3, 3};
    private static int[] position0TestPosition = new int[]{0, 7};
    private static int[] position0TestFailPosition = new int[]{-1, 4};
    private static Position position0;
    private static int[] position1Limit = new int[]{5, 5};
    private static int[] position1StartPosition = new int[]{4, 4};
    private static int[] position1TestPosition = new int[]{0, 4};
    private static Position position1;

    /*
     * Helper function to initialize the Position objects
     */
    public static void setup() {
        try {
            position0 = new Position(position0Limit, position0StartPosition);
            position1 = new Position(position1Limit, position1StartPosition);
        } catch (Exception e) {
            System.err.println("Caught Exception " + e);
        }
    }

    /*
     * Test checks if the copy constructor properly copies both the position and limit arrays
     */
    @Test
    void testCopyConstructor() {
        setup();
        Position copyPosition = new Position(position0);
        assertArrayEquals(copyPosition.getPositionArray(), position0.getPositionArray());
        assertArrayEquals(copyPosition.getLimit(), position0.getLimit());
    }

    /*
     * Test checks if setPosition changes the position array properly and throws IndexOutOfBoundsException
     */
    @Test
    void testSetPosition() throws Exception {
        setup();
        position0.setPosition(position0TestPosition);
        assertArrayEquals(position0.getPositionArray(), position0TestPosition);
        try {
            position0.setPosition(position0TestFailPosition);
            assertTrue(false);
        } catch (IndexOutOfBoundsException e) {

        }
        position1.setPosition(position0);
        assertArrayEquals(position0.getPositionArray(), position1.getPositionArray());
    }

    /*
     * Test getColumn() function
     */
    @Test
    void testGetColumn() {
        setup();
        assertEquals(position0.getRow(), position0StartPosition[0]);
        assertEquals(position1.getRow(), position1StartPosition[0]);
    }

    /*
     * Test getRow() function
     */
    @Test
    public void testGetRow() throws Exception {
        setup();
        assertEquals(position0.getRow(), position0StartPosition[1]);
        assertEquals(position1.getRow(), position1StartPosition[1]);
    }

    /*
     * Test getPositionArray() function
     */
    @Test
    void testGetPosition() {
        setup();
        assertArrayEquals(position0.getPositionArray(), position0StartPosition);
        assertArrayEquals(position1.getPositionArray(), position1StartPosition);
    }

    /*
     * Test getLimit() functionc
     */
    @Test
    void testGetLimit() {
        setup();
        assertArrayEquals(position0.getLimit(), position0Limit);
        assertArrayEquals(position1.getLimit(), position1Limit);
    }

    /*
     * Tests the isEqual function that returns true if both objects have the same position array
     */
    @Test
    void testIsEqual() throws Exception {
        setup();
        position0.setPosition(position1);
        assertTrue(position0.isEqual(position1));
    }

}