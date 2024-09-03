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
    /*
    LOWER()是转换成小写，实现不区分大小写的搜索
    LIKE CONCAT('%', :search, '%'): 实现模糊匹配，% 代表任意数量的字符
    CONCAT 函数会将 % 添加到 search 字符串的前后，从而实现对字段内容的部分匹配
    FUNCTION('DATE_FORMAT', u.preferredName, '%Y-%m-%d'):
    使用 DATE_FORMAT 函数将日期字段格式化为字符串，以便在日期字段上进行文本匹配
    如果日期字段格式不同，可能需要调整 DATE_FORMAT 函数的格式化规则

    根据输入的search字符串匹配walkers的name，surname，gender，address，prefferedTime
    */
    @Query("SELECT u FROM Users u " +
            "JOIN u.roles r " +
            "WHERE r.roleType = 'walker' " +
            "AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.surname) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.gender) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(u.address) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(FUNCTION('DATE_FORMAT', u.availableDate, '%Y-%m-%d')) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Users> searchWalkers(@Param("search") String search);
}

