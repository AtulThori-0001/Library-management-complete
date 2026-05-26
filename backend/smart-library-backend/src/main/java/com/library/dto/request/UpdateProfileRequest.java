package com.library.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    @Email(message = "Invalid email format")
    private String email;
    private String department;
    private Integer semester;
}
