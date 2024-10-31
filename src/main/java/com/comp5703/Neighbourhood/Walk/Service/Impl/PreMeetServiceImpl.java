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

    // 1. 根据 parentId 获取所有与该 parent 关联的 PreMeet
    @Override
    public List<PreMeetDTO> getPreMeetsByParentId(long parentId) {
        List<PreMeet> preMeets = preMeetRepository.findAllByParentUserId(parentId);
        return preMeets.stream().map(PreMeetDTO::new).collect(Collectors.toList());
    }

    // 2. 根据 walkerId 获取所有与该 walker 关联的 PreMeet
    @Override
    public List<PreMeetDTO> getPreMeetsByWalkerId(long walkerId) {
        List<PreMeet> preMeets = preMeetRepository.findAllByWalkerUserId(walkerId);

        return preMeets.stream().map(preMeet -> {
            PreMeetDTO dto = new PreMeetDTO(preMeet);
            Users parent = preMeet.getParent(); // 获取与 PreMeet 相关联的 Parent 实体

            // 检查 contactApproach 并更新为对应的 Parent 的 email 或 phone
            if ("Email".equals(preMeet.getContactApproach())) {
                dto.setContactApproach(parent.getEmail()); // 设置为 parent 的 email 地址
            } else if ("Phone".equals(preMeet.getContactApproach())) {
                dto.setContactApproach(parent.getPhone()); // 设置为 parent 的 phone
            }

            return dto;
        }).collect(Collectors.toList());
    }
    // 3. 创建 PreMeet
    @Override
    public PreMeet createPreMeet(PreMeet preMeet, long parentId, long walkerId, int requestId) {
        // 通过 requestId 获取到 request 实体
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));


        // 验证 request 中是否存在 parent 和 walker，如果不存在则报错
        if (request.getParent() == null) {
            throw new IllegalArgumentException("No parent found in the request record, this create operation is invalid!");
        }
        if (request.getWalker() == null) {
            throw new IllegalArgumentException("No walker found in the request record, this create operation is invalid!");
        }

        // 获取 request 关联的 parentId 和 walkerId
        long requestParentId = request.getParent().getId();
        long requestWalkerId = request.getWalker().getId();

        // 验证传入的 parentId 和 walkerId 是否与 request 中的数据匹配
        if (parentId != requestParentId || walkerId != requestWalkerId) {
            throw new IllegalArgumentException("Parent and walker do not match with the request");
        }
        // 检查 request 的 status 是否为 'Accepted'
        if (!"Accepted".equals(request.getStatus())) {
            throw new IllegalArgumentException("Only accepted requests can create a premeet");
        }
        // preMeetDate 不早于当前时间并且不晚于 requestStartDate
        Date requestStartDate = request.getStartTime();
        Date preMeetDate = preMeet.getTime();
        Date currentDate = new Date();

        if (!(preMeetDate.compareTo(currentDate) >= 0 && preMeetDate.compareTo(requestStartDate) <= 0)) {
            throw new IllegalArgumentException("Please make sure that preMeetDate is after current date and before requestStartDate!");
        }
        // 验证通过后，获取 parent 和 walker 实体
        Users parent = usersRepository.findById(parentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent not found with id: " + parentId));
        Users walker = usersRepository.findById(walkerId)
                .orElseThrow(() -> new IllegalArgumentException("Walker not found with id: " + walkerId));

        // 设置 PreMeet 实体中的 parent, walker 和 request
        preMeet.setParent(parent); // 设置父用户
        preMeet.setWalker(walker); // 设置 Walker 用户
        preMeet.setRequest(request); // 设置 Request 实体

        // 添加通知信息
        UserProfileNotification notification = new UserProfileNotification(
                parent,
                "You just created a pre-meet request!",
                "Please check your pre-meet details in pre-meet history module.",
                new Date());
        userProfileNotificationService.saveUserProfileNotification(notification);        // 添加通知信息
        UserProfileNotification notification1 = new UserProfileNotification(
                walker,
                "You just received a pre-meet request!",
                "Please check your pre-meet details in pre-meet history module.",
                new Date());
        userProfileNotificationService.saveUserProfileNotification(notification1);

        // 保存并返回 PreMeet 实体
        return preMeetRepository.save(preMeet);
    }


    // 4. 根据 requestId 获取该 request 相关的 PreMeet
    @Override
    public Optional<PreMeetDTO> getPreMeetByRequestId(int requestId) {
        // 获取 Request 实体
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));

        // 从 PreMeetRepository 中查找与该 Request 关联的 PreMeet 实体
        return preMeetRepository.findByRequest(request)
                // 将 PreMeet 实体转换为 PreMeetDTO
                .map(PreMeetDTO::new);
    }

    // 5. 设置 PreMeet 中的 newOrNot 字段为 false
    @Override
    public void updateNewOrNotStatus(long preMeetId) {
        PreMeet preMeet = preMeetRepository.findById(preMeetId)
                .orElseThrow(() -> new IllegalArgumentException("PreMeet not found with id: " + preMeetId));
        preMeet.setNewOrNot(false);
        preMeetRepository.save(preMeet);
    }

    // 6. 如果该 walkerId 关联的 PreMeet 中，某条 newOrNot 字段为 true，则返回 true
    @Override
    public boolean checkNewPreMeetByWalkerId(long walkerId) {
        return preMeetRepository.existsNewPreMeetByWalkerId(walkerId);
    }
}
