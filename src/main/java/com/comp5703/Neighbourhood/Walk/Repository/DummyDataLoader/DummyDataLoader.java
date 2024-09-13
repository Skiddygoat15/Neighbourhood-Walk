package com.comp5703.Neighbourhood.Walk.Repository.DummyDataLoader;

import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;

@Component
public class DummyDataLoader implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DummyDataLoader(UsersRepository usersRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        usersRepository.deleteAll();
        roleRepository.deleteAll();

        Users user1 = new Users();
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setEmail("john.doe@example.com");
        user1.setPassword(passwordEncoder.encode("password123")); // 加密密码
        user1.setPhone("1234567890");
        user1.setAddress("123 Maple Street");
        user1.setBirthDate(new Date(90, 0, 0));
        user1.setGender("male");

        Users user2 = new Users();
        user2.setName("Jane");
        user2.setSurname("Smith");
        user2.setEmail("jane.smith@example.com");
        user2.setPassword(passwordEncoder.encode("password456")); // 加密密码
        user2.setPhone("9876543210");
        user2.setAddress("456 Oak Avenue");
        user2.setBirthDate(new Date(92, 1, 1));
        user2.setGender("female");

        Users user3 = new Users();
        user3.setName("Alice");
        user3.setSurname("Johnson");
        user3.setEmail("alice.johnson@example.com");
        user3.setPassword(passwordEncoder.encode("password789")); // 加密密码
        user3.setPhone("5555555555");
        user3.setAddress("789 Birch Road");
        user3.setBirthDate(new Date(88, 2, 2));
        user3.setGender("female");

        Users user4 = new Users();
        user4.setName("Bob");
        user4.setSurname("Williams");
        user4.setEmail("bob.williams@example.com");
        user4.setPassword(passwordEncoder.encode("password101")); // 加密密码
        user4.setPhone("1112223333");
        user4.setAddress("101 Elm Street");
        user4.setBirthDate(new Date(85, 3, 3));
        user4.setGender("other");

        // 将用户保存到数据库
        usersRepository.saveAll(Arrays.asList(user1, user2, user3, user4));

        Role role1 = new Role(user1, "parent");
        Role role2 = new Role(user2, "walker");
        Role role3a = new Role(user3, "parent");
        Role role3b = new Role(user3, "walker");
        Role role4a = new Role(user4, "parent");
        Role role4b = new Role(user4, "walker");

        // 保存角色到数据库
        roleRepository.saveAll(Arrays.asList(role1, role2, role3a, role3b, role4a, role4b));

        System.out.println("Dummy data has been inserted into the Users and Roles tables.");
    }
}
