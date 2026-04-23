package com.jose.group.inventorymanagementsystem.dto;

import com.jose.group.inventorymanagementsystem.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private User.Role role;
    private String profilePictureUrl;
    private boolean enabled;
}
