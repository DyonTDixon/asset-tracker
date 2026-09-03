package com.ledger.server.repository;

import com.ledger.server.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//Queries the users table to look up credentials during login (findByEmail) and checks for duplicates during sign-up (existsByEmail).

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
