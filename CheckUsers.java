import java.sql.*;

public class CheckUsers {
    public static void main(String[] args) throws Exception {
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/inventory_management_db?useSSL=false&serverTimezone=UTC", "root", "");
        Statement stmt = conn.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT username, role FROM users");
        while (rs.next()) {
            System.out.println(rs.getString("username") + " : " + rs.getString("role"));
        }
        conn.close();
    }
}
