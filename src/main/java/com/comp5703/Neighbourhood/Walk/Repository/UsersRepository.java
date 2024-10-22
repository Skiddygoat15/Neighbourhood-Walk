package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.*;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long>, JpaSpecificationExecutor<Users> {
    Optional<Users> findByEmail(String email);
    Optional<Users> findByPhone(String phone);

//    @Override
//    Users getById(Long aLong);
    @Query("SELECT u FROM Users u WHERE u.userId = :userId")
    Users findUserByUserId(@Param("userId") Long userId);
    @Query("SELECT u.activityStatus FROM Users u WHERE u.userId = :userId")
    String findActivityStatusByUserId(@Param("userId") Long userId);

    long countByActivityStatus(String status);
}
