package com.library.service.impl;

import com.library.dto.request.ChangePasswordRequest;
import com.library.dto.request.UpdateProfileRequest;
import com.library.dto.response.PageResponse;
import com.library.dto.response.UserResponse;
import com.library.entity.Role;
import com.library.entity.User;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.UserRepository;
import com.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public PageResponse<UserResponse> getAllStudents(String keyword, Pageable pageable) {
        Page<User> page = (keyword != null && !keyword.isBlank())
                ? userRepository.searchByRoleAndKeyword(Role.ROLE_STUDENT, keyword, pageable)
                : userRepository.findByRole(Role.ROLE_STUDENT, pageable);
        return toPageResponse(page);
    }

    @Override
    public UserResponse getStudentById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateStudent(Long id, UpdateProfileRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        applyProfileUpdates(user, request);
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deactivateStudent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void activateStudent(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        user.setIsActive(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        applyProfileUpdates(user, request);
        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new BadRequestException("New password and confirm password do not match");
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword()))
            throw new BadRequestException("Current password is incorrect");
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    private void applyProfileUpdates(User user, UpdateProfileRequest r) {
        if (r.getFirstName() != null) user.setFirstName(r.getFirstName());
        if (r.getLastName() != null) user.setLastName(r.getLastName());
        if (r.getPhone() != null) user.setPhone(r.getPhone());
        if (r.getAddress() != null) user.setAddress(r.getAddress());
        if (r.getEmail() != null) {
            if (!r.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(r.getEmail()))
                throw new BadRequestException("Email is already in use");
            user.setEmail(r.getEmail());
        }
        if (r.getDepartment() != null) user.setDepartment(r.getDepartment());
        if (r.getSemester() != null) user.setSemester(r.getSemester());
    }

    private PageResponse<UserResponse> toPageResponse(Page<User> page) {
        return PageResponse.<UserResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber()).size(page.getSize())
                .totalElements(page.getTotalElements()).totalPages(page.getTotalPages())
                .last(page.isLast()).first(page.isFirst()).build();
    }

    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId()).username(user.getUsername()).email(user.getEmail())
                .firstName(user.getFirstName()).lastName(user.getLastName())
                .phone(user.getPhone()).address(user.getAddress()).role(user.getRole())
                .profileImage(user.getProfileImage()).isActive(user.getIsActive())
                .studentId(user.getStudentId()).department(user.getDepartment())
                .semester(user.getSemester()).createdAt(user.getCreatedAt()).build();
    }
}
