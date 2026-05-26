package com.library.dto.response;

import com.library.entity.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private Role role;
    private String profileImage;
    private Boolean isActive;
    private String studentId;
    private String department;
    private Integer semester;
    private LocalDateTime createdAt;
}
