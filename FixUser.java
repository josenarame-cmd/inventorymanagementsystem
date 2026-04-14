import java.sql.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class FixUser {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/inventory_management_db?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String pwd = "";

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPwd = encoder.encode("admin123");

        try (Connection conn = DriverManager.getConnection(url, user, pwd);
             PreparedStatement pstmt = conn.prepareStatement("UPDATE users SET role = 'ADMIN', password = ? WHERE username = 'admin'")) {
            
            pstmt.setString(1, hashedPwd);
            int rows = pstmt.executeUpdate();
            System.out.println("Updated " + rows + " row(s). Admin account should be restored to ADMIN and admin123!");

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
