package com.comp5703.Neighbourhood.Walk.Repository.DummyDataLoader;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
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
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DummyDataLoader(UsersRepository usersRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 清空表中的所有数据（可选）
        usersRepository.deleteAll();

        // 添加4条dummy数据
        Users user1 = new Users();
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setEmail("john.doe@example.com");
        user1.setPassword(passwordEncoder.encode("password123")); // 加密密码
        user1.setPhone("123-456-7890");
        user1.setAddress("123 Maple Street");
        user1.setBirthDate(new Date(1990, 1, 1));
        user1.setGender("male");

        Users user2 = new Users();
        user2.setName("Jane");
        user2.setSurname("Smith");
        user2.setEmail("jane.smith@example.com");
        user2.setPassword(passwordEncoder.encode("password456")); // 加密密码
        user2.setPhone("987-654-3210");
        user2.setAddress("456 Oak Avenue");
        user2.setBirthDate(new Date(1992, 2, 2));
        user2.setGender("female");

        Users user3 = new Users();
        user3.setName("Alice");
        user3.setSurname("Johnson");
        user3.setEmail("alice.johnson@example.com");
        user3.setPassword(passwordEncoder.encode("password789")); // 加密密码
        user3.setPhone("555-555-5555");
        user3.setAddress("789 Birch Road");
        user3.setBirthDate(new Date(1988, 3, 3));
        user3.setGender("female");

        Users user4 = new Users();
        user4.setName("Bob");
        user4.setSurname("Williams");
        user4.setEmail("bob.williams@example.com");
        user4.setPassword(passwordEncoder.encode("password101")); // 加密密码
        user4.setPhone("111-222-3333");
        user4.setAddress("101 Elm Street");
        user4.setBirthDate(new Date(1985, 4, 4));
        user4.setGender("other");

        // 将用户保存到数据库
        usersRepository.saveAll(Arrays.asList(user1, user2, user3, user4));

        System.out.println("Dummy data has been inserted into the Users table.");
    }
}

