package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.Specification.UsersSpecifications;
import com.comp5703.Neighbourhood.Walk.Service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService {
    @Autowired
    UsersRepository usersRepository;

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

    //byron
    @Override
    public List<Users> searchWalkers(String search) {
        Specification<Users> spec = Specification.where(UsersSpecifications.hasRole("walker"))
                .and(UsersSpecifications.containsAttribute("name", search)
                        .or(UsersSpecifications.containsAttribute("surname", search))
                        .or(UsersSpecifications.containsAttribute("preferredName", search))
                        .or(UsersSpecifications.containsAttribute("gender", search))
                        .or(UsersSpecifications.containsAttribute("address", search))
                        .or(UsersSpecifications.containsAttribute("availableDate", search)));

        return usersRepository.findAll(spec);
    }
    @Override
    public Users getUserById(long id) {
        // 确保 Optional 中有值，然后调用 get()
//        Users user = null;
//        if (usersRepository.findById(id).isPresent()) {
//            user = usersRepository.findById(id).get();
//        }
        return usersRepository.findById(id).get();
    }
}
