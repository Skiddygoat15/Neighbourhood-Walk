package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.Specification.UsersSpecifications;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RoleService roleService;  // 注入 RoleService

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public Users saveUsers(Users user) {
        return usersRepository.save(user);
    }

    @Override
    public Optional<Users> getUsersByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    @Override
    public Optional<Users> getUsersByPhone(String phone) { return usersRepository.findByPhone(phone); }

    @Override
    public void deleteUsers(long id) {
        usersRepository.deleteById(id);
    }

    @Override
    public List<Users> getAllUsers() {
        return (List<Users>) usersRepository.findAll();
    }

    @Override
    public Users registerUser(Users user, String roleType) {
        // 验证角色是否有效
        if (!roleType.equals("parent") && !roleType.equals("walker") && !roleType.equals("admin")) {
            throw new IllegalArgumentException("Invalid role type: " + roleType);
        }

        // 验证必填字段是否为空
        // 写给自己：注意这里的user.getName等方法并不是在数据库中调用的方法，而是在Users实例中定义的getter方法！
        // 因为此时用户传入了一个user实例，直接通过getter来获取对应信息即可
        if (user.getName() == null || user.getName().isEmpty() ||
                user.getSurname() == null || user.getSurname().isEmpty() ||
                user.getPhone() == null || user.getPhone().isEmpty() ||
                user.getEmail() == null || user.getEmail().isEmpty() ||
                user.getAddress() == null || user.getAddress().isEmpty() ||
                user.getPassword() == null || user.getPassword().isEmpty() ||
                user.getGender() == null || user.getGender().isEmpty() ||
                user.getBirthDate() == null) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // 验证邮箱是否已存在
        if (usersRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // 验证手机号是否已存在
        if (usersRepository.findByPhone(user.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // 验证邮箱格式
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (!(Objects.equals(user.getGender(), "male") || Objects.equals(user.getGender(), "female") || Objects.equals(user.getGender(), "other"))) {
            throw new IllegalArgumentException("Invalid gender");
        }


        // 验证手机号格式
        if (!user.getPhone().matches("^\\d{1,11}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and up to 11 digits");
        }

        // 验证名字和姓氏格式（不包含空格和特殊字符）
        if (!user.getName().matches("^[A-Za-z]+$") || !user.getSurname().matches("^[A-Za-z]+$")) {
            throw new IllegalArgumentException("Name and surname must not contain spaces or special characters");
        }

        // 对密码进行bcrypt加密
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // 保存用户信息到 Users 表
        Users savedUser = usersRepository.save(user);

        // 保存角色信息到 Role 表，并关联到用户
        roleService.saveRole(savedUser.getId(), roleType);

        return savedUser;
    }
    @Override
    public Users updateUserProfile(long userId, Users updatedUser) {
        // 获取用户信息
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        Users existingUser = userOptional.get();

        // 获取用户角色
        List<RoleDTO> roles = roleService.getRolesByUserId(userId);
        boolean isWalker = roles.stream().anyMatch(role -> role.getRoleType().equalsIgnoreCase("walker"));

        // 验证和更新允许修改的字段
        if (updatedUser.getPreferredName() != null) {
            existingUser.setPreferredName(updatedUser.getPreferredName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getCommunicatePref() != null) {
            existingUser.setCommunicatePref(updatedUser.getCommunicatePref());
        }
        if (updatedUser.getProfImgUrl() != null) {
            existingUser.setProfImgUrl(updatedUser.getProfImgUrl());
        }

        // 验证和更新仅允许 Walker 角色修改的字段
        if (updatedUser.getAvailableDate() != null || updatedUser.getSkill() != null) {
            if (isWalker) {
                if (updatedUser.getAvailableDate() != null) {
                    existingUser.setAvailableDate(updatedUser.getAvailableDate());
                }
                if (updatedUser.getSkill() != null) {
                    existingUser.setSkill(updatedUser.getSkill());
                }
            } else {
                throw new IllegalArgumentException("Only users with the 'walker' role can update available dates and skills.");
            }
        }

        // 保存更新后的用户信息
        return usersRepository.save(existingUser);
    }

    @Override
    public Users getUserById(long id) {
        // 确保 Optional 中有值，然后调用 get()
        Users user = null;
        if (usersRepository.findById(id).isPresent()) {
            user = usersRepository.findById(id).get();
        }
        return user;
    }

    @Override
    public boolean hasPublishedRequest(Long userId) {
        // 验证当前用户是否发布了请求
        return requestRepository.existsByParent_UserId(userId);
    }

    //byron
    @Override
    public List<Users> searchWalkers(Long userId, String search) {
        // 检查是否发布了请求
        if (!hasPublishedRequest(userId)) {
            throw new IllegalArgumentException("Only parents who have published a request can search for walkers.");
        }
        // 组合 Specification 查询条件
        Specification<Users> spec = Specification.where(UsersSpecifications.hasRole("walker"))
                .and(UsersSpecifications.containsAttribute("name", search)
                        .or(UsersSpecifications.containsAttribute("surname", search))
                        .or(UsersSpecifications.containsAttribute("preferredName", search))
                        .or(UsersSpecifications.containsAttribute("gender", search))
                        .or(UsersSpecifications.containsAttribute("address", search))
                        .or(UsersSpecifications.containsAttribute("availableDate", search)))
                .and(UsersSpecifications.orderByAverageRate());

        List<Users> users = usersRepository.findAll(spec);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No matching users found for the given search criteria.");
        }

        return users;
    }

}
