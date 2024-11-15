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
import java.util.stream.Collectors;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    UsersRepository usersRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RoleService roleService;

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
    public void activeUser(long id) {
        Users user =  usersRepository.getById(id);
        user.setActivityStatus("Active");
        usersRepository.save(user);
    }

    @Override
    public void blockUser(long id) {
        Users user =  usersRepository.getById(id);
        user.setActivityStatus("Blocked");
        usersRepository.save(user);
    }

    @Override
    public List<Users> getAllUsers() {
        return (List<Users>) usersRepository.findAll();
    }

    @Override
    public Users registerUser(Users user, String roleType) {
        // Verify that the role is valid
        if (!roleType.equals("parent") && !roleType.equals("walker")) {
            throw new IllegalArgumentException("Invalid role type: " + roleType);
        }

        // Verify that required fields are not empty
        if (user.getName() == null || user.getName().isEmpty() ||
                user.getSurname() == null || user.getSurname().isEmpty() ||
                user.getPhone() == null || user.getPhone().isEmpty() ||
                user.getEmail() == null || user.getEmail().isEmpty() ||
                user.getAddress() == null || user.getAddress().isEmpty() ||
                user.getLatitude() == null || user.getLatitude().isNaN() ||
                user.getLongitude() == null || user.getLongitude().isNaN() ||
                user.getPassword() == null || user.getPassword().isEmpty() ||
                user.getGender() == null || user.getGender().isEmpty() ||
                user.getBirthDate() == null) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // Verify that the birthday cannot be earlier than the current system time
        Date currentDate = new Date(); // Get current system time
        if (user.getBirthDate().after(currentDate)) {
            throw new IllegalArgumentException("Birthdate cannot be in the future.");
        }

        // Verify that the mailbox already exists
        if (usersRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Verify that the mobile phone number already exists
        if (usersRepository.findByPhone(user.getPhone()).isPresent()) {
            throw new IllegalArgumentException("Phone number already in use");
        }

        // Verification Email Format
        if (!user.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Invalid email format");
        }

        if (!(Objects.equals(user.getGender(), "male") || Objects.equals(user.getGender(), "female") || Objects.equals(user.getGender(), "other"))) {
            throw new IllegalArgumentException("Invalid gender");
        }

        // Verify mobile phone number format
        if (!user.getPhone().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and 10 digits");
        }

        // Validate first and last name format (without spaces and special characters)
        if (!user.getName().matches("^[A-Za-z]+$") || !user.getSurname().matches("^[A-Za-z]+$")) {
            throw new IllegalArgumentException("Name and surname must not contain spaces or special characters");
        }

        // Authentication password length must be greater than 6
        if (user.getPassword().length() < 6) {
            throw new IllegalArgumentException("The password length must be at least 6 characters.");
        }

        // Encrypt passwords with bcrypt
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));

        user.setProfImgUrl("/profileImages/profileImg_men_1.png");

        // Save user information to the Users table
        Users savedUser = usersRepository.save(user);

        // Save the role information to the Role table and associate it with the user
        roleService.saveRole(savedUser.getId(), roleType);

        // Adding a notification message
        UserProfileNotification notification = new UserProfileNotification(
                savedUser,
                "You have successfully registered",
                "We're thrilled to welcome you! Feel free to explore the app and its features.",
                new Date());
        notificationService.saveUserProfileNotification(notification);

        return savedUser;
    }

    @Override
    public int updateUserImgUrl(String url, Long userId){
        return usersRepository.updateUserImage(url, userId);
    }

    @Override
    public Users updateUserViaAuth(Users user, String roleType, long userId) {
        // Validate role type
        if (!roleType.equals("parent") && !roleType.equals("walker")) {
            throw new IllegalArgumentException("Invalid role type: " + roleType);
        }
        System.out.println("Registering user: " + user.getId() + " with role: " + roleType);
        // Validate required fields
        if (user.getPhone() == null || user.getPhone().isEmpty() ||
                user.getAddress() == null || user.getAddress().isEmpty() ||
                user.getLatitude() == null || user.getLatitude().isNaN() ||
                user.getLongitude() == null || user.getLongitude().isNaN() ||
                user.getPassword() == null || user.getPassword().isEmpty() ||
                user.getGender() == null || user.getGender().isEmpty() ||
                user.getBirthDate() == null) {
            throw new IllegalArgumentException("All required fields must be filled.");
        }

        // Validate birth date
        Date currentDate = new Date();
        if (user.getBirthDate().after(currentDate)) {
            throw new IllegalArgumentException("Birthdate cannot be in the future.");
        }

        // Validate phone number format
        if (!user.getPhone().matches("^\\d{10}$")) {
            throw new IllegalArgumentException("Phone number must be numeric and 10 digits.");
        }

        // Encrypt password
        String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());

        // Update user in the repository using userId
        int updated = usersRepository.updateUserAuth(
                userId,
                user.getPhone(),
                encodedPassword,
                user.getAddress(),
                user.getLatitude(),
                user.getLongitude(),
                user.getBirthDate(),
                user.getGender(),
                true
        );

        if (updated == 0) {
            throw new IllegalArgumentException("User not found with ID: " + user.getId());
        }

        // Save role information and associate it with the user
        roleService.saveRole(userId, roleType);


        return user;
    }

    @Override
    public String findUserProfImgById(Long id){
        if (usersRepository.findUserByUserId(id) != null)
            return usersRepository.findProfImgUrlByUserId(id);
        else
            throw new IllegalArgumentException("User not found with ID: " + id);
    }

    @Override
    public Users updateUserProfile(long userId, Users updatedUser) {
        // Get user information
        Optional<Users> userOptional = usersRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        Users existingUser = userOptional.get();

        // Get user roles
        List<RoleDTO> roles = roleService.getRolesByUserId(userId);
        boolean isWalker = roles.stream().anyMatch(role -> role.getRoleType().equalsIgnoreCase("walker"));

        // Validating and updating fields that are allowed to be modified
        // Regular Expression Definition
        Pattern phonePattern = Pattern.compile("^[0-9]{10}$");
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"); // Email format validation

        // Validating and updating fields that are allowed to be modified
        if (updatedUser.getPreferredName() != null) {
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
        if (updatedUser.getAddress() != null && updatedUser.getLatitude() != null && updatedUser.getLongitude() != null) {
            existingUser.setAddress(updatedUser.getAddress());
            existingUser.setLatitude(updatedUser.getLatitude());
            existingUser.setLongitude(updatedUser.getLongitude());
        }

        // Validating and updating fields that are only allowed to be modified by the Walker role
        if (updatedUser.getAvailableDate() != null || updatedUser.getSkill() != null) {
            if (isWalker) {
                if (updatedUser.getAvailableDate() != null) {
                    List<Date> availableDates = updatedUser.getAvailableDate();
                    Date currentDate = new Date();

                    // Verify that the availableDates length must be 2 for the date comparison to work.
                    if (availableDates.size() >= 2) {
                        Date startDate = availableDates.get(0);
                        Date endDate = availableDates.get(1);

                        // Ensure that startDate and endDate are both after the current time.
                        if (startDate.before(currentDate) || endDate.before(currentDate)) {
                            throw new IllegalArgumentException("Start date and end date must be later than the current date.");
                        }

                        // Make sure the endDate is after the startDate
                        if (endDate.before(startDate)) {
                            throw new IllegalArgumentException("End date must be after the start date.");
                        }
                    } else {
                        throw new IllegalArgumentException("Available dates must include both start date and end date.");
                    }

                    // If validation passes, update the availableDate list
                    existingUser.setAvailableDate(availableDates);
                }

                if (updatedUser.getSkill() != null) {
                    existingUser.setSkill(updatedUser.getSkill());
                }
            } else {
                throw new IllegalArgumentException("Only users with the 'walker' role can update available dates and skills.");
            }
        }

        // Save updated user information
        Users savedUser = usersRepository.save(existingUser);

        // Adding a notification message
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
        return usersRepository.findUserByUserId(id);
    }

    public String getUserStatusById(long id) {
        return usersRepository.findActivityStatusByUserId(id);
    }

    @Override
    public UserProfileDTO getUserProfileById(long id) {
        Users user = null;
        if (usersRepository.findById(id).isPresent()) {
            user = usersRepository.findById(id).get();

            // Mapping data from Users entity to UserProfileDTO
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
            userProfileDTO.setAvailableDate(user.getAvailableDate());
            userProfileDTO.setSkill(user.getSkill());
            userProfileDTO.setVerified(user.isVerified());

            return userProfileDTO;
        }

        throw new IllegalArgumentException("User with ID " + id + " not found");
    }

    @Override
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // The radius of the earth in kilometers
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c; // Return distance in kilometers
        return distance;
    }

    @Override
    public List<Users> searchWalkers(Long parentId, String searchTerm, String gender, String distance, String rating) {
        Specification<Users> spec = Specification.where(UsersSpecifications.hasRole("walker"));

        // Check whether the searchTerm is empty or contains only Spaces
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            // If the search criteria are empty, all Walkers are returned
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

        // Add rating filter
        if (rating != null && !rating.isEmpty()) {
            spec = switch (rating) {
                case "5stars" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(5.0));
                case "4stars" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(4.0));
                case "3stars" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(3.0));
                case "2stars" -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(2.0));
                default -> spec.and(UsersSpecifications.hasAvgUserRatingGreaterThanOrEqual(1.0));
            };
        }

        List<Users> users = usersRepository.findAll(spec);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No matching walkers found for the given search criteria.");
        }

        Users currentParent = usersRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("User Information not found"));
        double parentLatitude = currentParent.getLatitude();
        double parentLongitude = currentParent.getLongitude();

        // Add distance filter
        if (distance != null && !distance.isEmpty()) {
            double maxDistanceKm = distance.equals("1km") ? 1 : 2;

            // Calculate distances and filter using the Haversine formula
            users = users.stream()
                    .filter(user -> {
                        // Check for latitude and longitude of departure point
                        Double walkerLatitude = user.getLatitude();
                        Double walkerLongitude = user.getLongitude();

                        // If the latitude and longitude of the departure point is empty, skip this request
                        if (walkerLatitude == null || walkerLongitude == null) {
                            return false; // Filter out this request
                        }

                        // Calculate the distance between two latitudes and longitudes
                        double calculatedDistance = calculateDistance(parentLatitude, parentLongitude, walkerLatitude, walkerLongitude);

                        // Keep only requests that are within distance
                        return calculatedDistance <= maxDistanceKm;
                    })
                    .collect(Collectors.toList());
        }

        // check whether walkers list is empty after filtering
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No walkers found for the given distance constraint.");
        }

        return users;
    }

    @Override
    public Optional<Users> getUserByEmailOrPhone(String emailOrPhone) {
        // First find the user by Email
        Optional<Users> userOptional = usersRepository.findByEmail(emailOrPhone);

        // If you can't find the user, try using Phone
        if (userOptional.isEmpty()) {
            userOptional = usersRepository.findByPhone(emailOrPhone);
        }

        // This returns Optional<Users>, whether it was found by Email or Phone.
        return userOptional;
    }

    public long getTotalUsers() {
        return usersRepository.count();
    }

    public long getUsersByStatus(String status) {
        return usersRepository.countByActivityStatus(status);
    }

}
