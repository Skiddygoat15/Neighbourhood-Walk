package com.comp5703.Neighbourhood.Walk.Service.Specification;

import com.comp5703.Neighbourhood.Walk.Entities.Comment;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public class UsersSpecifications {

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
