package com.comp5703.Neighbourhood.Walk.Service.Impl;

import com.comp5703.Neighbourhood.Walk.Entities.*;
import com.comp5703.Neighbourhood.Walk.Repository.PreMeetRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UserProfileNotificationRepository;
import com.comp5703.Neighbourhood.Walk.Repository.UsersRepository;
import com.comp5703.Neighbourhood.Walk.Service.PreMeetService;
import com.comp5703.Neighbourhood.Walk.Service.UserProfileNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PreMeetServiceImpl implements PreMeetService {
    @Autowired
    private PreMeetRepository preMeetRepository;
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UserProfileNotificationService userProfileNotificationService;

    @Override
    public List<PreMeetDTO> getPreMeetsByParentId(long parentId) {
        List<PreMeet> preMeets = preMeetRepository.findAllByParentUserId(parentId);
        return preMeets.stream().map(PreMeetDTO::new).collect(Collectors.toList());
    }


    @Override
    public List<PreMeetDTO> getPreMeetsByWalkerId(long walkerId) {
        List<PreMeet> preMeets = preMeetRepository.findAllByWalkerUserId(walkerId);

        return preMeets.stream().map(preMeet -> {
            PreMeetDTO dto = new PreMeetDTO(preMeet);
            Users parent = preMeet.getParent();

            if ("Email".equals(preMeet.getContactApproach())) {
                dto.setContactApproach(parent.getEmail());
            } else if ("Phone".equals(preMeet.getContactApproach())) {
                dto.setContactApproach(parent.getPhone());
            }

            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public PreMeet createPreMeet(PreMeet preMeet, long parentId, long walkerId, int requestId) {
        // Retrieve the request entity via requestId
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));


        // Verify if parent and walker are present in the request, throw an error if they are not
        if (request.getParent() == null) {
            throw new IllegalArgumentException("No parent found in the request record, this create operation is invalid!");
        }
        if (request.getWalker() == null) {
            throw new IllegalArgumentException("No walker found in the request record, this create operation is invalid!");
        }

        // Retrieve the parentId and walkerId associated with the request
        long requestParentId = request.getParent().getId();
        long requestWalkerId = request.getWalker().getId();

        // Verify that the passed parentId and walkerId match the data in the request
        if (parentId != requestParentId || walkerId != requestWalkerId) {
            throw new IllegalArgumentException("Parent and walker do not match with the request");
        }
        // Checking if the status of the request is 'Accepted'
        if (!"Accepted".equals(request.getStatus())) {
            throw new IllegalArgumentException("Only accepted requests can create a premeet");
        }
        // preMeetDate is no earlier than the current time and no later than requestStartDate
        Date requestStartDate = request.getStartTime();
        Date preMeetDate = preMeet.getTime();
        Date currentDate = new Date();

        if (!(preMeetDate.compareTo(currentDate) >= 0 && preMeetDate.compareTo(requestStartDate) <= 0)) {
            throw new IllegalArgumentException("Please make sure that preMeetDate is after current date and before requestStartDate!");
        }
        // After the verification passes, the parent and walker entities are obtained
        Users parent = usersRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent not found with id: " + parentId));
        Users walker = usersRepository.findById(walkerId)
                .orElseThrow(() -> new IllegalArgumentException("Walker not found with id: " + walkerId));

        // Set parent, walker, and request in the PreMeet entity
        preMeet.setParent(parent);
        preMeet.setWalker(walker);
        preMeet.setRequest(request);

        // Adding notifications
        UserProfileNotification notification = new UserProfileNotification(
                parent,
                "You just created a pre-meet request!",
                "Please check your pre-meet details in pre-meet history module.",
                new Date());
        userProfileNotificationService.saveUserProfileNotification(notification);
        UserProfileNotification notification1 = new UserProfileNotification(
                walker,
                "You just received a pre-meet request!",
                "Please check your pre-meet details in pre-meet history module.",
                new Date());
        userProfileNotificationService.saveUserProfileNotification(notification1);


        return preMeetRepository.save(preMeet);
    }



    @Override
    public Optional<PreMeetDTO> getPreMeetByRequestId(int requestId) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));

        return preMeetRepository.findByRequest(request)
                .map(PreMeetDTO::new);
    }

    @Override
    public void updateNewOrNotStatus(long preMeetId) {
        PreMeet preMeet = preMeetRepository.findById(preMeetId)
                .orElseThrow(() -> new IllegalArgumentException("PreMeet not found with id: " + preMeetId));
        preMeet.setNewOrNot(false);
        preMeetRepository.save(preMeet);
    }

    // Returns true if any of the newOrNot fields in the PreMeet associated with the walkerId is true
    @Override
    public boolean checkNewPreMeetByWalkerId(long walkerId) {
        return preMeetRepository.existsNewPreMeetByWalkerId(walkerId);
    }
}
