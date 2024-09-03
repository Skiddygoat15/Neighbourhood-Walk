package com.comp5703.Neighbourhood.Walk.Service.Specification;


import com.comp5703.Neighbourhood.Walk.Entities.Users;
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
    public static Specification<Users> hasRole(String roleType) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.join("roles").get("roleType"), roleType);
    }

    // Specification to check if an attribute contains a value (case-insensitive)
    public static Specification<Users> containsAttribute(String attributeName, String value) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(criteriaBuilder.lower(root.get(attributeName)), "%" + value.toLowerCase() + "%");
    }
}
