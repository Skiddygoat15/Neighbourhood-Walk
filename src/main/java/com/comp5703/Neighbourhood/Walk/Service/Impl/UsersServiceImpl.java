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
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

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
        if (!user.getPhone().matches("^\\d{10,15}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and up to 15 digits");
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
        // 正则表达式定义
        Pattern phonePattern = Pattern.compile("^[0-9]{10,15}$"); // 手机号码必须是10-15位数字
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"); // 邮箱格式验证
        Pattern namePattern = Pattern.compile("^[A-Za-z]+$"); // preferredName 不包含特殊字符

        // 验证和更新允许修改的字段
        if (updatedUser.getPreferredName() != null) {
            if (!namePattern.matcher(updatedUser.getPreferredName()).matches()) {
                throw new IllegalArgumentException("Preferred name cannot contain special characters and numbers.");
            }
            existingUser.setPreferredName(updatedUser.getPreferredName());
        }
        if (updatedUser.getEmail() != null) {
            if (!emailPattern.matcher(updatedUser.getEmail()).matches()) {
                throw new IllegalArgumentException("Invalid email format.");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhone() != null) {
            if (!phonePattern.matcher(updatedUser.getPhone()).matches()) {
                throw new IllegalArgumentException("Phone number must be between 10 and 15 digits.");
            }
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
                    List<Date> availableDates = updatedUser.getAvailableDate();
                    Date currentDate = new Date();

                    // 遍历 availableDates，确保每个日期都在当前时间之后
                    for (Date date : availableDates) {
                        if (date.before(currentDate)) {
                            throw new IllegalArgumentException("All available dates must be later than the current date.");
                        }
                    }

                    // 如果验证通过，更新 availableDate 列表
                    existingUser.setAvailableDate(availableDates);
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

    //byron
    @Override
    public List<Users> searchWalkers(String searchTerm, String gender, String distance, String rating) {
        Specification<Users> spec = Specification.where(UsersSpecifications.hasRole("walker"));

        // 检查 searchTerm 是否为空或仅包含空格
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // 如果搜索条件为空，则返回所有 Walkers
            spec = spec.and(UsersSpecifications.orderByAverageRate());
        } else {
            // 组合 Specification 查询条件
            spec = spec.and(UsersSpecifications.containsAttribute("name", searchTerm)
                            .or(UsersSpecifications.containsAttribute("surname", searchTerm))
                            .or(UsersSpecifications.containsAttribute("preferredName", searchTerm))
                            .or(UsersSpecifications.containsAttribute("gender", searchTerm))
                            .or(UsersSpecifications.containsAttribute("address", searchTerm)))
//                        .or(UsersSpecifications.containsAttribute("availableDate", search)))
                    .and(UsersSpecifications.orderByAverageRate());
        }

        // 添加性别过滤
        if (gender != null && !gender.isEmpty()) {
            spec = spec.and(UsersSpecifications.hasGender(gender));
        }

        // 添加距离过滤（假设距离是某种数值字段或分类字段）
        if (distance != null && !distance.isEmpty()) {
            spec = spec.and(UsersSpecifications.containsAttribute("distance", distance));
        }

        // 添加评分过滤
        if (rating != null && !rating.isEmpty()) {
            spec = spec.and(UsersSpecifications.containsAttribute("rating", rating));
        }

        List<Users> users = usersRepository.findAll(spec);

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No matching users found for the given search criteria.");
        }

        return users;
    }

    @Override
    public Optional<Users> getUserByEmailOrPhone(String emailOrPhone) {
        // 首先根据 Email 查找用户
        Optional<Users> userOptional = usersRepository.findByEmail(emailOrPhone);

        // 如果找不到用户，尝试用 Phone 查找
        if (userOptional.isEmpty()) {
            userOptional = usersRepository.findByPhone(emailOrPhone);
        }

        // 最终返回 Optional<Users>，不论是通过 Email 还是 Phone 查找到的
        return userOptional;
    }

}
