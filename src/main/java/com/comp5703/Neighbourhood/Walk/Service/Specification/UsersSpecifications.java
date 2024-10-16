package com.comp5703.Neighbourhood.Walk.Service.Specification;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class UsersSpecifications {

    /*
    root：代表查询的根实体，在这里是 Users，表示查询操作将作用于这个实体。
    query：代表查询对象，可以用于自定义查询行为（例如排序）。
    criteriaBuilder：用于构建查询条件的对象。
    root.join("roles")：表示对 Users 实体的 roles 属性进行关联。
    roles 是 Users 实体中的一个属性，表示与 Role 实体之间的关系（@OneToMany 关系）。
    在 Users 实体的 roles 集合上进行连接，访问 Role 实体的 roleType 字段。
    criteriaBuilder.equal(...)：生成一个等式条件，检查 roleType 是否等于传入的 roleType 参数。
     */
    // Specification to filter by role type
    // Confirm the user identity type
    public static Specification<Users> hasRole(String roleType) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.join("roles").get("roleType"), roleType);
    }

    // Specification to filter by gender
    public static Specification<Users> hasGender(String gender) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("gender"), gender);
    }

    // Specification to filter users by average rating greater than or equal to the given value
    public static Specification<Users> hasAvgUserRatingGreaterThanOrEqual(double avgUserRating) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.greaterThanOrEqualTo(root.get("avgUserRating"), avgUserRating);
    }

    // Specification to check if an attribute contains a value (case-insensitive)
    // Check the match between the input and the database
    public static Specification<Users> containsAttribute(String attributeName, String value) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get(attributeName)), "%" + value.toLowerCase() + "%");
    }

    // Specification to order by average rate in Comment
    // Sort by user average rating
    public static Specification<Users> orderByAverageRate() {
        return (root, query, criteriaBuilder) -> {
            // Make sure query is not null before using groupBy and orderBy
            if (query != null) {
                // Group by userId to calculate the average rate
                query.groupBy(root.get("userId"));
                // Order by the average rate in descending order
                query.orderBy(criteriaBuilder.desc(root.get("avgUserRating")));
            }
            // Return null as no additional where clause is needed
            return null;
        };
    }
}
