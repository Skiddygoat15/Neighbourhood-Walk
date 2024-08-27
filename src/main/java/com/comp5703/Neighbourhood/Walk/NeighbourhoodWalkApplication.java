package com.comp5703.Neighbourhood.Walk;

import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Arrays;
import java.util.Date;

@SpringBootApplication
public class NeighbourhoodWalkApplication implements CommandLineRunner {

	@Autowired
	private UsersRepository usersRepository;

	public static void main(String[] args) {
		SpringApplication.run(NeighbourhoodWalkApplication.class, args);
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
		user1.setPassword("password123");
		user1.setPhone("123-456-7890");
		user1.setAddress("123 Maple Street");
		user1.setBirthDate(new Date(1990, 1, 1));
		user1.setPreferredName("Johnny");
		user1.setGender("Male");
		user1.setProfImgUrl("http://example.com/johndoe.png");
		user1.setCommunicatePref("Email");
		user1.setAvailableDate(Arrays.asList(new Date(), new Date()));
		user1.setSkill(Arrays.asList("Java", "Spring"));

		Users user2 = new Users();
		user2.setName("Jane");
		user2.setSurname("Smith");
		user2.setEmail("jane.smith@example.com");
		user2.setPassword("password456");
		user2.setPhone("987-654-3210");
		user2.setAddress("456 Oak Avenue");
		user2.setBirthDate(new Date(1992, 2, 2));
		user2.setPreferredName("Janey");
		user2.setGender("Female");
		user2.setProfImgUrl("http://example.com/janesmith.png");
		user2.setCommunicatePref("Phone");
		user2.setAvailableDate(Arrays.asList(new Date(), new Date()));
		user2.setSkill(Arrays.asList("Python", "Django"));

		Users user3 = new Users();
		user3.setName("Alice");
		user3.setSurname("Johnson");
		user3.setEmail("alice.johnson@example.com");
		user3.setPassword("password789");
		user3.setPhone("555-555-5555");
		user3.setAddress("789 Birch Road");
		user3.setBirthDate(new Date(1988, 3, 3));
		user3.setPreferredName("Ali");
		user3.setGender("Female");
		user3.setProfImgUrl("http://example.com/alicejohnson.png");
		user3.setCommunicatePref("Text");
		user3.setAvailableDate(Arrays.asList(new Date(), new Date()));
		user3.setSkill(Arrays.asList("JavaScript", "React"));

		Users user4 = new Users();
		user4.setName("Bob");
		user4.setSurname("Williams");
		user4.setEmail("bob.williams@example.com");
		user4.setPassword("password101");
		user4.setPhone("111-222-3333");
		user4.setAddress("101 Elm Street");
		user4.setBirthDate(new Date(1985, 4, 4));
		user4.setPreferredName("Bobby");
		user4.setGender("Male");
		user4.setProfImgUrl("http://example.com/bobwilliams.png");
		user4.setCommunicatePref("In-person");
		user4.setAvailableDate(Arrays.asList(new Date(), new Date()));
		user4.setSkill(Arrays.asList("C#", "ASP.NET"));

		// 将用户保存到数据库
		usersRepository.saveAll(Arrays.asList(user1, user2, user3, user4));

		System.out.println("Dummy data has been inserted into the Users table.");
	}
}
