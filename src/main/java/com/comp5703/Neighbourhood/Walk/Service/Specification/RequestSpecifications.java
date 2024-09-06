package com.comp5703.Neighbourhood.Walk.Service.Specification;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class RequestSpecifications {

    // Specification to match status
    public static Specification<Request> statusIs(String status) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("status"), status);
    }

    // Specification to match departure
    public static Specification<Request> hasDeparture(String searchTerm) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("departure")), "%" + searchTerm.toLowerCase() + "%");
    }

    // Specification to match destination
    public static Specification<Request> hasDestination(String searchTerm) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get("destination")), "%" + searchTerm.toLowerCase() + "%");
    }

    // Specification to match start time
    public static Specification<Request> hasStartTime(Date startTime) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("startTime"), startTime);
    }

    // Specification to match arrive time
    public static Specification<Request> hasArriveTime(Date arriveTime) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("arriveTime"), arriveTime);
    }

    // Specification to match user's name or surname
    public static Specification<Request> hasUserNameOrSurname(String searchTerm) {
        return (root, query, criteriaBuilder) -> {
            Join<Request, Users> parentJoin = root.join("parent", JoinType.LEFT);
            return criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(parentJoin.get("name")), "%" + searchTerm.toLowerCase() + "%"),
                    criteriaBuilder.like(criteriaBuilder.lower(parentJoin.get("surname")), "%" + searchTerm.toLowerCase() + "%")
            );
        };
    }
}

