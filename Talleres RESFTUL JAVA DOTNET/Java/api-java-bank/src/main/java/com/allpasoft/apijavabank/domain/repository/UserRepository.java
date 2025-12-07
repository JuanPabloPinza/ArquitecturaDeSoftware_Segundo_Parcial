package com.allpasoft.apijavabank.domain.repository;

import com.allpasoft.apijavabank.domain.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String identifier);
    List<User> findAll();
    User save(User user);
    void deleteById(Long id);
}
