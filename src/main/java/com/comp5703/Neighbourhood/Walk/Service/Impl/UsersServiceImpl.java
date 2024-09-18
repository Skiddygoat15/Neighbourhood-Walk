package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.RoleDTO;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileDTO;
import com.comp5703.Neighbourhood.Walk.Entities.UserProfileNotification;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.RoleService;
import com.comp5703.Neighbourhood.Walk.Service.Specification.UsersSpecifications;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import com.comp5703.Neighbourhood.Walk.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RoleService roleService;  // 注入 RoleService

    @Autowired
    private UserProfileNotificationService notificationService;

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
    public Optional<Map<String, String>> getUserNamesById(long id) {
        return usersRepository.findById(id)
                .map(user -> {
                    Map<String, String> userMap = new HashMap<>();
                    userMap.put("name", user.getName());
                    userMap.put("preferredName", user.getPreferredName());
                    return userMap;
                });
    }

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
        if (!roleType.equals("parent") && !roleType.equals("walker")) {
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

        // 验证生日不能早于当前系统时间
        Date currentDate = new Date(); // 获取当前系统时间
        if (user.getBirthDate().after(currentDate)) {
            throw new IllegalArgumentException("Birthdate cannot be in the future.");
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
        if (!user.getPhone().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and 10 digits");
        }

        // 验证名字和姓氏格式（不包含空格和特殊字符）
        if (!user.getName().matches("^[A-Za-z]+$") || !user.getSurname().matches("^[A-Za-z]+$")) {
            throw new IllegalArgumentException("Name and surname must not contain spaces or special characters");
        }

        // 验证密码长度必须大于6
        if (user.getPassword().length() <= 6) {
            throw new IllegalArgumentException("The password length must be at least 6 characters.");
        }

        // 对密码进行bcrypt加密
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        // 保存用户信息到 Users 表
        Users savedUser = usersRepository.save(user);

        // 保存角色信息到 Role 表，并关联到用户
        roleService.saveRole(savedUser.getId(), roleType);

        // 添加通知信息
        UserProfileNotification notification = new UserProfileNotification(
                savedUser,
                "You have successfully registered",
                "We're thrilled to welcome you! Feel free to explore the app and its features.",
                new Date());
        notificationService.saveUserProfileNotification(notification);

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
        Pattern phonePattern = Pattern.compile("^[0-9]{10}$");
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
                throw new IllegalArgumentException("Phone number must be 10 digits.");
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

                    // 验证 availableDates 长度必须为 2 才进行日期比较
                    if (availableDates.size() >= 2) {
                        Date startDate = availableDates.get(0);
                        Date endDate = availableDates.get(1);

                        // 确保 startDate 和 endDate 都在当前时间之后
                        if (startDate.before(currentDate) || endDate.before(currentDate)) {
                            throw new IllegalArgumentException("Start date and end date must be later than the current date.");
                        }

                        // 确保 endDate 在 startDate 之后
                        if (endDate.before(startDate)) {
                            throw new IllegalArgumentException("End date must be after the start date.");
                        }
                    } else {
                        throw new IllegalArgumentException("Available dates must include both start date and end date.");
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
        Users savedUser = usersRepository.save(existingUser);

        // 添加通知信息
        UserProfileNotification notification = new UserProfileNotification(
                savedUser,
                "Profile Updated",
                "You've just updated your profile. Please check it out in your account settings.",
                new Date());
        notificationService.saveUserProfileNotification(notification);

        return savedUser;
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
    public UserProfileDTO getUserProfileById(long id) {
        Users user = null;
        if (usersRepository.findById(id).isPresent()) {
            user = usersRepository.findById(id).get();

            // 将 Users 实体的数据映射到 UserProfileDTO
            UserProfileDTO userProfileDTO = new UserProfileDTO();
            userProfileDTO.setName(user.getName());
            userProfileDTO.setSurname(user.getSurname());
            userProfileDTO.setEmail(user.getEmail());
            userProfileDTO.setPhone(user.getPhone());
            userProfileDTO.setAddress(user.getAddress());
            userProfileDTO.setBirthDate(user.getBirthDate());
            userProfileDTO.setPreferredName(user.getPreferredName());
            userProfileDTO.setGender(user.getGender());
            userProfileDTO.setProfImgUrl(user.getProfImgUrl());
            userProfileDTO.setCommunicatePref(user.getCommunicatePref());
            userProfileDTO.setAvailableDate(user.getAvailableDate());  // 假设你在 Users 实体中也有 List<Date> availableDate
            userProfileDTO.setSkill(user.getSkill());  // 假设你有一个 List<String> skill 的字段
            userProfileDTO.setVerified(user.isVerified());

            return userProfileDTO;
        }

        throw new IllegalArgumentException("User with ID " + id + " not found");
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
            // Combine Specifications
            spec = spec.and(UsersSpecifications.containsAttribute("name", searchTerm)
                            .or(UsersSpecifications.containsAttribute("surname", searchTerm))
                            .or(UsersSpecifications.containsAttribute("preferredName", searchTerm))
                            .or(UsersSpecifications.containsAttribute("gender", searchTerm))
                            .or(UsersSpecifications.containsAttribute("address", searchTerm)))
//                        .or(UsersSpecifications.containsAttribute("availableDate", search)))
                    .and(UsersSpecifications.orderByAverageRate());
        }

        // Add gender filter ( male / female / other )
        if (gender != null && !gender.isEmpty()) {
            spec = spec.and(UsersSpecifications.hasGender(gender));
        }

        // Add distance filter
        if (distance != null && !distance.isEmpty()) {
            spec = spec.and(UsersSpecifications.containsAttribute("distance", distance));
        }

        // Add rating filter
        if (rating != null && !rating.isEmpty()) {
            spec = switch (rating) {
                case "5 stars" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(5.0));
                case "4 stars & up" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(4.0));
                case "3 stars & up" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(3.0));
                case "2 stars & up" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(2.0));
                default -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(1.0));
            };
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
