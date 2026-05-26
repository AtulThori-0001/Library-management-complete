package com.library.service;

import com.library.dto.request.ChangePasswordRequest;
import com.library.dto.request.UpdateProfileRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.UserResponse;
import org.springframework.data.domain.Pageable;

public interface UserService {
    PageResponse<UserResponse> getAllStudents(String keyword, Pageable pageable);
    UserResponse getStudentById(Long id);
    UserResponse updateStudent(Long id, UpdateProfileRequest request);
    void deactivateStudent(Long id);
    void activateStudent(Long id);
    UserResponse updateMyProfile(String username, UpdateProfileRequest request);
    void changePassword(String username, ChangePasswordRequest request);
}
