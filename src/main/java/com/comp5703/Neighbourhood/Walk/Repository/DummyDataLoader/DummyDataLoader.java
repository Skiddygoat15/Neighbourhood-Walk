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
<<<<<<< Updated upstream
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DummyDataLoader(UsersRepository usersRepository, RoleRepository roleRepository, com.comp5703.Neighbourhood.Walk.Repository.RequestRepository requestRepository, WalkerRequestRepository walkerRequestRepository, BCryptPasswordEncoder passwordEncoder) {
=======
    private final PreMeetRepository preMeetRepository;
    private final ChatBoxRepository chatBoxRepository;
    private final CommentRepository commentRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomRepository chatBarRepository;
    private final NotificationRepository notificationRepository;
    private final UserProfileNotificationRepository userProfileNotificationRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public DummyDataLoader(UsersRepository usersRepository, RoleRepository roleRepository, com.comp5703.Neighbourhood.Walk.Repository.RequestRepository requestRepository, WalkerRequestRepository walkerRequestRepository, PreMeetRepository preMeetRepository, ChatBoxRepository chatBoxRepository, CommentRepository commentRepository, ChatRoomRepository chatRoomRepository, ChatRoomRepository chatBarRepository, NotificationRepository notificationRepository, UserProfileNotificationRepository userProfileNotificationRepository, BCryptPasswordEncoder passwordEncoder) {
>>>>>>> Stashed changes
        this.usersRepository = usersRepository;
        this.roleRepository = roleRepository;
        this.requestRepository = requestRepository;
        this.walkerRequestRepository = walkerRequestRepository;
<<<<<<< Updated upstream
=======
        this.preMeetRepository = preMeetRepository;
        this.chatBoxRepository = chatBoxRepository;
        this.commentRepository = commentRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatBarRepository = chatBarRepository;
        this.notificationRepository = notificationRepository;
        this.userProfileNotificationRepository = userProfileNotificationRepository;
>>>>>>> Stashed changes
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
<<<<<<< Updated upstream
        usersRepository.deleteAll();
        roleRepository.deleteAll();
        requestRepository.deleteAll();
        walkerRequestRepository.deleteAll();

=======
        // 先删除依赖表中的数据，确保删除顺序正确
        chatBarRepository.deleteAll();
        chatBoxRepository.deleteAll();
        chatRoomRepository.deleteAll();
        commentRepository.deleteAll();
        notificationRepository.deleteAll();
        userProfileNotificationRepository.deleteAll();
        preMeetRepository.deleteAll();
        walkerRequestRepository.deleteAll(); // WalkerRequest 可能依赖 Request
        requestRepository.deleteAll();       // Request 依赖 Users
        roleRepository.deleteAll();          // Role 依赖 Users
        usersRepository.deleteAll();         // 依赖关系最少，最后删除
>>>>>>> Stashed changes
        Users user1 = new Users();
        user1.setName("John");
        user1.setSurname("Doe");
        user1.setEmail("test1@test.com");
        user1.setPassword(passwordEncoder.encode("password123")); // 加密密码
        user1.setPhone("1234567890");
        user1.setAddress("123 Maple Street");
        user1.setBirthDate(new Date(90, 0, 0));
        user1.setGender("male");
        user1.setAvgUserRating(5.0);

        Users user2 = new Users();
        user2.setName("Jane");
        user2.setSurname("Smith");
        user2.setEmail("test2@test.com");
        user2.setPassword(passwordEncoder.encode("password456")); // 加密密码
        user2.setPhone("9876543210");
        user2.setAddress("456 Oak Avenue");
        user2.setBirthDate(new Date(92, 1, 1));
        user2.setGender("female");
        user2.setAvgUserRating(5.0);

        Users user3 = new Users();
        user3.setName("Alice");
        user3.setSurname("Johnson");
        user3.setEmail("test3@test.com");
        user3.setPassword(passwordEncoder.encode("password789")); // 加密密码
        user3.setPhone("5555555555");
        user3.setAddress("789 Birch Road");
        user3.setBirthDate(new Date(88, 2, 2));
        user3.setGender("female");
        user3.setAvgUserRating(5.0);

        Users user4 = new Users();
        user4.setName("Bob");
        user4.setSurname("Williams");
        user4.setEmail("test4@test.com");
        user4.setPassword(passwordEncoder.encode("password101")); // 加密密码
        user4.setPhone("1112223333");
        user4.setAddress("101 Elm Street");
        user4.setBirthDate(new Date(85, 3, 3));
        user4.setGender("other");
        user4.setAvgUserRating(5.0);

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

        // 定义日期格式
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

        Request request1 = new Request();
        request1.setParent(user1);
        request1.setPublishDate( new Date() );
        request1.setStartTime( (Date) formatter.parse("2024-09-20T09:00:00.111") );
        request1.setArriveTime( (Date) formatter.parse("2024-09-20T09:20:00.111") );
        request1.setDeparture("Redfern");
        request1.setDestination("Sydney Uni");
        request1.setDetails("Please meet us at Woolworths");
        request1.setStatus("Published");

        Request request2 = new Request();
        request2.setParent(user3);
        request2.setPublishDate( (Date) formatter.parse("2024-09-15T09:00:00.111") );
        request2.setStartTime( (Date) formatter.parse("2024-10-01T07:00:00.111") );
        request2.setArriveTime( (Date) formatter.parse("2024-10-01T08:00:00.111") );
        request2.setDeparture("Broadway");
        request2.setDestination("UTS");
        request2.setDetails("Please meet us at Coles");
        request2.setStatus("Published");

        Request request3 = new Request();
        request3.setParent(user4);
        request3.setPublishDate( (Date) formatter.parse("2024-08-10T09:00:00.111") );
        request3.setStartTime( (Date) formatter.parse("2024-10-16T07:00:00.111") );
        request3.setArriveTime( (Date) formatter.parse("2024-10-16T08:30:00.111") );
        request3.setDeparture("Westfield");
        request3.setDestination("UNSW");
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

        WalkerRequest walkerRequest1 = new WalkerRequest();
        walkerRequest1.setRequest(request4);
        walkerRequest1.setWalker(user2);
        walkerRequest1.setStatus("Accepted");

        walkerRequestRepository.saveAll(Arrays.asList(walkerRequest1));

        System.out.println("Dummy data has been inserted into the Users and Roles tables.");
    }
}
