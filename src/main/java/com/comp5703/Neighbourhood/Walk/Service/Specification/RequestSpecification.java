package com.comp5703.Neighbourhood.Walk.Service.Specification;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.data.jpa.domain.Specification;

public class RequestSpecification {

    // Specification to check if an attribute contains a value (case-insensitive)
    // 检查输入和数据库的匹配项
    public static Specification<Request> containsAttribute(String attributeName, String value) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get(attributeName)), "%" + value.toLowerCase() + "%");
    }
}
