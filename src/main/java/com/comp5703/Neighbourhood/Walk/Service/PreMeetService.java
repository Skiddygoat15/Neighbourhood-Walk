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

    // 1. 根据 parentId 获取所有与该 parent 关联的 PreMeet
    List<PreMeetDTO> getPreMeetsByParentId(long parentId);

    // 2. 根据 walkerId 获取所有与该 walker 关联的 PreMeet
    List<PreMeetDTO> getPreMeetsByWalkerId(long walkerId);

    // 3. 创建 PreMeet
    PreMeet createPreMeet(PreMeet preMeet, long parentId, long walkerId, int requestId);

    // 4. 根据 requestId 获取该 request 相关的 PreMeet
    Optional<PreMeetDTO> getPreMeetByRequestId(int requestId);

    // 5. 设置 PreMeet 中的 newOrNot 字段为 false
    void updateNewOrNotStatus(long preMeetId);

    // 6. 如果该 walkerId 关联的 PreMeet 中，某条 newOrNot 字段为 true，则返回 true
    boolean checkNewPreMeetByWalkerId(long walkerId);
}
