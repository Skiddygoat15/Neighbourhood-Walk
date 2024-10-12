package com.comp5703.Neighbourhood.Walk.Repository.DummyDataLoader;

import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Entities.Role;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Entities.WalkerRequest;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RoleRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Repository.WalkerRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

@Component
public class DummyDataLoader implements CommandLineRunner {

    private final UsersRepository usersRepository;
    private final RoleRepository roleRepository;
    private final RequestRepository requestRepository;
    private final WalkerRequestRepository walkerRequestRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DummyDataLoader(UsersRepository usersRepository, RoleRepository roleRepository, com.comp5703.Neighbourhood.Walk.Repository.RequestRepository requestRepository, WalkerRequestRepository walkerRequestRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.roleRepository = roleRepository;
        this.requestRepository = requestRepository;
        this.walkerRequestRepository = walkerRequestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        usersRepository.deleteAll();
        roleRepository.deleteAll();
        requestRepository.deleteAll();
        walkerRequestRepository.deleteAll();

        Users user1 = new Users();
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setEmail("test1@test.com");
        user1.setPassword(passwordEncoder.encode("password123")); // 加密密码
        user1.setPhone("1234567890");
        user1.setAddress("54 Fitzroy St, Newtown NSW 2042, Australia");
        user1.setLatitude(-33.8945024);
        user1.setLongitude(151.1866821);
        user1.setBirthDate(new Date(90, 0, 0));
        user1.setGender("male");
        user1.setAvgUserRating(5.0);
        user1.setActivityStatus("Offline");

        Users user2 = new Users();
        user2.setName("Jane");
        user2.setSurname("Smith");
        user2.setEmail("test2@test.com");
        user2.setPassword(passwordEncoder.encode("password456")); // 加密密码
        user2.setPhone("9876543210");
        user2.setAddress("31 Leamington Ave, Newtown NSW 2042, Australia");
        user2.setLatitude(-33.8960373);
        user2.setLongitude(151.1869439);
        user2.setBirthDate(new Date(92, 1, 1));
        user2.setGender("female");
        user2.setAvgUserRating(5.0);
        user2.setActivityStatus("Active");

        Users user3 = new Users();
        user3.setName("Alice");
        user3.setSurname("Johnson");
        user3.setEmail("test3@test.com");
        user3.setPassword(passwordEncoder.encode("password789")); // 加密密码
        user3.setPhone("5555555555");
        user3.setAddress("77 Pyrmont Bridge Rd, Annandale NSW 2038, Australia");
        user3.setLatitude(-33.8859592);
        user3.setLongitude(151.1755954);
        user3.setBirthDate(new Date(88, 2, 2));
        user3.setGender("female");
        user3.setAvgUserRating(5.0);
        user3.setActivityStatus("Blocked");

        Users user4 = new Users();
        user4.setName("Bob");
        user4.setSurname("Williams");
        user4.setEmail("test4@test.com");
        user4.setPassword(passwordEncoder.encode("password101")); // 加密密码
        user4.setPhone("1112223333");
        user4.setAddress("107 Annandale St, Annandale NSW 2038, Australia");
        user4.setLatitude(-33.8824012);
        user4.setLongitude(151.1689731);
        user4.setBirthDate(new Date(85, 3, 3));
        user4.setGender("other");
        user4.setAvgUserRating(5.0);
        user4.setActivityStatus("Active");

        Users user5 = new Users();
        user5.setName("admin");
        user5.setSurname("admin");
        user5.setEmail("admin@test.com");
        user5.setPassword(passwordEncoder.encode("123456")); // 加密密码
        user5.setPhone("1112223333");
        user5.setAddress("101 Elm Street");
        user5.setBirthDate(new Date(85, 3, 3));
        user5.setGender("other");
        user5.setAvgUserRating(5.0);
        user5.setActivityStatus("Active");

        // 将用户保存到数据库
        usersRepository.saveAll(Arrays.asList(user1, user2, user3, user4, user5));

        Role role1 = new Role(user1, "parent");
        Role role2 = new Role(user2, "walker");
        Role role3a = new Role(user3, "parent");
        Role role3b = new Role(user3, "walker");
        Role role4a = new Role(user4, "parent");
        Role role4b = new Role(user4, "walker");
        Role role5 = new Role(user5, "admin");
        // 保存角色到数据库
        roleRepository.saveAll(Arrays.asList(role1, role2, role3a, role3b, role4a, role4b, role5));

        // 定义日期格式
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

        Request request1 = new Request();
        request1.setParent(user1);
        request1.setPublishDate( new Date() );
        request1.setStartTime( (Date) formatter.parse("2024-09-20T09:00:00.111") );
        request1.setArriveTime( (Date) formatter.parse("2024-09-20T09:20:00.111") );
        request1.setDeparture("54 Fitzroy St, Newtown NSW 2042, Australia");
        request1.setDepartureLatitude(-33.8960373);
        request1.setDepartureLongitude(151.1869439);
        request1.setDestination("Golden Grove St, Chippendale NSW 2008, Australia");
        request1.setDestinationLatitude(-33.8930788);
        request1.setDestinationLongitude(151.1894845);
        request1.setDetails("Please meet us at Woolworths");
        request1.setStatus("Published");

        Request request2 = new Request();
        request2.setParent(user3);
        request2.setPublishDate( (Date) formatter.parse("2024-09-15T09:00:00.111") );
        request2.setStartTime( (Date) formatter.parse("2024-10-01T07:00:00.111") );
        request2.setArriveTime( (Date) formatter.parse("2024-10-01T08:00:00.111") );
        request2.setDeparture("77 Pyrmont Bridge Rd, Annandale NSW 2038, Australia");
        request2.setDepartureLatitude(-33.8859592);
        request2.setDepartureLongitude(151.1755954);
        request2.setDestination("50 Carillon Ave, Newtown NSW 2042, Australia");
        request2.setDepartureLatitude(-33.8915856);
        request2.setDepartureLongitude(151.185331);
        request2.setDetails("Please meet us at Coles");
        request2.setStatus("Published");

        Request request3 = new Request();
        request3.setParent(user4);
        request3.setPublishDate( (Date) formatter.parse("2024-08-10T09:00:00.111") );
        request3.setStartTime( (Date) formatter.parse("2024-10-16T07:00:00.111") );
        request3.setArriveTime( (Date) formatter.parse("2024-10-16T08:30:00.111") );
        request3.setDeparture("107 Annandale St, Annandale NSW 2038, Australia");
        request3.setDepartureLatitude(-33.8824012);
        request3.setDepartureLongitude(151.1689731);
        request3.setDestination("50 Carillon Ave, Newtown NSW 2042, Australia");
        request3.setDepartureLatitude(-33.8915856);
        request3.setDepartureLongitude(151.185331);
        request3.setDetails("Please meet us at KFC");
        request3.setStatus("Published");

        Request request4 = new Request();
        request4.setParent(user1);
        request4.setWalker(user2);
        request4.setPublishDate( (Date) formatter.parse("2024-08-10T09:00:00.111") );
        request4.setStartTime( (Date) formatter.parse("2024-10-16T07:00:00.111") );
        request4.setArriveTime( (Date) formatter.parse("2024-10-16T08:30:00.111") );
        request4.setDeparture("Westfield");
        request4.setDestination("UNSW");
        request4.setDetails("Please meet us at KFC");
        request4.setStatus("Accepted");

        requestRepository.saveAll(Arrays.asList(request1, request2, request3, request4));
//
//        WalkerRequest walkerRequest1 = new WalkerRequest();
//        walkerRequest1.setRequest(request4);
//        walkerRequest1.setWalker(user2);
//        walkerRequest1.setStatus("Accepted");
//
//        walkerRequestRepository.saveAll(Arrays.asList(walkerRequest1));

        System.out.println("Dummy data has been inserted into the Users and Roles tables.");
    }
}
