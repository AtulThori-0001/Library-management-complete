package com.library.controller;

import com.library.dto.request.ChangePasswordRequest;
import com.library.dto.request.UpdateProfileRequest;
import com.library.dto.response.ApiResponse;
import com.library.dto.response.PageResponse;
import com.library.dto.response.UserResponse;
import com.library.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User/Student management")
public class UserController {

    private final UserService userService;

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get All Students")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Students fetched",
                userService.getAllStudents(keyword, PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get Student by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Student fetched", userService.getStudentById(id)));
    }

    @PutMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update Student")
    public ResponseEntity<ApiResponse<UserResponse>> updateStudent(
            @PathVariable Long id, @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Student updated", userService.updateStudent(id, request)));
    }

    @PutMapping("/students/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate Student")
    public ResponseEntity<ApiResponse<Void>> deactivateStudent(@PathVariable Long id) {
        userService.deactivateStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated"));
    }

    @PutMapping("/students/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate Student")
    public ResponseEntity<ApiResponse<Void>> activateStudent(@PathVariable Long id) {
        userService.activateStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student activated"));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get My Profile")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched",
                userService.updateMyProfile(userDetails.getUsername(), new UpdateProfileRequest())));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update My Profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateMyProfile(userDetails.getUsername(), request)));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Change Password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }
}
