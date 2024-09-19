package com.comp5703.Neighbourhood.Walk.Controller;

import com.comp5703.Neighbourhood.Walk.Entities.PreMeet;
import com.comp5703.Neighbourhood.Walk.Entities.PreMeetDTO;
import com.comp5703.Neighbourhood.Walk.Entities.Users;
import com.comp5703.Neighbourhood.Walk.Service.PreMeetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/preMeet")
public class PreMeetController {
    @Autowired
    private PreMeetService preMeetService;

    // 1. 根据 parentId 获取所有与该 parent 关联的 PreMeet
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<PreMeetDTO>> getPreMeetsByParentId(@PathVariable("parentId") long parentId) {
        List<PreMeetDTO> preMeets = preMeetService.getPreMeetsByParentId(parentId);
        return new ResponseEntity<>(preMeets, HttpStatus.OK);
    }

    // 2. 根据 walkerId 获取所有与该 walker 关联的 PreMeet
    @GetMapping("/walker/{walkerId}")
    public ResponseEntity<List<PreMeetDTO>> getPreMeetsByWalkerId(@PathVariable("walkerId") long walkerId) {
        List<PreMeetDTO> preMeets = preMeetService.getPreMeetsByWalkerId(walkerId);
        return new ResponseEntity<>(preMeets, HttpStatus.OK);
    }

    // 3. 创建 PreMeet
    @PostMapping("/create/{parentId}/{walkerId}/{requestId}")
    public ResponseEntity<PreMeet> createPreMeet(
            @PathVariable long parentId,
            @PathVariable long walkerId,
            @PathVariable int requestId,
            @RequestBody PreMeet preMeetRequest) {

        // 创建 PreMeet 实体并设置字段
        PreMeet preMeet = new PreMeet();
        preMeet.setTime(preMeetRequest.getTime());
        preMeet.setPreMeetType(preMeetRequest.getPreMeetType());
        preMeet.setContactApproach(preMeetRequest.getContactApproach());
        preMeet.setUrlOrAddress(preMeetRequest.getUrlOrAddress());
        preMeet.setNewOrNot(preMeetRequest.isNewOrNot());

        // 调用 service 来保存 PreMeet 实体
        PreMeet createdPreMeet = preMeetService.createPreMeet(preMeet, parentId, walkerId, requestId);
        return ResponseEntity.ok(createdPreMeet);
    }


    // 4. 根据 requestId 获取该 request 相关的 PreMeet
    @GetMapping("/request/{requestId}")
    public ResponseEntity<PreMeetDTO> getPreMeetByRequestId(@PathVariable("requestId") int requestId) {
        Optional<PreMeetDTO> preMeet = preMeetService.getPreMeetByRequestId(requestId);
        return preMeet.map(meet -> new ResponseEntity<>(meet, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 5. 设置 PreMeet 中的 newOrNot 字段为 false
    @PutMapping("/update/{preMeetId}")
    public ResponseEntity<Void> updateNewOrNotStatus(@PathVariable("preMeetId") long preMeetId) {
        try {
            preMeetService.updateNewOrNotStatus(preMeetId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 6. 检查是否存在某个 walkerId 的 PreMeet，newOrNot 字段为 true
    @GetMapping("/walker/{walkerId}/newOrNot")
    public ResponseEntity<Boolean> checkNewPreMeetByWalkerId(@PathVariable("walkerId") long walkerId) {
        boolean hasNewPreMeet = preMeetService.checkNewPreMeetByWalkerId(walkerId);
        return new ResponseEntity<>(hasNewPreMeet, HttpStatus.OK);
    }
}
