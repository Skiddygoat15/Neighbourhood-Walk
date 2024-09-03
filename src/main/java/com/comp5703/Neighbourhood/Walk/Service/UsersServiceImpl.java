package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService{
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private RoleService roleService;  // 注入 RoleService

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public Users saveUsers(Users user) {
        return usersRepository.save(user);
    }

    @Override
    public Optional<Users> getUsersByEmail(String email) {
        return usersRepository.findByEmail(email);
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
                user.getPassword() == null || user.getPassword().isEmpty()) {
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

        // 验证手机号格式
        if (!user.getPhone().matches("^\\d{1,11}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and up to 11 digits");
        }

        // 验证名字和姓氏格式（不包含空格和特殊字符）
        if (!user.getName().matches("^[A-Za-z]+$") || !user.getSurname().matches("^[A-Za-z]+$")) {
            throw new IllegalArgumentException("Name and surname must not contain spaces or special characters");
        }

        // 对密码进行bcrypt加密
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // 保存用户信息到 Users 表
        Users savedUser = usersRepository.save(user);

        // 保存角色信息到 Role 表，并关联到用户
        roleService.saveRole(savedUser.getId(), roleType);

        return savedUser;
    }

}
