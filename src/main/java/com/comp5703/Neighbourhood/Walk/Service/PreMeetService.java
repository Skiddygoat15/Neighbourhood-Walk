package com.comp5703.Neighbourhood.Walk.Service;

import com.comp5703.Neighbourhood.Walk.Entities.PreMeet;
import com.comp5703.Neighbourhood.Walk.Entities.PreMeetDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Request;
import com.comp5703.Neighbourhood.Walk.Repository.PreMeetRepository;
import com.comp5703.Neighbourhood.Walk.Repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

public interface PreMeetService {

    // 1. Get all the PreMeets associated with the parent by parentId.
    List<PreMeetDTO> getPreMeetsByParentId(long parentId);

    // 2. Get all the PreMeets associated with the walker based on the walkerId.
    List<PreMeetDTO> getPreMeetsByWalkerId(long walkerId);

    // 3. Create PreMeet
    PreMeet createPreMeet(PreMeet preMeet, long parentId, long walkerId, int requestId);

    // 4. Get the PreMeet associated with the request based on the requestId.
    Optional<PreMeetDTO> getPreMeetByRequestId(int requestId);

    // 5. Setting the newOrNot field in PreMeet to false
    void updateNewOrNotStatus(long preMeetId);

    // 6. Returns true if a newOrNot field is true in the PreMeet associated with the walkerId.
    boolean checkNewPreMeetByWalkerId(long walkerId);
}
