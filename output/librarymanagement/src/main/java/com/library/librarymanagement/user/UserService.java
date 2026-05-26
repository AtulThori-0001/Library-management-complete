package com.library.librarymanagement.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.library.librarymanagement.util.JwtUtil;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER USER
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        return userRepository.save(user);
    }

    // LOGIN + JWT TOKEN
    public String verifyUser(User user) {
        User dbUser = userRepository.findByUsername(user.getUsername()).orElse(null);

        if (dbUser == null) {
            return "User not found";
        }

        if (passwordEncoder.matches(user.getPassword(), dbUser.getPassword())) {
            return JwtUtil.generateToken(dbUser.getUsername());
        }

        return "Invalid credentials";
    }
}
