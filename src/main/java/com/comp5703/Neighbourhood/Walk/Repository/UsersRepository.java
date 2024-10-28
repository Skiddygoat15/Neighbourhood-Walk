package com.comp5703.Neighbourhood.Walk.Repository;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.repository.*;

import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
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
    @Modifying
    @Transactional
    @Query("UPDATE Users u SET u.phone = :phone, u.password = :password, u.address = :address, u.latitude = :latitude, u.longitude = :longitude, u.birthDate = :birthDate, u.gender = :gender, u.profileCompleted = :profileCompleted WHERE u.userId = :userId")
    int updateUserAuth(@Param("userId") Long userId,
                       @Param("phone") String phone,
                       @Param("password") String password,
                       @Param("address") String address,
                       @Param("latitude") Double latitude,
                       @Param("longitude") Double longitude,
                       @Param("birthDate") Date birthDate,
                       @Param("gender") String gender,
                       @Param("profileCompleted") Boolean profileCompleted);

    @Query("UPDATE Users u SET u.profImgUrl = :url WHERE u.userId = :userId")
    int updateUserImage(@Param("url") String url, @Param("userId") Long userId);

    long countByActivityStatus(String status);
}
