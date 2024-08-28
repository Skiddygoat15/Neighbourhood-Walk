package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService{
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
