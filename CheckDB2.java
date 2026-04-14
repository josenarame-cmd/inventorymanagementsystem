import java.sql.*;

public class CheckDB2 {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/inventory_management_db?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pwd = "";

        try (Connection conn = DriverManager.getConnection(url, user, pwd);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT id, username, password, role FROM users")) {

            System.out.println("USERS TABLE contents:");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + 
                                   ", USERNAME: " + rs.getString("username") + 
                                   ", ROLE: " + rs.getString("role") +
                                   ", PWD: " + rs.getString("password"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
