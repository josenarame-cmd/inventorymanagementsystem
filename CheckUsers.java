import java.sql.*;

public class CheckUsers {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/inventory_management_db";
        String user = "root";
        String password = ""; // Assuming default root password is empty as per prev setup

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connected to the database!");
            String query = "SELECT id, username, role, email FROM users";
            try (Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {
                while (rs.next()) {
                    System.out.println("ID: " + rs.getInt("id") + 
                                       ", Username: " + rs.getString("username") + 
                                       ", Role: " + rs.getString("role") +
                                       ", Email: " + rs.getString("email"));
                }
            }
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        }
    }
}
