package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UsersRepository extends CrudRepository<Users, Long> {
    Optional<Users> findByEmail(String email);

    //byron
    @Query("SELECT u FROM Users u " +
            "JOIN u.roles r " +
            "WHERE r.roleType = 'walker' " +
            "AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.surname) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.gender) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.address) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(FUNCTION('DATE_FORMAT', u.preferredName, '%Y-%m-%d')) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Users> searchWalkers(@Param("search") String search);
}
