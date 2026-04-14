package com.jose.group.inventorymanagementsystem.dto;

import com.jose.group.inventorymanagementsystem.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private User.Role role;
    private MultipartFile profilePicture;
}
